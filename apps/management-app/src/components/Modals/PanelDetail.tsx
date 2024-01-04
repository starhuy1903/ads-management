import { Box } from '@mui/material';
import GeneralModal from './GeneralModal';

interface PanelDetailProps {
  onModalClose: () => void;
}

function PanelDetail({ onModalClose }: PanelDetailProps) {
  const body = <Box>Hello</Box>;

  return (
    <GeneralModal
      headerText="Panel detail"
      onModalClose={onModalClose}
      body={body}
      showFooter={false}
    />
  );
}

export default PanelDetail;
