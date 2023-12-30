import devConfigs from './dev';
import localConfigs from './local';
import mockConfigs from './mock';

// Mock
let currentConfigs = mockConfigs;

switch (import.meta.env.MODE) {
  case 'local-be':
    currentConfigs = localConfigs;
    break;
  case 'development':
    currentConfigs = devConfigs;
    break;
  case 'production':
    currentConfigs = devConfigs; // TODO: config prod
    break;
}

export const configs = { ...currentConfigs };
