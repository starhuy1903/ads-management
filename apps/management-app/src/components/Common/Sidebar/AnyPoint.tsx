import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AnyPointProps {
  address: string;
}

export default function AnyPoint({ address }: AnyPointProps) {
  const navigate = useNavigate();

  const goToReport = useCallback(() => ({}), []);

  return (
    <Stack spacing={2}>
      <Card sx={{ background: 'rgb(240 253 244)' }}>
        <CardHeader
          title="Thông tin địa điểm"
          titleTypographyProps={{ fontWeight: 500 }}
        />
        <CardContent>
          <Typography fontWeight={500}>{address}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="error"
            onClick={goToReport}
            sx={{ textTransform: 'uppercase' }}
          >
            {/* {hasReported ? 'Xem lại báo cáo' : 'Báo cáo vi phạm'} */}
            Báo cáo vi phạm
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}