import {
  Box,
  Button,
  Card,
  CardActions,
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
  createNew?: () => void;
  onModalClose: () => void;
  onHandleReport?: (reportId: number) => void;
}

const isLocationReport = (
  report: CreatedReport,
): report is CreatedLocationReport => report.targetType === 'Location';

const isPanelReport = (report: CreatedReport): report is CreatedPanelReport =>
  report.targetType === 'Panel';

const getTitle = (report: CreatedReport) => {
  if (isLocationReport(report)) {
    return `${report.targetType}: ${report.location.name}`;
  }
  if (isPanelReport(report)) {
    return `${report.targetType}: ${report.panel.location.name}`;
  }
  return 'Point';
};

function ReportDetail({
  reports,
  createNew,
  onModalClose,
  onHandleReport,
}: ReportDetailProps) {
  const handleCreateNew = useCallback(() => {
    onModalClose();
    createNew?.();
  }, [onModalClose, createNew]);

  const handleReport = useCallback(
    (reportId: number) => {
      onModalClose();
      onHandleReport?.(reportId);
    },
    [onModalClose, onHandleReport],
  );

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
      {createNew && (
        <Stack alignItems="end">
          <Button sx={{ display: 'flex' }} onClick={handleCreateNew}>
            Create new
          </Button>
        </Stack>
      )}
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
            {report.status !== 'DONE' && onHandleReport && (
              <CardActions>
                <Button onClick={() => handleReport(report.id)}>
                  Xử lí báo cáo
                </Button>
              </CardActions>
            )}
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
