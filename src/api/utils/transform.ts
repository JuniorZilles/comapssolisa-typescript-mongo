import moment from 'moment';

export default (date: string): string => {
  return moment(date, 'DD/MM/YYYY').toISOString();
};
