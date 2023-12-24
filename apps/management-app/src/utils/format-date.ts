import moment from 'moment-timezone';

// Format: "DD/MM/YYYY HH:mm:ss"
export function formatDateTime(date: string) {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
}

// Format: "DD/MM/YYYY"
export function formatDate(date: string) {
  return moment(date).format('DD/MM/YYYY');
}
