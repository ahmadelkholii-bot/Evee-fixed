'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Calendar,
  ChevronRight,
  Baby,
  Filter,
  MoreVertical
} from 'lucide-react';
import { usePatients, useSearchPatients } from './hooks';
import Navigation from './components/Navigation';
import { format, parseISO } from 'date-fns';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pregnant' | 'recent'>('all');
  const { patients, loading, error } = usePatients();
  const { patients: searchResults, loading: searchLoading } = useSearchPatients(searchTerm);

  const displayedPatients = useMemo(() => {
    let result = searchTerm ? searchResults : patients;
    
    if (filter === 'pregnant') {
      result = result.filter(p => p.isPregnant);
    } else if (filter === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(p => p.lastVisitDate && parseISO(p.lastVisitDate) >= thirtyDaysAgo);
    }
    
    return result;
  }, [patients, searchResults, searchTerm, filter]);

  const stats = useMemo(() => ({
    total: patients.length,
    pregnant: patients.filter(p => p.isPregnant).length,
    recent: patients.filter(p => {
      if (!p.lastVisitDate) return false;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return parseISO(p.lastVisitDate) >= thirtyDaysAgo;
    }).length,
  }), [patients]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patients</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your patients and their medical records
              </p>
            </div>
            <Link
              href="/patients/new"
              className="inline-flex items-center justify-center space-x-2 btn-primary"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl text-left transition-colors ${
              filter === 'all' 
                ? 'bg-pink-500 text-white' 
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            <p className="text-sm opacity-80">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </button>
          <button
            onClick={() => setFilter(filter === 'pregnant' ? 'all' : 'pregnant')}
            className={`p-4 rounded-xl text-left transition-colors ${
              filter === 'pregnant' 
                ? 'bg-pink-500 text-white' 
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            <p className="text-sm opacity-80">Pregnant</p>
            <p className="text-2xl font-bold">{stats.pregnant}</p>
          </button>
          <button
            onClick={() => setFilter(filter === 'recent' ? 'all' : 'recent')}
            className={`p-4 rounded-xl text-left transition-colors ${
              filter === 'recent' 
                ? 'bg-pink-500 text-white' 
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200'
            }`}
          >
            <p className="text-sm opacity-80">Recent</p>
            <p className="text-2xl font-bold">{stats.recent}</p>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Patient List */}
        {loading || searchLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : displayedPatients.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl">
            <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No patients found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm ? 'Try a different search term' : 'Add your first patient to get started'}
            </p>
            {!searchTerm && (
              <Link href="/patients/new" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Patient</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedPatients.map((patient) => (
              <Link
                key={patient.id}
                href={`/patients/${patient.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl p-4 card-hover border border-gray-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{patient.patientId}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phoneNumber}</span>
                        </span>
                        {patient.age > 0 && (
                          <span>{patient.age} years</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {patient.isPregnant && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs rounded-full">
                            <Baby className="w-3 h-3" />
                            <span>Pregnant</span>
                          </span>
                        )}
                        {patient.lastVisitDate && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            <Calendar className="w-3 h-3" />
                            <span>Last visit: {format(parseISO(patient.lastVisitDate), 'MMM d, yyyy')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
