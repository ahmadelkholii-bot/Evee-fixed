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
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../types';

const PATIENTS_COLLECTION = 'patients';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, PATIENTS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const patientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Patient[];
        setPatients(patientsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPatient = useCallback(async (patient: Omit<Patient, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const patientId = `EVE${Date.now().toString(36).toUpperCase()}`;
      const now = Timestamp.now().toDate().toISOString();
      const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
        ...patient,
        patientId,
        createdAt: now,
        updatedAt: now,
        isActive: true,
      });
      return { success: true, id: docRef.id, patientId };
    } catch (err) {
      console.error('Error adding patient:', err);
      return { success: false, error: 'Failed to add patient' };
    }
  }, []);

  const updatePatient = useCallback(async (id: string, updates: Partial<Patient>) => {
    try {
      const patientRef = doc(db, PATIENTS_COLLECTION, id);
      await updateDoc(patientRef, {
        ...updates,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('Error updating patient:', err);
      return { success: false, error: 'Failed to update patient' };
    }
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    try {
      const patientRef = doc(db, PATIENTS_COLLECTION, id);
      await updateDoc(patientRef, {
        isActive: false,
        updatedAt: Timestamp.now().toDate().toISOString(),
      });
      return { success: true };
    } catch (err) {
      console.error('Error deleting patient:', err);
      return { success: false, error: 'Failed to delete patient' };
    }
  }, []);

  return { patients, loading, error, addPatient, updatePatient, deletePatient };
}

export function usePatient(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;

    const patientRef = doc(db, PATIENTS_COLLECTION, patientId);
    const unsubscribe = onSnapshot(
      patientRef,
      (doc) => {
        if (doc.exists()) {
          setPatient({ id: doc.id, ...doc.data() } as Patient);
        } else {
          setPatient(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [patientId]);

  return { patient, loading, error };
}

export function useSearchPatients(searchTerm: string) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setPatients([]);
      return;
    }

    setLoading(true);
    const searchLower = searchTerm.toLowerCase();
    
    const q = query(
      collection(db, PATIENTS_COLLECTION),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allPatients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];

      const filtered = allPatients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          p.patientId.toLowerCase().includes(searchLower) ||
          p.phoneNumber.includes(searchTerm)
      );

      setPatients(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchTerm]);

  return { patients, loading };
}
