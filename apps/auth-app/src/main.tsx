import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import App from './components/App';
import store from './store';
import CustomToaster from '@/components/CustomToaster';
import { defaultTheme } from '@/constants/themes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <CustomToaster />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
