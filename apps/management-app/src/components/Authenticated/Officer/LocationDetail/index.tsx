import { ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
} from '@/components/Common/FormComponents';
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
          label="Created Time"
          value={formatDateTime(location?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(location?.updatedAt)}
        />

        <ReadOnlyTextField
          label="Planned"
          value={location?.isPlanning ? 'Yes' : 'No'}
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Address" value={location?.fullAddress} />

        <ReadOnlyTextField label="Ward" value={location?.ward?.name} />

        <ReadOnlyTextField label="District" value={location?.district?.name} />

        <ReadOnlyTextField label="Latitude" value={location?.lat} />

        <ReadOnlyTextField label="Longitude" value={location?.long} />
      </Stack>

      <Typography variant="h6">Classification</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Advertising Type"
          value={location?.adType?.name}
        />

        <ReadOnlyTextField label="Position Type" value={location?.type?.name} />
      </Stack>

      <ImageListField label="Image" images={location?.imageUrls} />
    </DetailWrapper>
  );
}
