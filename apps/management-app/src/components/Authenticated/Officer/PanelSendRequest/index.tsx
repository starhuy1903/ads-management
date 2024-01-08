import { DevTool } from '@hookform/devtools';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useCreatePanelRequestMutation } from '@/store/api/officerApiSlice';
import { showError } from '@/utils/toast';

export default function PanelSendRequest() {
  const { panelId } = useParams<{ panelId: string }>();
  const navigate = useNavigate();

  const userId = useAppSelector((state) => state?.user?.profile?.id);

  const { handleSubmit, register, formState, control } = useForm<{
    reason: string;
  }>({
    mode: 'onChange',
  });

  const { errors: formError } = formState;

  const [submitting, setSubmitting] = useState(false);

  const [sendPanelRequest] = useCreatePanelRequestMutation();

  const onSubmit = async ({ reason }: { reason: string }) => {
    try {
      if (userId && panelId) {
        setSubmitting(true);

        await sendPanelRequest({ userId, panelId, reason }).unwrap();

        setSubmitting(false);

        navigate(-1);
      } else {
        showError('This panel is not available.');
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
        disabled={submitting}
        onClick={handleSubmit(onSubmit)}
        sx={{ color: 'white' }}
      >
        Submit
      </Button>

      <DevTool control={control} />
    </DetailWrapper>
  );
}
