import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import { showModal } from '@/store/slice/modal';
import { AdLocation } from '@/types/location';
import { CreatedReport } from '@/types/report';

interface LocationCardProps {
  data: AdLocation;
  hasReported?: boolean;
  reports?: CreatedReport[];
}

export default function LocationCard({
  data,
  hasReported = false,
  reports = [],
}: LocationCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToReport = useCallback(() => {
    navigate(`/report?location=${data.id}`);
  }, [navigate, data.id]);

  const viewAllReports = useCallback(() => {
    dispatch(
      showModal(ModalKey.REPORT_DETAIL, { reports, createNew: goToReport }),
    );
  }, [dispatch, reports, goToReport]);

  return (
    <Card sx={{ background: 'rgb(240 253 244)' }}>
      <CardHeader
        title="Thông tin địa điểm"
        titleTypographyProps={{ fontWeight: 500 }}
      />
      <CardContent>
        <Typography fontWeight={500}>{data.adType.name}</Typography>
        <Typography fontStyle="italic">{data.type.name}</Typography>
        <Typography>{data.fullAddress}</Typography>
        <Typography fontWeight={500} fontStyle="italic">
          {data.isPlanning ? 'CHƯA QUY HOẠCH' : 'ĐÃ QUY HOẠCH'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="error"
          onClick={hasReported ? viewAllReports : goToReport}
          sx={{ textTransform: 'uppercase' }}
        >
          {hasReported ? 'Xem lại báo cáo' : 'Báo cáo vi phạm'}
        </Button>
      </CardActions>
    </Card>
  );
}
