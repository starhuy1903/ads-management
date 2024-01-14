import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
          onClick={() => navigate('/locations/' + data.id)}
        >
          {'View location'}
        </Button>
      </CardActions>
    </Card>
  );
}
