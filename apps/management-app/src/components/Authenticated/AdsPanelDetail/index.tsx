import { Box, Stack, Typography } from '@mui/material';
import { BackButton } from '@/components/Common/Buttons';
import { ReadOnlyTextField } from '@/components/Common/ReadOnlyTextField';
import { AdsPanelResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

export default function AdsPanelDetail() {
  const panel: AdsPanelResponse = {
    id: 3,
    panelType: 'Pillar, panel cluster',
    location: {
      id: 1,
      address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
      ward: 'Ben Nghe',
      commue: '1',
      positionType: 'Public land/Park/Traffic safety corridor',
      adsType: 'Commercial advertising',
    },
    width: 2.5,
    height: 10,
    quantity: 1,
    imageUrl:
      'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
    company: {
      email: 'shopee@gmail.com',
      phone: '0123456789',
      createdContractDate: '2023-12-08T11:30:53.945Z',
      expiredContractDate: '2024-01-08T11:30:53.945Z',
    },
    createdTime: '2023-12-08T11:30:53.945Z',
    modifiedTime: '2023-12-08T11:30:53.945Z',
  };

  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        Advertising Panel Details #{panel?.id}
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
            Panel
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="ID" value={panel?.id} />

            <ReadOnlyTextField label="Panel type" value={panel?.panelType} />

            <ReadOnlyTextField label="Width" value={panel?.width} />

            <ReadOnlyTextField label="Height" value={panel?.height} />

            <ReadOnlyTextField label="Quantity" value={panel?.quantity} />

            <ReadOnlyTextField
              label="Created"
              value={formatDateTime(panel?.createdTime)}
            />

            <ReadOnlyTextField
              label="Modified"
              value={formatDateTime(panel?.modifiedTime)}
            />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Image
          </Typography>
          <img src={panel?.imageUrl} alt="panel" loading="lazy" width={650} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Location
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="ID" value={panel?.location?.id} />

            <ReadOnlyTextField
              label="Address"
              value={panel?.location?.address}
            />

            <ReadOnlyTextField label="Ward" value={panel?.location?.ward} />

            <ReadOnlyTextField
              label="District"
              value={panel?.location?.commue}
            />

            <ReadOnlyTextField
              label="Position type"
              value={panel?.location?.positionType}
            />

            <ReadOnlyTextField
              label="Advertising type"
              value={panel?.location?.adsType}
            />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Company
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <ReadOnlyTextField label="Email" value={panel?.company?.email} />

            <ReadOnlyTextField label="Phone" value={panel?.company?.phone} />

            <ReadOnlyTextField
              label="Created contract date"
              value={formatDate(panel?.company?.createdContractDate)}
            />

            <ReadOnlyTextField
              label="Expired contract date"
              value={formatDate(panel?.company?.expiredContractDate)}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
