import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    layout: {
      headerHeight: string;
      drawerWidth: string;
    };
  }
  interface ThemeOptions {
    layout?: {
      headerHeight?: string;
      drawerWidth?: string;
    };
  }
}

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#14B8A6',
      light: '#EDE7F6',
    },
  },
  layout: {
    headerHeight: '80px',
    drawerWidth: '260px',
  },
});

export { defaultTheme };
