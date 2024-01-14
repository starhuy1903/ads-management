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
import { TargetType } from '@/constants/ads-request';
import { ReportStatus } from '@/constants/report';
import { MAX_ID_LENGTH } from '@/constants/url-params';
import {
  useLazyGetReportByIdOfficerQuery,
  useUpdateReportOfficerMutation,
} from '@/store/api/officer/reportApiSlice';
import { Report, UpdateReportDto } from '@/types/officer-management';
import { capitalize } from '@/utils/format-string';
import { showError, showSuccess } from '@/utils/toast';
import { isString, isValidLength } from '@/utils/validate';

export default function ReportResponse() {
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const { reportId } = useParams<{ reportId: string }>();
  const [getReport, { isLoading }] = useLazyGetReportByIdOfficerQuery();

  const { handleSubmit, register, formState, control, reset } =
    useForm<UpdateReportDto>({
      mode: 'onChange',
    });

  function handleInvalidRequest() {
    setReport(null);
    navigate('/location-reports', { replace: true });
  }

  useEffect(() => {
    if (
      !reportId ||
      !isString(reportId) ||
      !isValidLength(reportId, MAX_ID_LENGTH)
    ) {
      handleInvalidRequest();
      return;
    }

    async function fetchData() {
      try {
        const res = await getReport(reportId!, true).unwrap();

        setReport(res);

        reset({
          id: res.id,
          status: res.status,
          resolvedContent: res.resolvedContent,
        });
      } catch (error) {
        console.log(error);
        handleInvalidRequest();
      }
    }

    fetchData();
  }, [getReport, reportId, reset]);

  const { errors: formError } = formState;

  const [updateReport, { isLoading: isSubmitting }] =
    useUpdateReportOfficerMutation();

  const onSubmit = async (data: UpdateReportDto) => {
    try {
      await updateReport(data).unwrap();

      showSuccess('Response sent successfully');

      if (report?.targetType === TargetType?.LOCATION) {
        navigate('/location-reports');
        return;
      }

      navigate('/panel-reports');
    } catch (error) {
      console.log(error);
      showError('Response sent failed');
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
