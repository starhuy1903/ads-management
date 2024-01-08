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
import { AdLocation } from '@/types/location';

interface LocationCardProps {
  data: AdLocation;
}

export default function LocationCard({ data }: LocationCardProps) {
  const navigate = useNavigate();

  const goToReport = useCallback(() => {
    navigate(`/report?location=${data.id}`);
  }, [navigate, data.id]);

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
          onClick={goToReport}
          sx={{ textTransform: 'uppercase' }}
        >
          Báo cáo vi phạm
        </Button>
      </CardActions>
    </Card>
  );
}
