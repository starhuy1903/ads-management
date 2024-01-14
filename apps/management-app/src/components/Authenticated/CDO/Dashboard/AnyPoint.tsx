import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';

interface AnyPointProps {
  address: string;
  lat: number;
  lng: number;
}

export default function AnyPoint({ address, lat, lng }: AnyPointProps) {
  return (
    <Stack spacing={2}>
      <Card sx={{ background: 'rgb(240 253 244)' }}>
        <CardHeader
          title="Location information"
          titleTypographyProps={{ fontWeight: 500 }}
        />
        <CardContent>
          <Typography fontWeight={500}>{address}</Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
