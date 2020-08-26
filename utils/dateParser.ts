import { format, parse, compareDesc } from 'date-fns';

export const parseToDate = (date: string): Date => {
  return parse(date, 'dd/MM/yyyy', new Date());
};

export const formatDateToDD = (date: any, dateFormat: string = 'dd/MM/yyyy'): string => {
  const newDate = new Date(date);
  return format(newDate, dateFormat);
};

export const initNewDate = (dateFormat: string = 'dd/MM/yyyy'): string => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return format(date, dateFormat);
};

export const formatDateToYYYY = (date: string): string => {
  return format(parseToDate(date), 'yyyy/MM/dd');
};

export const compareTwoDate = (startDate: string, endDate: string): number => {
  const temStartDate = parseToDate(startDate);
  const tempEndDate = parseToDate(endDate);
  return compareDesc(temStartDate, tempEndDate);
};
