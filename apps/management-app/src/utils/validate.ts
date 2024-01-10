import _ from 'lodash';

export function isString(value: any) {
  return _.isString(value);
}

export function isValidLength(value: string, max: number, min?: number) {
  return _.inRange(value.length, min || 0, max + 1);
}
