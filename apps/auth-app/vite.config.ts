/// <reference types="vitest" />
import { defineConfig, searchForWorkspaceRoot } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => {
  return {
    cacheDir: '../../node_modules/.vite/auth-app',
    server: {
      port: 4200,
      host: 'localhost',
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
    root: `${process.cwd()}/auth-app`,
    resolve: {
      alias: {
        '@/': `${process.cwd()}/auth-app/src/`,
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [react(), nxViteTsPaths()],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },

    build: {
      outDir: 'dist',
    },
  };
});
