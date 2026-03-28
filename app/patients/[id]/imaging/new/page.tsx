'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useImaging } from '../../../../hooks';
import Navigation from '../../../../components/Navigation';
import { IMAGING_TYPES } from '../../../../types';

export default function NewImaging() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { addImagingRecord } = useImaging(patientId);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    imagingType: 'Ultrasound',
    bodyPart: '',
    findings: '',
    impression: '',
    radiologist: '',
    notes: '',
    imagingDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await addImagingRecord({
      patientId,
      imagingType: formData.imagingType,
      bodyPart: formData.bodyPart,
      findings: formData.findings,
      impression: formData.impression,
      radiologist: formData.radiologist,
      notes: formData.notes,
      imagingDate: formData.imagingDate,
    });

    if (result.success) {
      router.push(`/patients/${patientId}`);
    } else {
      alert('Failed to add imaging record');
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
            <ImageIcon className="w-6 h-6 mr-2 text-pink-500" />
            Add Imaging Record
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imaging Type */}
            <div>
              <label className="label">Imaging Type *</label>
              <select
                required
                value={formData.imagingType}
                onChange={(e) => setFormData({ ...formData, imagingType: e.target.value })}
                className="input-field"
              >
                {IMAGING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Body Part */}
            <div>
              <label className="label">Body Part *</label>
              <input
                type="text"
                required
                value={formData.bodyPart}
                onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                className="input-field"
                placeholder="e.g., Abdomen, Pelvis"
              />
            </div>

            {/* Findings */}
            <div>
              <label className="label">Findings</label>
              <textarea
                rows={4}
                value={formData.findings}
                onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                className="input-field"
                placeholder="Imaging findings..."
              />
            </div>

            {/* Impression */}
            <div>
              <label className="label">Impression</label>
              <textarea
                rows={3}
                value={formData.impression}
                onChange={(e) => setFormData({ ...formData, impression: e.target.value })}
                className="input-field"
                placeholder="Radiologist's impression..."
              />
            </div>

            {/* Radiologist */}
            <div>
              <label className="label">Radiologist</label>
              <input
                type="text"
                value={formData.radiologist}
                onChange={(e) => setFormData({ ...formData, radiologist: e.target.value })}
                className="input-field"
                placeholder="Radiologist name"
              />
            </div>

            {/* Imaging Date */}
            <div>
              <label className="label">Imaging Date</label>
              <input
                type="date"
                value={formData.imagingDate}
                onChange={(e) => setFormData({ ...formData, imagingDate: e.target.value })}
                className="input-field"
              />
            </div>

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
                {loading ? 'Saving...' : 'Save Imaging Record'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
