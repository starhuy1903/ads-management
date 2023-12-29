import { baseConfigs } from './base';

const configs = {
  apiUrl: 'http://localhost:8194/api',
};

export default Object.freeze({ ...baseConfigs, ...configs });
