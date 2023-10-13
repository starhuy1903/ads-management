import { useVerifyMutation } from '@/store/api/userApiSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Status from '../Status';

export default function Verify() {
  const [urlParams] = useSearchParams();
  const verifyToken = urlParams.get('token') || '';

  const [requestVerify, { isLoading, isError, error }] = useVerifyMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (verifyToken) {
      const verifyAccount = async () => {
        try {
          const res = await requestVerify({ verifyToken });

          if (res.data) {
            setIsSuccess(true);
          }
        } catch (err) {
          console.log(err);
        }
      };

      verifyAccount();
    }
  }, [verifyToken]);

  useEffect(() => {
    if (error) {
      if ('data' in error) {
        setIsSuccess(false);
      }
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log(isSuccess);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        {isSuccess ? (
          <Status
            status="success"
            title="Email Verified!"
            description="Your email verification has failed. Please try again."
          >
            <div className="flex justify-center">
              <button
                className="w-1/2 text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Continue
              </button>
            </div>
          </Status>
        ) : (
          <Status
            status="error"
            title="Verification Failed!"
            description="Your email has been verified. Please login to continue."
          >
            <div className="flex justify-center">
              <button
                className="w-1/2 text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Continue
              </button>
            </div>
          </Status>
        )}
      </div>
    </div>
  );
}
