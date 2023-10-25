import { ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import CustomToaster from '@/components/CustomToaster';
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
        <CustomToaster />
        <ModalContainer />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
