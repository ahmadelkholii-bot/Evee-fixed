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
import { Medication } from '../types';

const MEDICATIONS_COLLECTION = 'medications';

export function useMedications(patientId: string) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, MEDICATIONS_COLLECTION),
      where('patientId', '==', patientId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const meds = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Medication[];
        setMedications(meds);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching medications:', err);
        setError('Failed to load medications');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  const addMedication = useCallback(async (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, MEDICATIONS_COLLECTION), {
        ...medication,
        createdAt: now,
        updatedAt: now,
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding medication:', err);
      return { success: false, error: 'Failed to add medication' };
    }
  }, []);

  const updateMedication = useCallback(async (id: string, updates: Partial<Medication>) => {
    try {
      const medRef = doc(db, MEDICATIONS_COLLECTION, id);
      await updateDoc(medRef, {
        ...updates,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating medication:', err);
      return { success: false, error: 'Failed to update medication' };
    }
  }, []);

  const deleteMedication = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, MEDICATIONS_COLLECTION, id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting medication:', err);
      return { success: false, error: 'Failed to delete medication' };
    }
  }, []);

  return { medications, loading, error, addMedication, updateMedication, deleteMedication };
}
