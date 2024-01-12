import { Box } from '@mui/material';
import { CreatedReport } from '@/types/report';
import GeneralModal from './GeneralModal';

interface ReportDetailProps {
  reports: CreatedReport[];
  createNew: () => void;
  onModalClose: () => void;
}

function ReportDetail({ reports, createNew, onModalClose }: ReportDetailProps) {
  // TODO: Add create new report button
  const body = <Box>{JSON.stringify(reports)}</Box>;

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
