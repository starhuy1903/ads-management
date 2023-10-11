import { defaultTheme } from '@/constants/themes';
import { Toaster } from 'react-hot-toast';

function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        success: {
          duration: 3000,
          style: {
            color: defaultTheme.palette.common.white,
            background: defaultTheme.palette.success.main,
          },
          iconTheme: {
            primary: defaultTheme.palette.common.white,
            secondary: defaultTheme.palette.success.main,
          },
        },
        error: {
          duration: 5000,
          style: {
            color: defaultTheme.palette.common.white,
            background: defaultTheme.palette.error.main,
          },
          iconTheme: {
            primary: defaultTheme.palette.common.white,
            secondary: defaultTheme.palette.error.main,
          },
        },
      }}
    />
  );
}

export default CustomToaster;
