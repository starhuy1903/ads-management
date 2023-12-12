// Font from MUI
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import CustomToaster from '@/components/Common/CustomToaster';
import { defaultTheme } from '@/constants/themes';
import App from './components/App';
import { ModalContainer } from './components/Modals';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CustomToaster />
          <ModalContainer />
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
