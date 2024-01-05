import { Box } from '@mui/material';
import { useGetPanelDetailQuery } from '@/store/api/citizen/panelApiSlice';
import CenterLoading from '../Common/CenterLoading';
import GeneralModal from './GeneralModal';

interface PanelDetailProps {
  panelId: number;
  onModalClose: () => void;
}

function PanelDetail({ panelId, onModalClose }: PanelDetailProps) {
  const { data, isLoading } = useGetPanelDetailQuery(panelId);

  const body = isLoading ? (
    <CenterLoading />
  ) : (
    <Box>{JSON.stringify(data)}</Box>
  );

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
