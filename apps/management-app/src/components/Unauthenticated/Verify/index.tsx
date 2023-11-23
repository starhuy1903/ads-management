import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { isApiErrorResponse } from '@/store/api/helper';
import { useVerifyMutation } from '@/store/api/userApiSlice';
import { showError } from '@/utils/toast';
import CenterLoading from '../../Common/CenterLoading';
import Status from '../../Common/Status';

export default function Verify() {
  const [urlParams] = useSearchParams();
  const verifyToken = urlParams.get('token') || '';

  const [requestVerify, { isLoading }] = useVerifyMutation();
  const [isSent, setIsSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (verifyToken) {
      const verifyAccount = async () => {
        try {
          const res = await requestVerify({ verifyToken }).unwrap();

          if (res.statusCode === 200) {
            setIsSuccess(true);
          }
        } catch (err) {
          if (isApiErrorResponse(err)) {
            showError(err.data.message);
          }
        }

        setIsSent(true);
      };

      verifyAccount();
    }
  }, [verifyToken, requestVerify]);

  if (isLoading || !isSent) {
    return <CenterLoading />;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        {isSuccess ? (
          <Status
            status="success"
            title="Email Verified!"
            description="Your email has been verified. Please login to continue."
          >
            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-white bg-[#7F56D9] py-2 px-8 rounded-lg font-semibold"
              >
                Continue
              </Link>
            </div>
          </Status>
        ) : (
          <Status
            status="error"
            title="Verification Failed!"
            description="Your email verification has failed. Please try again."
          >
            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-white bg-[#7F56D9] py-2 px-8 rounded-lg font-semibold"
              >
                Try again
              </Link>
            </div>
          </Status>
        )}
      </div>
    </div>
  );
}
