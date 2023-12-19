import { Box, Stack, Typography } from '@mui/material';
import { BackButton } from '@/components/Common/Buttons';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
import { AdsPanelResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

const panel: AdsPanelResponse = {
  id: 3,
  panelType: 'Pillar/Panel cluster',
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
    'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
  company: {
    email: 'shopee@gmail.com',
    phone: '0123456789',
    createdContractDate: '2023-12-01',
    expiredContractDate: '2024-01-01',
  },
  createdTime: '2023-12-08T11:30:53.945Z',
  modifiedTime: '2023-12-08T11:30:53.945Z',
};

export default function AdsPanelDetail() {
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
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">Location</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ReadOnlyTextField label="ID" value={panel?.location?.id} />

          <ReadOnlyTextField label="Address" value={panel?.location?.address} />

          <ReadOnlyTextField label="Ward" value={panel?.location?.ward} />

          <ReadOnlyTextField label="District" value={panel?.location?.commue} />

          <ReadOnlyTextField
            label="Position type"
            value={panel?.location?.positionType}
          />

          <ReadOnlyTextField
            label="Advertising type"
            value={panel?.location?.adsType}
          />
        </Stack>

        <Typography variant="h6">Panel</Typography>
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

        <Typography variant="h6">Image</Typography>
        <img src={panel?.imageUrl} alt="panel" loading="lazy" width={650} />

        <Typography variant="h6">Company</Typography>
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
      </Box>
    </Box>
  );
}
