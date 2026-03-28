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
import { ImagingRecord } from '../types';

const IMAGING_COLLECTION = 'imagingRecords';

export function useImaging(patientId: string) {
  const [imagingRecords, setImagingRecords] = useState<ImagingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const q = query(
      collection(db, IMAGING_COLLECTION),
      where('patientId', '==', patientId),
      orderBy('imagingDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ImagingRecord[];
        setImagingRecords(records);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching imaging records:', err);
        setError('Failed to load imaging records');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  const addImagingRecord = useCallback(async (record: Omit<ImagingRecord, 'id' | 'createdAt'>) => {
    try {
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, IMAGING_COLLECTION), {
        ...record,
        createdAt: now,
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding imaging record:', err);
      return { success: false, error: 'Failed to add imaging record' };
    }
  }, []);

  const updateImagingRecord = useCallback(async (id: string, updates: Partial<ImagingRecord>) => {
    try {
      const recordRef = doc(db, IMAGING_COLLECTION, id);
      await updateDoc(recordRef, updates);
      return { success: true };
    } catch (err) {
      console.error('Error updating imaging record:', err);
      return { success: false, error: 'Failed to update imaging record' };
    }
  }, []);

  const deleteImagingRecord = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, IMAGING_COLLECTION, id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting imaging record:', err);
      return { success: false, error: 'Failed to delete imaging record' };
    }
  }, []);

  return { imagingRecords, loading, error, addImagingRecord, updateImagingRecord, deleteImagingRecord };
}
