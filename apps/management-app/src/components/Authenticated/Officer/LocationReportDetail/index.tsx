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
import { useGetReportByIdQuery } from '@/store/api/officerApiSlice';
import { Report } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function LocationReportDetail() {
  const [report, setReport] = useState<Report | undefined>(undefined);
  const { reportId } = useParams<{ reportId: string }>();
  const { data, isLoading } = useGetReportByIdQuery(reportId!);

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
      {/* Report information */}
      <Typography variant="h6">Report information</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={report?.id} />

        <ReadOnlyTextField label="Type" value={report?.reportType?.name} />

        <ReadOnlyTextField
          label="Created Time"
          value={formatDateTime(report?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(report?.updatedAt)}
        />

        <ReadOnlyTextField label="Status" value={report?.status} />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={report?.location?.id} />

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

        <ReadOnlyTextField
          label="Panned"
          value={report?.location?.isPlanning ? 'Yes' : 'No'}
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

        <ReadOnlyTextField label="Lat" value={report?.location?.lat} />

        <ReadOnlyTextField label="Long" value={report?.location?.long} />
      </Stack>

      {/* Reporter */}
      <Typography variant="h6">Reporter information</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="Full name" value={report?.fullName} />

        <ReadOnlyTextField label="Email" value={report?.email} />
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

      {/* Solution */}
      <Typography variant="h6">Solution</Typography>
      {report?.resolvedContent === '' ? (
        <>
          <Typography
            variant="body1"
            sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
          >
            Not processed yet.
          </Typography>

          <Link to={`/location-reports/${report?.id}/response`}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, color: 'white' }}
            >
              Respond to report
            </Button>
          </Link>
        </>
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
    </DetailWrapper>
  );
}
