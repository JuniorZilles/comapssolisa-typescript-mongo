import moment from 'moment';

export const toISOString = (date: string): string => {
  return moment(date, 'DD/MM/YYYY').toISOString();
};

export const toDate = (date: string): Date => {
  return moment(date, 'DD/MM/YYYY').toDate();
};

export const toNumber = (value: string): number => {
  const cleanValue = value.replace(/[.]/g, '');
  const finalValue = cleanValue.replace(/[,]/g, '.');
  return parseFloat(finalValue);
};
