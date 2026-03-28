'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useLabResults } from '../../../../hooks';
import Navigation from '../../../../components/Navigation';
import { PREDEFINED_LABS } from '../../../../types';
import { interpretLabResult, getStatusColor } from '../../../../utils/labInterpreter';

export default function NewLabResult() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const { addLabResult } = useLabResults(patientId);
  const [loading, setLoading] = useState(false);
  const [autoInterpret, setAutoInterpret] = useState(true);
  const [selectedTest, setSelectedTest] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [interpretation, setInterpretation] = useState<ReturnType<typeof interpretLabResult> | null>(null);

  const [formData, setFormData] = useState({
    testName: '',
    testCode: '',
    resultValue: '',
    unit: '',
    referenceRange: '',
    isNormal: true,
    notes: '',
    testDate: new Date().toISOString().split('T')[0],
  });

  const handleTestSelect = (code: string) => {
    const test = PREDEFINED_LABS.find(t => t.code === code);
    if (test) {
      setSelectedTest(code);
      setFormData({
        ...formData,
        testName: test.name,
        testCode: test.code,
        unit: test.unit,
        referenceRange: test.normalRange,
      });
    } else if (code === 'CUSTOM') {
      setSelectedTest('CUSTOM');
      setFormData({
        ...formData,
        testName: '',
        testCode: 'CUSTOM',
        unit: '',
        referenceRange: '',
      });
    }
  };

  const handleResultChange = (value: string) => {
    setResultValue(value);
    setFormData({ ...formData, resultValue: value });
    
    if (autoInterpret && selectedTest && selectedTest !== 'CUSTOM') {
      const interp = interpretLabResult(selectedTest, value);
      setInterpretation(interp);
      setFormData(prev => ({ ...prev, isNormal: interp.isNormal }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await addLabResult({
      patientId,
      testName: formData.testName,
      testCode: formData.testCode,
      resultValue: formData.resultValue,
      unit: formData.unit,
      referenceRange: formData.referenceRange,
      isNormal: formData.isNormal,
      notes: formData.notes,
      testDate: formData.testDate,
    });

    if (result.success) {
      router.push(`/patients/${patientId}`);
    } else {
      alert('Failed to add lab result');
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
            <FileText className="w-6 h-6 mr-2 text-pink-500" />
            Add Lab Result
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Selection */}
            <div>
              <label className="label">Test *</label>
              <select
                required
                value={selectedTest}
                onChange={(e) => handleTestSelect(e.target.value)}
                className="input-field"
              >
                <option value="">Select a test</option>
                <optgroup label="Hematology">
                  {PREDEFINED_LABS.filter(t => t.category === 'Hematology').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Liver Function">
                  {PREDEFINED_LABS.filter(t => t.category === 'Liver Function').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Renal Function">
                  {PREDEFINED_LABS.filter(t => t.category === 'Renal Function').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Glucose">
                  {PREDEFINED_LABS.filter(t => t.category === 'Glucose').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Viral Markers">
                  {PREDEFINED_LABS.filter(t => t.category === 'Viral Markers').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Urine">
                  {PREDEFINED_LABS.filter(t => t.category === 'Urine').map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {PREDEFINED_LABS.filter(t => !['Hematology', 'Liver Function', 'Renal Function', 'Glucose', 'Viral Markers', 'Urine'].includes(t.category)).map(test => (
                    <option key={test.code} value={test.code}>{test.name}</option>
                  ))}
                </optgroup>
                <option value="CUSTOM">+ Custom Test</option>
              </select>
            </div>

            {/* Custom Test Name */}
            {selectedTest === 'CUSTOM' && (
              <div>
                <label className="label">Test Name *</label>
                <input
                  type="text"
                  required
                  value={formData.testName}
                  onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                  className="input-field"
                  placeholder="Enter test name"
                />
              </div>
            )}

            {/* Result */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Result *</label>
                <input
                  type="text"
                  required
                  value={resultValue}
                  onChange={(e) => handleResultChange(e.target.value)}
                  className="input-field"
                  placeholder="Enter result"
                />
              </div>
              <div>
                <label className="label">Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="input-field"
                  placeholder="e.g., mg/dL"
                />
              </div>
            </div>

            {/* Auto Interpret */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoInterpret"
                checked={autoInterpret}
                onChange={(e) => setAutoInterpret(e.target.checked)}
                className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
              />
              <label htmlFor="autoInterpret" className="text-gray-700 dark:text-gray-300">
                Auto-interpret result
              </label>
            </div>

            {/* Interpretation Display */}
            {interpretation && autoInterpret && (
              <div className={`p-4 rounded-lg ${getStatusColor(interpretation.isNormal)}`}>
                <p className="font-medium">{interpretation.isNormal ? 'Normal' : 'Abnormal'}</p>
                <p className="text-sm mt-1">{interpretation.message}</p>
              </div>
            )}

            {/* Manual Status (when auto-interpret is off) */}
            {!autoInterpret && (
              <div>
                <label className="label">Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.isNormal}
                      onChange={() => setFormData({ ...formData, isNormal: true })}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-green-600 font-medium">Normal</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={!formData.isNormal}
                      onChange={() => setFormData({ ...formData, isNormal: false })}
                      className="w-4 h-4 text-red-500"
                    />
                    <span className="text-red-600 font-medium">Abnormal</span>
                  </label>
                </div>
              </div>
            )}

            {/* Reference Range */}
            <div>
              <label className="label">Reference Range</label>
              <input
                type="text"
                value={formData.referenceRange}
                onChange={(e) => setFormData({ ...formData, referenceRange: e.target.value })}
                className="input-field"
                placeholder="e.g., 70-100"
              />
            </div>

            {/* Test Date */}
            <div>
              <label className="label">Test Date</label>
              <input
                type="date"
                value={formData.testDate}
                onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
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
                placeholder="Additional notes"
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
                {loading ? 'Saving...' : 'Save Lab Result'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
