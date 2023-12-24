import { ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetLocationByIdQuery } from '@/store/api/officerApiSlice';
import { Location } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function LocationDetail() {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const { locationId } = useParams<{ locationId: string }>();
  const { data, isLoading } = useGetLocationByIdQuery(locationId!);

  useEffect(() => {
    if (data) {
      setLocation(data?.data);
    }
  }, [data]);

  if (isLoading || !location) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Advertising Location Details">
      <Typography variant="h6">Information</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={location?.id} />

        <ReadOnlyTextField
          label="Created"
          value={formatDateTime(location?.created_time)}
        />

        <ReadOnlyTextField
          label="Modified"
          value={formatDateTime(location?.modified_time)}
        />

        <ReadOnlyTextField
          label="Planned"
          value={location?.isPlanning ? 'Yes' : 'No'}
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Address" value={location?.full_address} />

        <ReadOnlyTextField label="Ward" value={location?.ward?.name} />

        <ReadOnlyTextField label="District" value={location?.district?.name} />

        <ReadOnlyTextField label="Latitude" value={location?.lat} />

        <ReadOnlyTextField label="Longitude" value={location?.long} />
      </Stack>

      <Typography variant="h6">Classification</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Advertising Type"
          value={location?.ad_type?.name}
        />

        <ReadOnlyTextField label="Position Type" value={location?.type?.name} />
      </Stack>

      <Typography variant="h6">Image</Typography>

      {location?.image_urls.length !== 0 ? (
        <ImageList sx={{ width: '70%' }} cols={2}>
          {location?.image_urls.map((item) => (
            <ImageListItem key={item}>
              <img src={item} alt="location" loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography
          variant="body1"
          sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
        >
          No image.
        </Typography>
      )}
    </DetailWrapper>
  );
}
