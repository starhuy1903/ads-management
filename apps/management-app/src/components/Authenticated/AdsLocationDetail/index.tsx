import { Box, Stack, Typography } from '@mui/material';
import { BackButton } from '@/components/Common/Buttons';
import { ReadOnlyTextField } from '@/components/Common/ReadOnlyTextField';
import { formatDateTime } from '@/utils/format-date';

export default function AdsLocationDetail() {
  const location = {
    id: 5,
    address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
    ward: 'Ben Nghe',
    commue: '1',
    lat: 10.777,
    long: 106.666,
    positionType: 'Public land/Park/Traffic safety corridor',
    adsType: 'Commercial advertising',
    imageUrl:
      'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
    isPlanning: true,
    createdTime: '2023-12-08T11:30:53.945Z',
    modifiedTime: '2023-12-08T11:30:53.945Z',
  };

  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        Advertising Location Details #{location?.id}
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Information
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="ID" value={location?.id} />

            <ReadOnlyTextField
              label="Created"
              value={formatDateTime(location?.createdTime)}
            />

            <ReadOnlyTextField
              label="Modified"
              value={formatDateTime(location?.modifiedTime)}
            />

            <ReadOnlyTextField
              label="Planned"
              value={location?.isPlanning ? 'Yes' : 'No'}
            />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Location
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="Address" value={location?.address} />

            <ReadOnlyTextField label="District" value={location?.commue} />

            <ReadOnlyTextField label="Ward" value={location?.ward} />

            <ReadOnlyTextField label="Latitude" value={location?.lat} />

            <ReadOnlyTextField label="Longitude" value={location?.long} />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Classification
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField
              label="Position type"
              value={location?.positionType}
            />

            <ReadOnlyTextField
              label="Advertising type"
              value={location?.adsType}
            />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Image
          </Typography>
          <img
            src={location?.imageUrl}
            alt="location"
            loading="lazy"
            width={650}
          />
        </Stack>
      </Box>
    </Box>
  );
}
