import { Box, Stack, Typography } from '@mui/material';
import { DetailTextField } from '@/components/Common/DetailTextField';
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
      <Typography variant="h4" sx={{ mb: 2 }}>
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
            <DetailTextField label="ID" value={panel?.id} />

            <DetailTextField label="Panel type" value={panel?.panelType} />

            <DetailTextField label="Width" value={panel?.width} />

            <DetailTextField label="Height" value={panel?.height} />

            <DetailTextField label="Quantity" value={panel?.quantity} />

            <DetailTextField
              label="Created"
              value={formatDateTime(panel?.createdTime)}
            />

            <DetailTextField
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
            <DetailTextField label="ID" value={panel?.location?.id} />

            <DetailTextField label="Address" value={panel?.location?.address} />

            <DetailTextField label="Ward" value={panel?.location?.ward} />

            <DetailTextField label="District" value={panel?.location?.commue} />

            <DetailTextField
              label="Position type"
              value={panel?.location?.positionType}
            />

            <DetailTextField
              label="Advertising type"
              value={panel?.location?.adsType}
            />
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Company
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DetailTextField label="Email" value={panel?.company?.email} />

            <DetailTextField label="Phone" value={panel?.company?.phone} />

            <DetailTextField
              label="Created contract date"
              value={formatDate(panel?.company?.createdContractDate)}
            />

            <DetailTextField
              label="Expired contract date"
              value={formatDate(panel?.company?.expiredContractDate)}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
