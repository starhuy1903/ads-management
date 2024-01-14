import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetPanelByLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { AdLocation } from '@/types/location';
import { CreatedReport } from '@/types/report';
import CenterLoading from '../CenterLoading';
import LocationCard from '../LocationCard';
import PanelCard from '../PanelCard';

interface AdDetailProps {
  location: AdLocation;
  vioLocationReports?: CreatedReport[];
  vioPanelReports?: CreatedReport[];
}

export default function AdDetail({
  location,
  vioLocationReports,
  vioPanelReports,
}: AdDetailProps) {
  const { data: panels, isSuccess } = useGetPanelByLocationQuery(location.id);

  const isViolatedLocation = vioLocationReports?.length !== 0;

  const navigate = useNavigate();
  if (!location || !isSuccess) {
    return <CenterLoading />;
  }

  return (
    <Stack spacing={2}>
      <LocationCard
        data={location}
        hasReported={isViolatedLocation}
        reports={vioLocationReports}
      />
      {/* No data */}
      {panels.length === 0 ? (
        <Card sx={{ background: 'rgb(224 242 254)' }}>
          <CardHeader title="Thông tin bảng quảng cáo" />
          <CardContent>
            <Typography fontWeight={500}>Chưa có dữ liệu</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {panels
            .filter((panel) => panel.status === 'APPROVED')
            .map((panel) => (
              <PanelCard
                key={panel.id}
                data={panel}
                violatedReports={vioPanelReports?.filter(
                  (report) => report.panelId === panel.id,
                )}
              />
            ))}
        </>
      )}
    </Stack>
  );
}
