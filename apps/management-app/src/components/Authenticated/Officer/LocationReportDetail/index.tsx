import { Button, Stack, TextField, Typography } from '@mui/material';
import 'moment-timezone';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
} from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { ReportStatus } from '@/constants/report';
import { useGetReportByIdQuery } from '@/store/api/officerApiSlice';
import { Report } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

export default function LocationReportDetail() {
  const [report, setReport] = useState<Report | undefined>(undefined);
  const { reportId } = useParams<{ reportId: string }>();
  const { data, isLoading, refetch } = useGetReportByIdQuery(reportId!);

  useEffect(() => {
    refetch();
  }, [report, refetch]);

  useEffect(() => {
    if (data) {
      setReport(data?.data);
    }
  }, [data]);

  if (isLoading || !report) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Location Report Details">
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'medium',
        }}
      >
        Location Information
      </Typography>

      <Typography variant="h6">Location</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={report?.location?.id} />

        <ReadOnlyTextField label="Name" value={report?.location?.name} />

        <ReadOnlyTextField
          label="Planned"
          value={report?.location?.isPlanning ? 'Yes' : 'No'}
        />

        <ReadOnlyTextField
          label="Status"
          value={capitalize(report?.location?.status)}
        />

        <ReadOnlyTextField
          label="Created Time"
          value={
            report?.location ? formatDateTime(report?.location?.createdAt) : ''
          }
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={
            report?.location ? formatDateTime(report?.location?.updatedAt) : ''
          }
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Address"
          value={report?.location?.fullAddress}
        />

        <ReadOnlyTextField label="Ward" value={report?.location?.ward?.name} />

        <ReadOnlyTextField
          label="District"
          value={report?.location?.district?.name}
        />

        <ReadOnlyTextField label="Latitude" value={report?.location?.lat} />

        <ReadOnlyTextField label="Longtitude" value={report?.location?.long} />
      </Stack>

      <Typography variant="h6">Classification</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Type" value={report?.location?.type?.name} />

        <ReadOnlyTextField
          label="Advertising Type"
          value={report?.location?.adType?.name}
        />
      </Stack>

      <ImageListField images={report?.location?.imageUrls} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: 'medium',
        }}
      >
        Report Information
      </Typography>

      <Typography variant="h6">Report</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={report?.id} />

        <ReadOnlyTextField label="Type" value={report?.reportType?.name} />

        <ReadOnlyTextField label="Full Name" value={report?.fullName} />

        <ReadOnlyTextField label="Email" value={report?.email} />

        <ReadOnlyTextField label="Status" value={capitalize(report?.status)} />

        <ReadOnlyTextField
          label="Created Time"
          value={formatDateTime(report?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(report?.updatedAt)}
        />
      </Stack>

      <TextField
        label="Content"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        value={report?.content}
        multiline
        rows={5}
      />

      <ImageListField images={report?.imageUrls} />
      <Typography variant="h6">Solution</Typography>
      {report?.status === ReportStatus?.NEW ? (
        <Typography
          variant="body1"
          sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
        >
          Not processed yet.
        </Typography>
      ) : (
        <TextField
          label="Response content"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          value={report?.resolvedContent}
          multiline
          rows={3}
        />
      )}

      <Link to={`/reports/${report?.id}/response`}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, color: 'white' }}
        >
          {report?.status === ReportStatus?.NEW
            ? 'Respond to report'
            : 'Update response'}
        </Button>
      </Link>
    </DetailWrapper>
  );
}
