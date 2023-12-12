import { baseConfigs } from './base';

const configs = {
  apiUrl: 'http://localhost:3000/api',
};

export default Object.freeze({ ...baseConfigs, ...configs });
