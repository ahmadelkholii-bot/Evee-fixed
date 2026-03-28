import { ObstetricsData } from '../types';
import { parseISO, format, addDays, differenceInDays } from 'date-fns';

const GESTATION_DAYS = 280; // 40 weeks

export function calculateFromLMP(lmpDate: string): ObstetricsData {
  const lmp = parseISO(lmpDate);
  const today = new Date();
  const edd = addDays(lmp, GESTATION_DAYS);
  
  const diffInDays = differenceInDays(today, lmp);
  const egaWeeks = Math.floor(diffInDays / 7);
  const egaDays = diffInDays % 7;
  
  const trimester = egaWeeks < 13 ? 1 : egaWeeks < 28 ? 2 : 3;
  const isPostTerm = egaWeeks >= 42;
  
  return {
    lmp: format(lmp, 'yyyy-MM-dd'),
    edd: format(edd, 'yyyy-MM-dd'),
    egaWeeks,
    egaDays,
    trimester,
    isPostTerm,
  };
}

export function calculateFromEDD(eddDate: string): ObstetricsData {
  const edd = parseISO(eddDate);
  const today = new Date();
  const lmp = addDays(edd, -GESTATION_DAYS);
  
  const diffInDays = differenceInDays(today, lmp);
  const egaWeeks = Math.floor(diffInDays / 7);
  const egaDays = diffInDays % 7;
  
  const trimester = egaWeeks < 13 ? 1 : egaWeeks < 28 ? 2 : 3;
  const isPostTerm = egaWeeks >= 42;
  
  return {
    lmp: format(lmp, 'yyyy-MM-dd'),
    edd: format(edd, 'yyyy-MM-dd'),
    egaWeeks,
    egaDays,
    trimester,
    isPostTerm,
  };
}

export function calculateFromEGA(weeks: number, days: number): ObstetricsData {
  const today = new Date();
  const totalDays = weeks * 7 + days;
  const lmp = addDays(today, -totalDays);
  const edd = addDays(lmp, GESTATION_DAYS);
  
  const trimester = weeks < 13 ? 1 : weeks < 28 ? 2 : 3;
  const isPostTerm = weeks >= 42;
  
  return {
    lmp: format(lmp, 'yyyy-MM-dd'),
    edd: format(edd, 'yyyy-MM-dd'),
    egaWeeks: weeks,
    egaDays: days,
    trimester,
    isPostTerm,
  };
}

export function getTrimesterName(trimester: number): string {
  switch (trimester) {
    case 1:
      return 'First Trimester';
    case 2:
      return 'Second Trimester';
    case 3:
      return 'Third Trimester';
    default:
      return 'Unknown';
  }
}

export function getTrimesterColor(trimester: number): string {
  switch (trimester) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-amber-500';
    case 3:
      return 'bg-rose-500';
    default:
      return 'bg-gray-500';
  }
}

export function formatEGA(weeks: number, days: number): string {
  if (weeks === 0 && days === 0) return '0 days';
  if (weeks === 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (days === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
  return `${weeks} week${weeks > 1 ? 's' : ''}, ${days} day${days > 1 ? 's' : ''}`;
}

export function getFetalDevelopmentInfo(weeks: number): string {
  if (weeks < 4) return 'Fertilization and implantation';
  if (weeks < 8) return 'Embryonic period - major organs forming';
  if (weeks < 12) return 'Fetal period begins - all organs present';
  if (weeks < 16) return 'Fetal movement may be felt';
  if (weeks < 20) return 'Gender can be determined';
  if (weeks < 24) return 'Viability threshold';
  if (weeks < 28) return 'Rapid brain development';
  if (weeks < 32) return 'Lungs maturing';
  if (weeks < 36) return 'Gaining weight rapidly';
  if (weeks < 40) return 'Full term - ready for birth';
  return 'Post term';
}

export function getNextAppointmentRecommendation(weeks: number): string {
  if (weeks < 28) return 'Every 4 weeks';
  if (weeks < 36) return 'Every 2 weeks';
  if (weeks < 40) return 'Every week';
  return 'Immediate evaluation needed';
}
