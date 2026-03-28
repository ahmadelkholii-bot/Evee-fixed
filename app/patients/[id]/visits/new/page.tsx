'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import { useVisits } from '../../../../hooks';
import Navigation from '../../../../components/Navigation';

export default function NewVisit() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { addVisit } = useVisits(patientId);
  const [loading, setLoading] = useState(false);
  const [addVitals, setAddVitals] = useState(false);
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    diagnosis: '',
    differentialDiagnosis: '',
    plan: '',
    prescriptions: '',
    followUpDate: '',
    notes: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      fundalHeight: '',
      fetalHeartRate: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await addVisit({
      patientId,
      visitDate: formData.visitDate,
      chiefComplaint: formData.chiefComplaint,
      historyOfPresentIllness: formData.historyOfPresentIllness,
      physicalExamination: formData.physicalExamination,
      diagnosis: formData.diagnosis,
      differentialDiagnosis: formData.differentialDiagnosis,
      plan: formData.plan,
      prescriptions: formData.prescriptions,
      followUpDate: formData.followUpDate || undefined,
      notes: formData.notes,
      vitalSigns: addVitals ? {
        bloodPressure: formData.vitalSigns.bloodPressure,
        heartRate: parseInt(formData.vitalSigns.heartRate) || 0,
        respiratoryRate: parseInt(formData.vitalSigns.respiratoryRate) || 0,
        temperature: parseFloat(formData.vitalSigns.temperature) || 0,
        oxygenSaturation: parseInt(formData.vitalSigns.oxygenSaturation) || 0,
        weight: parseFloat(formData.vitalSigns.weight) || 0,
        height: parseFloat(formData.vitalSigns.height) || 0,
        fundalHeight: parseFloat(formData.vitalSigns.fundalHeight) || 0,
        fetalHeartRate: parseInt(formData.vitalSigns.fetalHeartRate) || 0,
      } : undefined,
    });

    if (result.success) {
      router.push(`/patients/${patientId}`);
    } else {
      alert('Failed to add visit');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href={`/patients/${patientId}`}
          className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Patient
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Stethoscope className="w-6 h-6 mr-2 text-pink-500" />
            Add Visit
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Date */}
            <div>
              <label className="label">Visit Date *</label>
              <input
                type="date"
                required
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Chief Complaint */}
            <div>
              <label className="label">Chief Complaint *</label>
              <textarea
                required
                rows={2}
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="input-field"
                placeholder="Patient's main complaint"
              />
            </div>

            {/* History */}
            <div>
              <label className="label">History of Present Illness</label>
              <textarea
                rows={3}
                value={formData.historyOfPresentIllness}
                onChange={(e) => setFormData({ ...formData, historyOfPresentIllness: e.target.value })}
                className="input-field"
                placeholder="Detailed history"
              />
            </div>

            {/* Physical Examination */}
            <div>
              <label className="label">Physical Examination</label>
              <textarea
                rows={3}
                value={formData.physicalExamination}
                onChange={(e) => setFormData({ ...formData, physicalExamination: e.target.value })}
                className="input-field"
                placeholder="Physical examination findings"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="label">Diagnosis</label>
              <textarea
                rows={2}
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="input-field"
                placeholder="Primary diagnosis"
              />
            </div>

            {/* Plan */}
            <div>
              <label className="label">Plan</label>
              <textarea
                rows={3}
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="input-field"
                placeholder="Treatment plan"
              />
            </div>

            {/* Prescriptions */}
            <div>
              <label className="label">Prescriptions</label>
              <textarea
                rows={2}
                value={formData.prescriptions}
                onChange={(e) => setFormData({ ...formData, prescriptions: e.target.value })}
                className="input-field"
                placeholder="Prescribed medications"
              />
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="label">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Vital Signs Toggle */}
            <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addVitals}
                  onChange={(e) => setAddVitals(e.target.checked)}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
                <span className="font-medium text-gray-900 dark:text-white">Add Vital Signs</span>
              </label>
            </div>

            {/* Vital Signs */}
            {addVitals && (
              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white">Vital Signs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Blood Pressure</label>
                    <input
                      type="text"
                      value={formData.vitalSigns.bloodPressure}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value }
                      })}
                      className="input-field"
                      placeholder="120/80"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={formData.vitalSigns.heartRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value }
                      })}
                      className="input-field"
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitalSigns.temperature}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value }
                      })}
                      className="input-field"
                      placeholder="37.0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitalSigns.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weight: e.target.value }
                      })}
                      className="input-field"
                      placeholder="70"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Fundal Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.vitalSigns.fundalHeight}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, fundalHeight: e.target.value }
                      })}
                      className="input-field"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Fetal Heart Rate</label>
                    <input
                      type="number"
                      value={formData.vitalSigns.fetalHeartRate}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, fetalHeartRate: e.target.value }
                      })}
                      className="input-field"
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="label">Additional Notes</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                placeholder="Any additional notes"
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4 pt-4">
              <Link href={`/patients/${patientId}`} className="flex-1 btn-secondary text-center">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Visit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
