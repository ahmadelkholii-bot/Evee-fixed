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
import { Visit } from '../types';

const VISITS_COLLECTION = 'visits';

export function useVisits(patientId: string) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, VISITS_COLLECTION),
      where('patientId', '==', patientId),
      orderBy('visitDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const visitsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Visit[];
        setVisits(visitsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching visits:', err);
        setError('Failed to load visits');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  const addVisit = useCallback(async (visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, VISITS_COLLECTION), {
        ...visit,
        createdAt: now,
        updatedAt: now,
      });
      
      // Update patient's last visit date
      const patientRef = doc(db, 'patients', visit.patientId);
      await updateDoc(patientRef, {
        lastVisitDate: visit.visitDate,
        updatedAt: now,
      });
      
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding visit:', err);
      return { success: false, error: 'Failed to add visit' };
    }
  }, []);

  const updateVisit = useCallback(async (id: string, updates: Partial<Visit>) => {
    try {
      const visitRef = doc(db, VISITS_COLLECTION, id);
      await updateDoc(visitRef, {
        ...updates,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating visit:', err);
      return { success: false, error: 'Failed to update visit' };
    }
  }, []);

  const deleteVisit = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, VISITS_COLLECTION, id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting visit:', err);
      return { success: false, error: 'Failed to delete visit' };
    }
  }, []);

  return { visits, loading, error, addVisit, updateVisit, deleteVisit };
}
