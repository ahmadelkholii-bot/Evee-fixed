'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Calendar, Droplet, Baby } from 'lucide-react';
import { usePatients } from '../../hooks';
import Navigation from '../../components/Navigation';
import { BLOOD_TYPES } from '../../types';
import { calculateFromLMP } from '../../utils/obstetrics';

export default function NewPatient() {
  const router = useRouter();
  const { addPatient } = usePatients();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    bloodType: '',
    isPregnant: false,
    lmpDate: '',
    gravida: 0,
    para: 0,
    abortus: 0,
    living: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const age = formData.dateOfBirth 
      ? Math.floor((Date.now() - new Date(formData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : 0;

    let eddDate = null;
    if (formData.isPregnant && formData.lmpDate) {
      const obsData = calculateFromLMP(formData.lmpDate);
      eddDate = obsData.edd;
    }

    const result = await addPatient({
      ...formData,
      age,
      eddDate,
      address: '',
      emergencyContact: '',
      lastVisitDate: null,
      isActive: true,
    });

    if (result.success) {
      router.push(`/patients/${result.id}`);
    } else {
      alert('Failed to add patient');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Patients
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Patient</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="input-field pl-10"
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Date of Birth & Blood Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label">Blood Type</label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="input-field pl-10"
                  >
                    <option value="">Select blood type</option>
                    {BLOOD_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pregnancy */}
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPregnant}
                  onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                />
                <span className="font-medium text-gray-900 dark:text-white flex items-center">
                  <Baby className="w-5 h-5 mr-2 text-pink-500" />
                  Currently Pregnant
                </span>
              </label>

              {formData.isPregnant && (
                <div className="mt-4">
                  <label className="label">Last Menstrual Period (LMP)</label>
                  <input
                    type="date"
                    value={formData.lmpDate}
                    onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
            </div>

            {/* Obstetric History */}
            <div>
              <label className="label">Obstetric History</label>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Gravida</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.gravida}
                    onChange={(e) => setFormData({ ...formData, gravida: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Para</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.para}
                    onChange={(e) => setFormData({ ...formData, para: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Abortus</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.abortus}
                    onChange={(e) => setFormData({ ...formData, abortus: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">Living</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.living}
                    onChange={(e) => setFormData({ ...formData, living: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4 pt-4">
              <Link href="/" className="flex-1 btn-secondary text-center">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
