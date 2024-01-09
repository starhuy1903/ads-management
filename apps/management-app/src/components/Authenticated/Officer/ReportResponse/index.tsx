import { DevTool } from '@hookform/devtools';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import { ReadOnlyTextForm } from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { ReportStatus } from '@/constants/report';
import {
  useGetReportByIdQuery,
  useUpdateReportMutation,
} from '@/store/api/officer/reportApiSlice';
import { Report, UpdateReportDto } from '@/types/officer-management';
import { capitalize } from '@/utils/format-string';

export default function ReportResponse() {
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const { reportId } = useParams<{ reportId: string }>();
  const { data, isLoading, refetch } = useGetReportByIdQuery(reportId!);

  useEffect(() => {
    refetch();
  }, [report, refetch]);

  const { handleSubmit, register, formState, control, reset } =
    useForm<UpdateReportDto>({
      mode: 'onChange',
    });

  useEffect(() => {
    if (data) {
      setReport(data);

      reset({
        id: data.id,
        status: data.status,
        resolvedContent: data.resolvedContent,
      });
    }
  }, [data, reset]);

  const { errors: formError } = formState;

  const [updateReport, { isLoading: isSubmitting }] = useUpdateReportMutation();

  const onSubmit = async (data: UpdateReportDto) => {
    try {
      await updateReport(data).unwrap();

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading || !report) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label={`Respond Report #${report?.id}`}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextForm
          field="current-status"
          label="Current Status"
          value={capitalize(report?.status)}
        />

        <FormControl fullWidth error={!!formError.status}>
          <FormLabel htmlFor="status">New Status</FormLabel>
          <Select
            id="status"
            {...register('status')}
            aria-describedby="status-helper-text"
            defaultValue={
              report?.status === ReportStatus?.NEW
                ? ReportStatus?.PENDING
                : report?.status
            }
          >
            <MenuItem key={ReportStatus?.PENDING} value={ReportStatus?.PENDING}>
              {capitalize(ReportStatus?.PENDING)}
            </MenuItem>
            <MenuItem key={ReportStatus?.DONE} value={ReportStatus?.DONE}>
              {capitalize(ReportStatus?.DONE)}
            </MenuItem>
          </Select>
          <FormHelperText id="status-helper-text">
            {formError.status?.message}
          </FormHelperText>
        </FormControl>
      </Stack>

      <FormControl fullWidth error={!!formError.resolvedContent}>
        <FormLabel htmlFor="resolvedContent">Solution</FormLabel>
        <TextField
          {...register('resolvedContent', {
            required: 'The solution is required.',
          })}
          id="resolvedContent"
          error={!!formError.resolvedContent}
          aria-describedby="resolvedContent-helper-text"
          multiline
          rows={7}
        />
        <FormHelperText id="resolvedContent-helper-text">
          {formError.resolvedContent?.message}
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
