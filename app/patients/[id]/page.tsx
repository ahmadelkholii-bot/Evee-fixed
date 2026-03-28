'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Phone, 
  Calendar,
  Baby,
  FileText,
  Pill,
  Image as ImageIcon,
  Stethoscope,
  Plus,
  ChevronRight
} from 'lucide-react';
import { usePatient, useMedicalHistory, useLabResults, useMedications, useImaging, useVisits } from '../../hooks';
import Navigation from '../../components/Navigation';
import { format, parseISO } from 'date-fns';
import { calculateFromLMP, formatEGA, getTrimesterName, getTrimesterColor } from '../../utils/obstetrics';
import { getStatusColor } from '../../utils/labInterpreter';

export default function PatientDetail() {
  const params = useParams();
  const patientId = params.id as string;
  const [activeTab, setActiveTab] = useState<'info' | 'labs' | 'medications' | 'imaging' | 'visits'>('info');

  const { patient, loading: patientLoading } = usePatient(patientId);
  const { history } = useMedicalHistory(patientId);
  const { labResults } = useLabResults(patientId);
  const { medications } = useMedications(patientId);
  const { imagingRecords } = useImaging(patientId);
  const { visits } = useVisits(patientId);

  const obstetricsData = patient?.lmpDate ? calculateFromLMP(patient.lmpDate) : null;

  if (patientLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navigation />
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Patient not found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: 'Info', icon: User },
    { id: 'labs', label: 'Labs', icon: FileText, count: labResults.length },
    { id: 'medications', label: 'Meds', icon: Pill, count: medications.filter(m => m.isActive).length },
    { id: 'imaging', label: 'Imaging', icon: ImageIcon, count: imagingRecords.length },
    { id: 'visits', label: 'Visits', icon: Stethoscope, count: visits.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Patients
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {patient.firstName[0]}{patient.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{patient.patientId}</p>
              </div>
            </div>
            <Link
              href={`/patients/${patientId}/edit`}
              className="inline-flex items-center justify-center space-x-2 btn-secondary"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Link
            href={`/patients/${patientId}/visits/new`}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors"
          >
            <Stethoscope className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Add Visit</span>
          </Link>
          <Link
            href={`/patients/${patientId}/labs/new`}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Add Lab</span>
          </Link>
          <Link
            href={`/patients/${patientId}/medications/new`}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors"
          >
            <Pill className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Add Med</span>
          </Link>
          <Link
            href={`/patients/${patientId}/imaging/new`}
            className="flex items-center justify-center space-x-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium">Add Imaging</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-1 mb-6 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="section-title">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {patient.phoneNumber}
                    </p>
                  </div>
                  {patient.email && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{patient.email}</p>
                    </div>
                  )}
                  {patient.dateOfBirth && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">
                        {format(parseISO(patient.dateOfBirth), 'MMMM d, yyyy')} ({patient.age} years)
                      </p>
                    </div>
                  )}
                  {patient.bloodType && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Blood Type</p>
                      <p className="font-medium text-gray-900 dark:text-white mt-1">{patient.bloodType}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pregnancy Info */}
              {patient.isPregnant && obstetricsData && (
                <div>
                  <h3 className="section-title flex items-center">
                    <Baby className="w-5 h-5 mr-2 text-pink-500" />
                    Pregnancy Information
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <p className="text-sm text-pink-600 dark:text-pink-400">EGA</p>
                      <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                        {formatEGA(obstetricsData.egaWeeks, obstetricsData.egaDays)}
                      </p>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <p className="text-sm text-pink-600 dark:text-pink-400">EDD</p>
                      <p className="text-lg font-bold text-pink-700 dark:text-pink-300">
                        {format(parseISO(obstetricsData.edd!), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <p className="text-sm text-pink-600 dark:text-pink-400">LMP</p>
                      <p className="text-lg font-bold text-pink-700 dark:text-pink-300">
                        {format(parseISO(obstetricsData.lmp!), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${getTrimesterColor(obstetricsData.trimester)} bg-opacity-20`}>
                      <p className={`text-sm ${getTrimesterColor(obstetricsData.trimester).replace('bg-', 'text-')}`}>
                        Trimester
                      </p>
                      <p className={`text-lg font-bold ${getTrimesterColor(obstetricsData.trimester).replace('bg-', 'text-')}`}>
                        {getTrimesterName(obstetricsData.trimester)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Obstetric History */}
              <div>
                <h3 className="section-title">Obstetric History</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{patient.gravida}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gravida</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{patient.para}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Para</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{patient.abortus}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Abortus</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{patient.living}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Living</p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              {history && (
                <div>
                  <h3 className="section-title">Medical History</h3>
                  <div className="space-y-3">
                    {history.medicalConditions && (
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Medical Conditions</p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">{history.medicalConditions}</p>
                      </div>
                    )}
                    {history.surgicalHistory && (
                      <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Surgical History</p>
                        <p className="font-medium text-gray-900 dark:text-white mt-1">{history.surgicalHistory}</p>
                      </div>
                    )}
                    {history.allergyHistory && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">Allergies</p>
                        <p className="font-medium text-red-700 dark:text-red-300 mt-1">{history.allergyHistory}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'labs' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">Lab Results</h3>
                <Link
                  href={`/patients/${patientId}/labs/new`}
                  className="inline-flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </Link>
              </div>
              {labResults.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No lab results recorded</p>
              ) : (
                <div className="space-y-3">
                  {labResults.map((lab) => (
                    <div key={lab.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lab.testName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(parseISO(lab.testDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {lab.resultValue} <span className="text-sm font-normal text-gray-500">{lab.unit}</span>
                          </p>
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor(lab.isNormal)}`}>
                            {lab.isNormal ? 'Normal' : 'Abnormal'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Reference: {lab.referenceRange}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">Medications</h3>
                <Link
                  href={`/patients/${patientId}/medications/new`}
                  className="inline-flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </Link>
              </div>
              {medications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No medications recorded</p>
              ) : (
                <div className="space-y-3">
                  {medications.map((med) => (
                    <div key={med.id} className={`p-4 rounded-lg ${med.isActive ? 'bg-gray-50 dark:bg-slate-700' : 'bg-gray-100 dark:bg-slate-800 opacity-60'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{med.drugName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {med.dose} • {med.frequency}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          med.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {med.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Duration: {med.duration} • Started: {format(parseISO(med.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'imaging' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">Imaging Records</h3>
                <Link
                  href={`/patients/${patientId}/imaging/new`}
                  className="inline-flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </Link>
              </div>
              {imagingRecords.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No imaging records</p>
              ) : (
                <div className="space-y-3">
                  {imagingRecords.map((record) => (
                    <div key={record.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{record.imagingType}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{record.bodyPart}</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(parseISO(record.imagingDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {record.findings && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{record.findings}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">Visit History</h3>
                <Link
                  href={`/patients/${patientId}/visits/new`}
                  className="inline-flex items-center space-x-1 text-pink-500 hover:text-pink-600"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add</span>
                </Link>
              </div>
              {visits.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No visits recorded</p>
              ) : (
                <div className="space-y-3">
                  {visits.map((visit) => (
                    <div key={visit.id} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {format(parseISO(visit.visitDate), 'MMMM d, yyyy')}
                        </p>
                        {visit.followUpDate && (
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                            Follow-up: {format(parseISO(visit.followUpDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{visit.chiefComplaint}</p>
                      {visit.diagnosis && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="font-medium">Diagnosis:</span> {visit.diagnosis}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
