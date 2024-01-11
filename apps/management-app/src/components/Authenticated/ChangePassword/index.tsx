import { DevTool } from '@hookform/devtools';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import {
  useChangePasswordMutation,
  useLogoutMutation,
} from '@/store/api/userApiSlice';
import { logOut } from '@/store/slice/userSlice';
import { ChangePasswordPayload } from '@/types/user';
import auth from '@/utils/auth';
import { showError, showSuccess } from '@/utils/toast';

export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordPayload>({
    mode: 'onChange',
  });
  const formValue = watch();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [logoutRequest] = useLogoutMutation();

  const onSubmit = async (data: ChangePasswordPayload) => {
    try {
      await changePassword(data).unwrap();

      showSuccess('Change password successfully. Logout in 3 seconds');

      // Logout after 3 seconds
      setTimeout(async () => {
        await logoutRequest({
          tokenId: auth.getRefreshToken(),
        });
        dispatch(logOut());
        navigate('/');
      }, 3000);
    } catch (error) {
      console.log(error);
      showError('Change password failed');
    }
  };

  return (
    <DetailWrapper>
      <Typography variant="h6">Change Password</Typography>
      <FormControl fullWidth error={!!errors.oldPassword}>
        <FormLabel htmlFor="oldPassword">Current Password</FormLabel>
        <TextField
          {...register('oldPassword', {
            required: 'Current password is required!',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters!',
            },
            maxLength: {
              value: 20,
              message: 'Password must be at most 20 characters!',
            },
          })}
          type="password"
          id="oldPassword"
          error={!!errors.oldPassword}
          aria-describedby="oldPassword-helper-text"
          disabled={isLoading}
        />
        <FormHelperText id="oldPassword-helper-text">
          {errors.oldPassword?.message}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth error={!!errors.newPassword}>
        <FormLabel htmlFor="newPassword">New Password</FormLabel>
        <TextField
          {...register('newPassword', {
            required: 'The company phone is required.',
          })}
          type="password"
          id="newPassword"
          error={!!errors.newPassword}
          aria-describedby="newPassword-helper-text"
          disabled={isLoading}
        />
        <FormHelperText id="newPassword-helper-text">
          {errors.newPassword?.message}
        </FormHelperText>
      </FormControl>

      <FormControl fullWidth error={!!errors.confirmPassword}>
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <TextField
          {...register('confirmPassword', {
            required: 'Confirm password is required!',
            validate: (value) =>
              value === formValue.newPassword || 'The passwords do not match',
          })}
          type="password"
          id="confirmPassword"
          error={!!errors.confirmPassword}
          aria-describedby="confirmPassword-helper-text"
          disabled={isLoading}
        />
        <FormHelperText id="confirmPassword-helper-text">
          {errors.confirmPassword?.message}
        </FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleSubmit(onSubmit)}
        sx={{ mt: 2, color: 'white' }}
      >
        Submit request
      </Button>

      <DevTool control={control} />
    </DetailWrapper>
  );
}
