import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { defaultTheme } from '@/constants/themes';
import { useAppSelector } from '@/store';

function CustomToaster() {
  const status = useAppSelector(state => state.status);

  useEffect(() => {
    if(status.success?.message) toast.success(status.success.message);
  }, [status.success])

  useEffect(() => {
    if(status.error?.message) toast.error(status.error.message);
  }, [status.error])

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
