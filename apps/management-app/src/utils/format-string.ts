import _ from 'lodash';

export function capitalize(str?: string) {
  if (!str) {
    return '';
  }
  return _.capitalize(str);
}

export function formatRole(role: string) {
  const roleMap = new Map([
    ['cdo', 'Cultural Department Officer'],
    ['ward_officer', 'Ward Officer'],
    ['district_officer', 'District Officer'],
  ]);

  return roleMap.get(role) || '';
}
