import { useVerifyMutation } from '@/store/api/userApiSlice';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Verify() {
  const params = useParams();
  const verifyToken = params.verifyToken;

  console.log(verifyToken);

  const [requestVerify, { isLoading, isError, error }] = useVerifyMutation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (verifyToken) {
      const verifyAccount = async () => {
        try {
          const res = await requestVerify({ verifyToken });

          console.log(res);

          setMessage(res.data.message);
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
        const errMsg = error.data as { message: string };
        setMessage(errMsg.message);
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

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      {isError ? (
        <div className="mt-4 px-4 py-2 text-white font-semibold bg-red-400 border rounded-lg">
          {message}
        </div>
      ) : (
        <div className="mt-4 px-4 py-2 text-white font-semibold bg-green-400 border rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
}
