import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import LocationCard from './LocationCard';
import PanelCard from './PanelCard';
import { useGetPanelByLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { AdLocation } from '@/types/location';
import { CreatedReport } from '@/types/report';

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
  const { data: panels } = useGetPanelByLocationQuery(location.id);

  const isViolatedLocation = vioLocationReports?.length !== 0;

  return (
    <Stack spacing={2}>
      <LocationCard
        data={location}
        hasReported={isViolatedLocation}
        reports={vioLocationReports}
      />
      {panels?.length === 0 ? (
        <Card sx={{ background: 'rgb(224 242 254)' }}>
          <CardHeader title="Advertisment panel information" />
          <CardContent>
            <Typography fontWeight={500}>No data</Typography>
          </CardContent>
        </Card>
      ) : (
        panels?.map((panel) => (
          <PanelCard
            key={panel.id}
            data={panel}
            violatedReports={vioPanelReports?.filter(
              (report) => report.panelId === panel.id,
            )}
          />
        ))
      )}
    </Stack>
  );
}
