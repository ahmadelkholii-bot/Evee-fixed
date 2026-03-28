'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MedicalHistory } from '../types';

const HISTORY_COLLECTION = 'medicalHistory';

export function useMedicalHistory(patientId: string) {
  const [history, setHistory] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const historyRef = doc(db, HISTORY_COLLECTION, patientId);
    const unsubscribe = onSnapshot(
      historyRef,
      (doc) => {
        if (doc.exists()) {
          setHistory({ patientId: doc.id, ...doc.data() } as MedicalHistory);
        } else {
          setHistory(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching medical history:', err);
        setError('Failed to load medical history');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  const saveHistory = useCallback(async (data: Partial<MedicalHistory>) => {
    try {
      const historyRef = doc(db, HISTORY_COLLECTION, patientId);
      const now = Timestamp.now().toDate().toISOString();
      
      if (history) {
        await updateDoc(historyRef, {
          ...data,
          updatedAt: now,
        });
      } else {
        await setDoc(historyRef, {
          patientId,
          medicalConditions: '',
          surgicalHistory: '',
          bloodTransfusionHistory: '',
          hospitalAdmissionHistory: '',
          drugHistory: '',
          allergyHistory: '',
          anticoagulationHistory: '',
          antenatalSteroidsDoses: 0,
          familyHistory: '',
          socialHistory: '',
          obstetricHistory: '',
          gynecologicalHistory: '',
          notes: '',
          ...data,
          updatedAt: now,
        });
      }
      return { success: true };
    } catch (err) {
      console.error('Error saving medical history:', err);
      return { success: false, error: 'Failed to save medical history' };
    }
  }, [patientId, history]);

  return { history, loading, error, saveHistory };
}
