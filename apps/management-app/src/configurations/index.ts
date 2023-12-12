import devConfigs from './dev';
import localConfigs from './local';

// Mock
let currentConfigs = localConfigs;

switch (import.meta.env.MODE) {
  case 'development':
    currentConfigs = devConfigs;
    break;
  // TODO: config prod
}

export const configs = { ...currentConfigs };
