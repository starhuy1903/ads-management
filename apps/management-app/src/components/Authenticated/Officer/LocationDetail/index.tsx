import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
} from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { MAX_ID_LENGTH } from '@/constants/url-params';
import { useLazyGetLocationByIdOfficerQuery } from '@/store/api/officer/locationApiSlice';
import { Location } from '@/types/officer-management';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';
import { isString, isValidLength } from '@/utils/validate';

export default function LocationDetail() {
  const navigate = useNavigate();

  const [location, setLocation] = useState<Location | null>(null);
  const { locationId } = useParams<{ locationId: string }>();

  const [getLocation, { isLoading }] = useLazyGetLocationByIdOfficerQuery();

  function handleInvalidRequest() {
    setLocation(null);
    navigate('/locations', { replace: true });
  }

  useEffect(() => {
    if (
      !locationId ||
      !isString(locationId) ||
      !isValidLength(locationId, MAX_ID_LENGTH)
    ) {
      handleInvalidRequest();
      return;
    }

    async function fetchData() {
      try {
        const res = await getLocation(locationId!, true).unwrap();
        setLocation(res);
      } catch (error) {
        console.log(error);
        handleInvalidRequest();
      }
    }

    fetchData();
  }, [getLocation, locationId]);

  if (isLoading || !location) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper
      label={`
      Location #${location?.id}
    `}
    >
      <Typography variant="h6">Location</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={location?.id} />

        <ReadOnlyTextField label="Name" value={location?.name} />

        <ReadOnlyTextField
          label="Planned"
          value={location?.isPlanning ? 'No' : 'Yes'}
        />

        <ReadOnlyTextField
          label="Status"
          value={capitalize(location?.status)}
        />

        <ReadOnlyTextField
          label="Created Time"
          value={formatDateTime(location?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(location?.updatedAt)}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Address" value={location?.fullAddress} />

        <ReadOnlyTextField label="Ward" value={location?.ward?.name} />

        <ReadOnlyTextField label="District" value={location?.district?.name} />

        <ReadOnlyTextField label="Latitude" value={location?.lat} />

        <ReadOnlyTextField label="Longitude" value={location?.long} />
      </Stack>

      <Typography variant="h6">Classification</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Type" value={location?.type?.name} />

        <ReadOnlyTextField
          label="Advertising Type"
          value={location?.adType?.name}
        />
      </Stack>

      <ImageListField label="Image" images={location?.imageUrls} />
    </DetailWrapper>
  );
}
