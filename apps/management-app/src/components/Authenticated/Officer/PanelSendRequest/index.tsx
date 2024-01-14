import { DevTool } from '@hookform/devtools';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { MAX_ID_LENGTH } from '@/constants/url-params';
import { useLazyGetPanelByIdOfficerQuery } from '@/store/api/officer/panelApiSlide';
import { useCreatePanelRequestMutation } from '@/store/api/officer/requestApiSlide';
import { showError, showSuccess } from '@/utils/toast';
import { isString, isValidLength } from '@/utils/validate';

export default function PanelSendRequest() {
  const navigate = useNavigate();

  const { panelId } = useParams<{ panelId: string }>();
  const userId = useAppSelector((state) => state?.user?.profile?.id);

  const [getPanel] = useLazyGetPanelByIdOfficerQuery();

  useEffect(() => {
    if (
      !panelId ||
      !isString(panelId) ||
      !isValidLength(panelId, MAX_ID_LENGTH)
    ) {
      navigate('/panels', { replace: true });
      return;
    }

    async function fetchData() {
      try {
        const res = await getPanel(panelId!, true).unwrap();
        if (!res) {
          navigate('/panels', { replace: true });
        }
      } catch (error) {
        console.log(error);
        navigate('/panels', { replace: true });
      }
    }

    fetchData();
  }, [getPanel, panelId]);

  const { handleSubmit, register, formState, control } = useForm<{
    reason: string;
  }>({
    mode: 'onChange',
  });

  const { errors: formError } = formState;

  const [sendPanelRequest, { isLoading: isSubmitting }] =
    useCreatePanelRequestMutation();

  const onSubmit = async ({ reason }: { reason: string }) => {
    try {
      if (userId && panelId) {
        await sendPanelRequest({ userId, panelId, reason }).unwrap();

        showSuccess('Licensing request sent successfully');
        navigate('/panels');
      } else {
        showError('Licensing request sent failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DetailWrapper label={`Send Licensing Request for Panel #${panelId}`}>
      <FormControl fullWidth error={!!formError.reason}>
        <FormLabel htmlFor="reason">Reason</FormLabel>
        <TextField
          {...register('reason', {
            required: 'The reason is required.',
          })}
          id="reason"
          error={!!formError.reason}
          aria-describedby="reason-helper-text"
          multiline
          rows={7}
        />
        <FormHelperText id="reason-helper-text">
          {formError.reason?.message}
        </FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
        sx={{ color: 'white' }}
      >
        Submit
      </Button>

      <DevTool control={control} />
    </DetailWrapper>
  );
}
