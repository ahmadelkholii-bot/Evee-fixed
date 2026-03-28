import { PREDEFINED_LABS } from '../types';

export interface InterpretationResult {
  isNormal: boolean;
  message: string;
  severity: 'normal' | 'low' | 'high' | 'critical';
}

export function interpretLabResult(testCode: string, value: string): InterpretationResult {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isNormal: true, message: 'Text result', severity: 'normal' };
  }

  switch (testCode) {
    case 'HGB':
      return interpretHemoglobin(numValue);
    case 'HCT':
      return interpretHematocrit(numValue);
    case 'WBC':
      return interpretWBC(numValue);
    case 'PLT':
      return interpretPlatelets(numValue);
    case 'INR':
      return interpretINR(numValue);
    case 'ALT':
      return interpretALT(numValue);
    case 'AST':
      return interpretAST(numValue);
    case 'CRE':
      return interpretCreatinine(numValue);
    case 'ALB':
      return interpretAlbumin(numValue);
    case 'FBG':
      return interpretFBG(numValue);
    case 'PPBG':
    case 'OGTT':
      return interpretGlucose(numValue, 140);
    case 'TSH':
      return interpretTSH(numValue);
    case 'HbA1c':
      return interpretHbA1c(numValue);
    case 'CA':
      return interpretCalcium(numValue);
    case 'VITD':
      return interpretVitaminD(numValue);
    case 'FERR':
      return interpretFerritin(numValue);
    default:
      return { isNormal: true, message: 'Manual interpretation required', severity: 'normal' };
  }
}

function interpretHemoglobin(value: number): InterpretationResult {
  if (value < 7) return { isNormal: false, message: 'Critical: Severe anemia', severity: 'critical' };
  if (value < 11) return { isNormal: false, message: 'Low: Anemia', severity: 'low' };
  if (value > 16) return { isNormal: false, message: 'High: Polycythemia', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretHematocrit(value: number): InterpretationResult {
  if (value < 33) return { isNormal: false, message: 'Low: Anemia or fluid overload', severity: 'low' };
  if (value > 45) return { isNormal: false, message: 'High: Dehydration or polycythemia', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretWBC(value: number): InterpretationResult {
  if (value < 4.5) return { isNormal: false, message: 'Low: Leukopenia', severity: 'low' };
  if (value > 11) return { isNormal: false, message: 'High: Leukocytosis', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretPlatelets(value: number): InterpretationResult {
  if (value < 50) return { isNormal: false, message: 'Critical: Severe thrombocytopenia', severity: 'critical' };
  if (value < 150) return { isNormal: false, message: 'Low: Thrombocytopenia', severity: 'low' };
  if (value > 400) return { isNormal: false, message: 'High: Thrombocytosis', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretINR(value: number): InterpretationResult {
  if (value > 4) return { isNormal: false, message: 'Critical: High bleeding risk', severity: 'critical' };
  if (value > 1.2) return { isNormal: false, message: 'High: Monitor anticoagulation', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretALT(value: number): InterpretationResult {
  if (value > 200) return { isNormal: false, message: 'Critical: Severe liver damage', severity: 'critical' };
  if (value > 56) return { isNormal: false, message: 'High: Liver enzyme elevation', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretAST(value: number): InterpretationResult {
  if (value > 200) return { isNormal: false, message: 'Critical: Severe liver damage', severity: 'critical' };
  if (value > 40) return { isNormal: false, message: 'High: Liver enzyme elevation', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretCreatinine(value: number): InterpretationResult {
  if (value > 3) return { isNormal: false, message: 'Critical: Severe renal impairment', severity: 'critical' };
  if (value > 1.2) return { isNormal: false, message: 'High: Renal impairment', severity: 'high' };
  if (value < 0.6) return { isNormal: false, message: 'Low: Check muscle mass', severity: 'low' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretAlbumin(value: number): InterpretationResult {
  if (value < 3.5) return { isNormal: false, message: 'Low: Malnutrition/liver disease', severity: 'low' };
  if (value > 5) return { isNormal: false, message: 'High: Dehydration', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretFBG(value: number): InterpretationResult {
  if (value > 300) return { isNormal: false, message: 'Critical: Severe hyperglycemia', severity: 'critical' };
  if (value >= 126) return { isNormal: false, message: 'High: Diabetes mellitus', severity: 'high' };
  if (value >= 100) return { isNormal: false, message: 'Borderline: Pre-diabetes', severity: 'high' };
  if (value < 70) return { isNormal: false, message: 'Low: Hypoglycemia', severity: 'low' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretGlucose(value: number, threshold: number): InterpretationResult {
  if (value > 300) return { isNormal: false, message: 'Critical: Severe hyperglycemia', severity: 'critical' };
  if (value >= 200) return { isNormal: false, message: 'High: Diabetes mellitus', severity: 'high' };
  if (value >= threshold) return { isNormal: false, message: 'Borderline: Impaired glucose', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretTSH(value: number): InterpretationResult {
  if (value > 10) return { isNormal: false, message: 'High: Hypothyroidism', severity: 'high' };
  if (value > 4) return { isNormal: false, message: 'Borderline high', severity: 'high' };
  if (value < 0.4) return { isNormal: false, message: 'Low: Hyperthyroidism', severity: 'low' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretHbA1c(value: number): InterpretationResult {
  if (value >= 6.5) return { isNormal: false, message: 'High: Diabetes mellitus', severity: 'high' };
  if (value >= 5.7) return { isNormal: false, message: 'Borderline: Pre-diabetes', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretCalcium(value: number): InterpretationResult {
  if (value > 12) return { isNormal: false, message: 'Critical: Severe hypercalcemia', severity: 'critical' };
  if (value > 10.5) return { isNormal: false, message: 'High: Hypercalcemia', severity: 'high' };
  if (value < 8.5) return { isNormal: false, message: 'Low: Hypocalcemia', severity: 'low' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

function interpretVitaminD(value: number): InterpretationResult {
  if (value < 12) return { isNormal: false, message: 'Severe deficiency', severity: 'critical' };
  if (value < 20) return { isNormal: false, message: 'Deficiency', severity: 'low' };
  if (value < 30) return { isNormal: false, message: 'Insufficient', severity: 'low' };
  if (value > 100) return { isNormal: false, message: 'Potentially toxic', severity: 'high' };
  return { isNormal: true, message: 'Sufficient', severity: 'normal' };
}

function interpretFerritin(value: number): InterpretationResult {
  if (value < 15) return { isNormal: false, message: 'Low: Iron deficiency', severity: 'low' };
  if (value > 150) return { isNormal: false, message: 'High: Inflammation', severity: 'high' };
  return { isNormal: true, message: 'Normal', severity: 'normal' };
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-700 bg-red-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'low':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-green-600 bg-green-100';
  }
}

export function getStatusColor(isNormal: boolean): string {
  return isNormal ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
}
