import moment from 'moment';

export const formatDate = (isoDate: string) => {
  const date = moment(isoDate);
  return date.format('DD/MM/YYYY');
};
