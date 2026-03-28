'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LabResult } from '../types';

const LABS_COLLECTION = 'labResults';

export function useLabResults(patientId: string) {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, LABS_COLLECTION),
      where('patientId', '==', patientId),
      orderBy('testDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as LabResult[];
        setLabResults(results);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching lab results:', err);
        setError('Failed to load lab results');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  const addLabResult = useCallback(async (labResult: Omit<LabResult, 'id' | 'createdAt'>) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, LABS_COLLECTION), {
        ...labResult,
        createdAt: now,
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding lab result:', err);
      return { success: false, error: 'Failed to add lab result' };
    }
  }, []);

  const updateLabResult = useCallback(async (id: string, updates: Partial<LabResult>) => {
    try {
      const labRef = doc(db, LABS_COLLECTION, id);
      await updateDoc(labRef, updates);
      return { success: true };
    } catch (err) {
      console.error('Error updating lab result:', err);
      return { success: false, error: 'Failed to update lab result' };
    }
  }, []);

  const deleteLabResult = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, LABS_COLLECTION, id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting lab result:', err);
      return { success: false, error: 'Failed to delete lab result' };
    }
  }, []);

  return { labResults, loading, error, addLabResult, updateLabResult, deleteLabResult };
}
