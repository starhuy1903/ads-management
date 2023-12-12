import { baseConfigs } from './base';

const configs = {
  // apiUrl: 'https://ads-management-api.onrender.com/api',
  apiUrl: 'http://localhost:3000/api',
};

export default Object.freeze({ ...baseConfigs, ...configs });
