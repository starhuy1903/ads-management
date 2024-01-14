import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
  ReadOnlyTinyEditor,
} from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { ReportStatus } from '@/constants/report';
import { MAX_ID_LENGTH } from '@/constants/url-params';
import { useLazyGetReportByIdOfficerQuery } from '@/store/api/officer/reportApiSlice';
import { Report } from '@/types/officer-management';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';
import { isString, isValidLength } from '@/utils/validate';

export default function PanelReportDetail() {
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const { reportId } = useParams<{ reportId: string }>();

  const [getReport, { isLoading }] = useLazyGetReportByIdOfficerQuery();

  function handleInvalidRequest() {
    setReport(null);
    navigate('/panel-reports', { replace: true });
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
      } catch (error) {
        console.log(error);
        handleInvalidRequest();
      }
    }

    fetchData();
  }, [getReport, reportId]);

  if (isLoading || !report) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label={`Panel Report #${report?.id}`}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'medium',
        }}
      >
        Report Information
      </Typography>

      <Typography variant="h6">Report</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={report?.id} />

        <ReadOnlyTextField label="Full Name" value={report?.fullName} />

        <ReadOnlyTextField label="Email" value={report?.email} />

        <ReadOnlyTextField label="Type" value={report?.reportType?.name} />

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

      <ImageListField images={report?.imageUrls} />

      <ReadOnlyTinyEditor label="Content" value={report?.content} />

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

      <Typography
        variant="h5"
        sx={{
          fontWeight: 'medium',
        }}
      >
        Panel Information
      </Typography>

      <Typography variant="h6">Panel</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={report?.panel?.id} />

        <ReadOnlyTextField label="Type" value={report?.panel?.type?.name} />

        <ReadOnlyTextField label="Width" value={report?.panel?.width} />

        <ReadOnlyTextField label="Height" value={report?.panel?.height} />

        <ReadOnlyTextField
          label="Status"
          value={capitalize(report?.panel?.status)}
        />

        <ReadOnlyTextField
          label="Created Time"
          value={report?.panel ? formatDateTime(report?.panel?.createdAt) : ''}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={report?.panel ? formatDateTime(report?.panel?.updatedAt) : ''}
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="Name" value={report?.panel?.location?.name} />

        <ReadOnlyTextField
          label="Address"
          value={report?.panel?.location?.fullAddress}
        />

        <ReadOnlyTextField
          label="Ward"
          value={report?.panel?.location?.ward?.name}
        />

        <ReadOnlyTextField
          label="District"
          value={report?.panel?.location?.district?.name}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Type"
          value={report?.panel?.location?.type?.name}
        />

        <ReadOnlyTextField
          label="Advertising Type"
          value={report?.panel?.location?.adType?.name}
        />
      </Stack>

      <ImageListField images={report?.panel?.imageUrls} />

      <Typography variant="h6">Company</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="Email" value={report?.panel?.companyEmail} />

        <ReadOnlyTextField label="Phone" value={report?.panel?.companyNumber} />

        <ReadOnlyTextField
          label="Created Contract Time"
          value={
            report?.panel
              ? formatDateTime(report?.panel?.createContractDate)
              : ''
          }
        />

        <ReadOnlyTextField
          label="Expired Contract Time"
          value={
            report?.panel
              ? formatDateTime(report?.panel?.expiredContractDate)
              : ''
          }
        />
      </Stack>

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
