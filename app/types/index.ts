// Patient Types
export interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  age: number;
  bloodType?: string;
  isPregnant: boolean;
  lmpDate?: string;
  eddDate?: string;
  gravida: number;
  para: number;
  abortus: number;
  living: number;
  createdAt: string;
  updatedAt: string;
  lastVisitDate?: string;
  isActive: boolean;
}

export interface MedicalHistory {
  patientId: string;
  medicalConditions: string;
  surgicalHistory: string;
  bloodTransfusionHistory: string;
  hospitalAdmissionHistory: string;
  drugHistory: string;
  allergyHistory: string;
  anticoagulationHistory: string;
  antenatalSteroidsDate?: string;
  antenatalSteroidsDoses: number;
  familyHistory: string;
  socialHistory: string;
  obstetricHistory: string;
  gynecologicalHistory: string;
  notes: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testName: string;
  testCode: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  isNormal: boolean;
  notes: string;
  testDate: string;
  createdAt: string;
}

export interface Medication {
  id: string;
  patientId: string;
  drugName: string;
  dose: string;
  frequency: string;
  duration: string;
  startDate: string;
  endDate?: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImagingRecord {
  id: string;
  patientId: string;
  imagingType: string;
  bodyPart: string;
  notes: string;
  findings: string;
  impression: string;
  radiologist: string;
  imageUrl?: string;
  imagingDate: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitalSigns?: VitalSigns;
  physicalExamination: string;
  diagnosis: string;
  differentialDiagnosis: string;
  plan: string;
  prescriptions: string;
  followUpDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  height: number;
  fundalHeight: number;
  fetalHeartRate: number;
}

// Lab Test Types
export interface LabTestType {
  code: string;
  name: string;
  unit: string;
  normalRange: string;
  pregnancyRange?: string;
  category: string;
}

// Obstetrics Calculation Result
export interface ObstetricsData {
  lmp: string | null;
  edd: string | null;
  egaWeeks: number;
  egaDays: number;
  trimester: number;
  isPostTerm: boolean;
}

// Frequency options for medications
export const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 12 hours',
  'Every 8 hours',
  'Every 6 hours',
  'Every 4 hours',
  'At bedtime',
  'Before meals',
  'After meals',
  'As needed (PRN)',
  'Weekly',
  'Monthly',
];

// Imaging types
export const IMAGING_TYPES = [
  'Ultrasound',
  'CT Scan',
  'MRI',
  'X-Ray',
  'Mammography',
  'Doppler',
  'Other',
];

// Blood types
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Predefined lab tests
export const PREDEFINED_LABS: LabTestType[] = [
  { code: 'CBC', name: 'Complete Blood Count', unit: '', normalRange: 'Varies', category: 'Hematology' },
  { code: 'HGB', name: 'Hemoglobin', unit: 'g/dL', normalRange: '11.0-15.0', pregnancyRange: '11.0-14.0', category: 'Hematology' },
  { code: 'HCT', name: 'Hematocrit', unit: '%', normalRange: '33-45', pregnancyRange: '33-42', category: 'Hematology' },
  { code: 'WBC', name: 'White Blood Cells', unit: '×10³/μL', normalRange: '4.5-11.0', category: 'Hematology' },
  { code: 'PLT', name: 'Platelets', unit: '×10³/μL', normalRange: '150-400', category: 'Hematology' },
  { code: 'INR', name: 'INR', unit: '', normalRange: '0.8-1.2', category: 'Coagulation' },
  { code: 'ALT', name: 'ALT', unit: 'U/L', normalRange: '7-56', category: 'Liver Function' },
  { code: 'AST', name: 'AST', unit: 'U/L', normalRange: '10-40', category: 'Liver Function' },
  { code: 'CRE', name: 'Serum Creatinine', unit: 'mg/dL', normalRange: '0.6-1.2', category: 'Renal Function' },
  { code: 'ALB', name: 'Serum Albumin', unit: 'g/dL', normalRange: '3.5-5.0', category: 'Renal Function' },
  { code: 'FBG', name: 'Fasting Blood Glucose', unit: 'mg/dL', normalRange: '70-100', pregnancyRange: '<95', category: 'Glucose' },
  { code: 'PPBG', name: '2-Hour Postprandial BG', unit: 'mg/dL', normalRange: '<140', pregnancyRange: '<120', category: 'Glucose' },
  { code: 'OGTT', name: 'OGTT', unit: 'mg/dL', normalRange: '<140', category: 'Glucose' },
  { code: 'HIV', name: 'HIV Antibodies', unit: '', normalRange: 'Negative', category: 'Viral Markers' },
  { code: 'HCV', name: 'Hepatitis C Antibody', unit: '', normalRange: 'Negative', category: 'Viral Markers' },
  { code: 'HBsAg', name: 'HBsAg', unit: '', normalRange: 'Negative', category: 'Viral Markers' },
  { code: 'UALB', name: 'Urine Albumin', unit: 'mg/dL', normalRange: '<30', category: 'Urine' },
  { code: 'UA', name: 'Urinalysis', unit: '', normalRange: 'Normal', category: 'Urine' },
  { code: 'UC', name: 'Urine Culture', unit: '', normalRange: 'No growth', category: 'Urine' },
  { code: 'TSH', name: 'TSH', unit: 'mIU/L', normalRange: '0.4-4.0', category: 'Thyroid' },
  { code: 'HbA1c', name: 'Hemoglobin A1C', unit: '%', normalRange: '<5.7', category: 'Glucose' },
  { code: 'FERR', name: 'Ferritin', unit: 'ng/mL', normalRange: '15-150', category: 'Iron' },
  { code: 'VITD', name: 'Vitamin D', unit: 'ng/mL', normalRange: '30-100', category: 'Vitamins' },
  { code: 'CA', name: 'Calcium', unit: 'mg/dL', normalRange: '8.5-10.5', category: 'Electrolytes' },
];
