'use client';

import { useState, useEffect } from 'react';
import { Calculator, Calendar, Baby, Clock, AlertCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { calculateFromLMP, calculateFromEDD, calculateFromEGA, formatEGA, getTrimesterName, getTrimesterColor, getFetalDevelopmentInfo, getNextAppointmentRecommendation } from '../utils/obstetrics';
import { ObstetricsData } from '../types';
import { format, parseISO } from 'date-fns';

export default function ObstetricsCalculator() {
  const [mode, setMode] = useState<'lmp' | 'edd' | 'ega'>('lmp');
  const [lmpDate, setLmpDate] = useState('');
  const [eddDate, setEddDate] = useState('');
  const [egaWeeks, setEgaWeeks] = useState('');
  const [egaDays, setEgaDays] = useState('');
  const [result, setResult] = useState<ObstetricsData | null>(null);

  useEffect(() => {
    if (mode === 'lmp' && lmpDate) {
      setResult(calculateFromLMP(lmpDate));
    } else if (mode === 'edd' && eddDate) {
      setResult(calculateFromEDD(eddDate));
    } else if (mode === 'ega' && (egaWeeks || egaDays)) {
      setResult(calculateFromEGA(parseInt(egaWeeks) || 0, parseInt(egaDays) || 0));
    } else {
      setResult(null);
    }
  }, [mode, lmpDate, eddDate, egaWeeks, egaDays]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-pink-500" />
            Obstetrics Calculator
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Calculate EGA, EDD, and trimester information
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'lmp', label: 'From LMP', icon: Calendar },
              { id: 'edd', label: 'From EDD', icon: Baby },
              { id: 'ega', label: 'From EGA', icon: Clock },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    mode === m.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="section-title">Input</h2>

            {mode === 'lmp' && (
              <div>
                <label className="label">Last Menstrual Period (LMP)</label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Enter the first day of the last menstrual period
                </p>
              </div>
            )}

            {mode === 'edd' && (
              <div>
                <label className="label">Estimated Due Date (EDD)</label>
                <input
                  type="date"
                  value={eddDate}
                  onChange={(e) => setEddDate(e.target.value)}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Enter the estimated due date
                </p>
              </div>
            )}

            {mode === 'ega' && (
              <div>
                <label className="label">Estimated Gestational Age (EGA)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Weeks</label>
                    <input
                      type="number"
                      min="0"
                      max="42"
                      value={egaWeeks}
                      onChange={(e) => setEgaWeeks(e.target.value)}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Days</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={egaDays}
                      onChange={(e) => setEgaDays(e.target.value)}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Enter the current gestational age
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
            <h2 className="section-title">Results</h2>

            {result ? (
              <div className="space-y-4">
                {/* EGA */}
                <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg text-white">
                  <p className="text-sm opacity-80">Estimated Gestational Age</p>
                  <p className="text-3xl font-bold">{formatEGA(result.egaWeeks, result.egaDays)}</p>
                </div>

                {/* Grid Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">LMP</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.lmp ? format(parseISO(result.lmp), 'MMM d, yyyy') : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">EDD</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.edd ? format(parseISO(result.edd), 'MMM d, yyyy') : '-'}
                    </p>
                  </div>
                </div>

                {/* Trimester */}
                <div className={`p-4 rounded-lg ${getTrimesterColor(result.trimester)} bg-opacity-20`}>
                  <p className={`text-sm ${getTrimesterColor(result.trimester).replace('bg-', 'text-')}`}>
                    Trimester
                  </p>
                  <p className={`text-xl font-bold ${getTrimesterColor(result.trimester).replace('bg-', 'text-')}`}>
                    {getTrimesterName(result.trimester)}
                  </p>
                </div>

                {/* Development Info */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Fetal Development</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {getFetalDevelopmentInfo(result.egaWeeks)}
                  </p>
                </div>

                {/* Next Appointment */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Next Appointment</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {getNextAppointmentRecommendation(result.egaWeeks)}
                  </p>
                </div>

                {/* Post-term Warning */}
                {result.isPostTerm && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Post-term Pregnancy</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        Immediate evaluation recommended. Consider induction.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Baby className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Enter values to see calculations
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
