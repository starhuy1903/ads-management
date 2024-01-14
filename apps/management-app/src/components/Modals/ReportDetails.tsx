import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import parse from 'html-react-parser';
import { useCallback } from 'react';
import {
  CreatedLocationReport,
  CreatedPanelReport,
  CreatedReport,
} from '@/types/report';
import { formatDateTime } from '@/utils/datetime';
import GeneralModal from './GeneralModal';

interface ReportDetailProps {
  reports: CreatedReport[];
  createNew: () => void;
  onModalClose: () => void;
}

const isLocationReport = (
  report: CreatedReport,
): report is CreatedLocationReport => {
  return report.targetType === 'Location';
};

const isPanelReport = (report: CreatedReport): report is CreatedPanelReport => {
  return report.targetType === 'Panel';
};

const getTitle = (report: CreatedReport) => {
  if (isLocationReport(report)) {
    return `${report.targetType}: ${report.location.name}`;
  }
  if (isPanelReport(report)) {
    return `${report.targetType}: ${report.panel.location.name}`;
  }
  return 'Unknown';
};

function ReportDetail({ reports, createNew, onModalClose }: ReportDetailProps) {
  const handleCreateNew = useCallback(() => {
    onModalClose();
    createNew();
  }, [onModalClose, createNew]);

  const renderStatus = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <Typography component="span" color="warning">
            Đã gửi
          </Typography>
        );
      case 'PENDING':
        return (
          <Typography component="span" color="success">
            Đang xử lí
          </Typography>
        );
      case 'DONE':
        return (
          <Typography component="span" color="success">
            Hoàn tất
          </Typography>
        );
      case 'REJECTED':
        return (
          <Typography component="span" color="error">
            Từ chối
          </Typography>
        );
      default:
        return (
          <Typography component="span" color="info">
            Unknown
          </Typography>
        );
    }
  };

  const body = (
    <Box>
      <Stack alignItems="end">
        <Button sx={{ display: 'flex' }} onClick={handleCreateNew}>
          Create new
        </Button>
      </Stack>
      <Stack spacing={2}>
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader
              title={getTitle(report)}
              subheader={formatDateTime(report?.createdAt)}
            />
            <CardContent>
              <Typography>
                Email: <Typography component="span">{report.email}</Typography>
              </Typography>
              <Typography>Name: {report.fullName}</Typography>
              <Typography>Report Type: {report.reportType.name}</Typography>
              <Typography>Status: {renderStatus(report.status)}</Typography>
              <Stack>
                <Typography>Content</Typography>
                <Box>{parse(report.content)}</Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );

  return (
    <GeneralModal
      headerText="Report detail"
      onModalClose={onModalClose}
      body={body}
      showFooter={false}
    />
  );
}

export default ReportDetail;
