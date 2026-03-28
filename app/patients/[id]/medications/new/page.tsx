'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pill } from 'lucide-react';
import { useMedications } from '../../../../hooks';
import Navigation from '../../../../components/Navigation';
import { FREQUENCY_OPTIONS } from '../../../../types';

export default function NewMedication() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { addMedication } = useMedications(patientId);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    drugName: '',
    dose: '',
    frequency: 'Once daily',
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await addMedication({
      patientId,
      drugName: formData.drugName,
      dose: formData.dose,
      frequency: formData.frequency,
      duration: formData.duration,
      startDate: formData.startDate,
      notes: formData.notes,
      isActive: formData.isActive,
    });

    if (result.success) {
      router.push(`/patients/${patientId}`);
    } else {
      alert('Failed to add medication');
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
            <Pill className="w-6 h-6 mr-2 text-pink-500" />
            Add Medication
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drug Name */}
            <div>
              <label className="label">Drug Name *</label>
              <input
                type="text"
                required
                value={formData.drugName}
                onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                className="input-field"
                placeholder="e.g., Paracetamol"
              />
            </div>

            {/* Dose */}
            <div>
              <label className="label">Dose *</label>
              <input
                type="text"
                required
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                className="input-field"
                placeholder="e.g., 500mg"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="label">Frequency *</label>
              <select
                required
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="input-field"
              >
                {FREQUENCY_OPTIONS.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="label">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
                placeholder="e.g., 7 days, 2 weeks"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                placeholder="Additional instructions or notes"
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
                {loading ? 'Saving...' : 'Save Medication'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
