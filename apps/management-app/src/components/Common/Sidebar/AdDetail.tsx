import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import { Panel } from '@/types/panel';
import CenterLoading from '../CenterLoading';
import PanelCard from '../PanelCard';

interface AdDetailProps {
  panels: Array<Panel>;
}

export default function AdDetail({ panels }: AdDetailProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleViewPanelDetail = useCallback(() => {
    dispatch(
      showModal(ModalKey.PANEL_DETAIL, {
        panelId: 2, // TODO: replace with real panel
      }),
    );
  }, [dispatch]);

  if (!panels) {
    return <CenterLoading />;
  }

  return (
    <Stack spacing={2}>
      {panels.map((panel) => (
        <PanelCard
          key={panel.id}
          data={panel}
          onViewDetail={handleViewPanelDetail}
        />
      ))}
    </Stack>
  );
}
