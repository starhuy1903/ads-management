import { Stack, TextField, Typography } from '@mui/material';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { AdsPermissionResponse } from '@/types/form';
import { formatDate, formatDateTime } from '@/utils/format-date';

export default function RequestDetail() {
  const permission: AdsPermissionResponse = {
    id: 1,
    type: 'Licensing request',
    panel: {
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
        'https://mgg.vn/wp-content/uploads/2018/12/blackpink-nhom-nhac-kpop-dai-dien-dong-hanh-cung-shopee.png',
      company: {
        email: 'shopee@gmail.com',
        phone: '0123456789',
        createdContractDate: '2023-12-01',
        expiredContractDate: '2024-01-01',
      },
      createdTime: '2023-12-08T11:30:53.945Z',
      modifiedTime: '2023-12-08T11:30:53.945Z',
    },
    reason: 'Advertise products and services for the company',
    status: 'Approved',
    createdTime: '2023-12-08T11:30:53.945Z',
    modifiedTime: '2023-12-08T11:30:53.945Z',
  };

  return (
    <DetailWrapper label="Permission Details">
      <Typography variant="h6">Information</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={permission?.id} />

        <ReadOnlyTextField label="Type" value={permission?.type} />

        <ReadOnlyTextField
          label="Created"
          value={formatDateTime(permission?.createdTime)}
        />

        <ReadOnlyTextField
          label="Modified"
          value={formatDateTime(permission?.modifiedTime)}
        />

        <ReadOnlyTextField label="Status" value={permission?.status} />
      </Stack>

      <TextField
        label="Reason"
        value={permission?.reason}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Typography variant="h6">Panel</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={permission?.panel?.id} />

        <ReadOnlyTextField
          label="Panel type"
          value={permission?.panel?.panelType}
        />

        <ReadOnlyTextField label="Width" value={permission?.panel?.width} />

        <ReadOnlyTextField label="Height" value={permission?.panel?.height} />

        <ReadOnlyTextField
          label="Quantity"
          value={permission?.panel?.quantity}
        />

        <ReadOnlyTextField
          label="Created"
          value={formatDateTime(permission?.panel?.createdTime)}
        />

        <ReadOnlyTextField
          label="Modified"
          value={formatDateTime(permission?.panel?.modifiedTime)}
        />
      </Stack>

      <Typography variant="h6">Image</Typography>
      <img
        src={permission?.panel?.imageUrl}
        alt="panel"
        loading="lazy"
        width={650}
      />

      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={permission?.panel?.location?.id} />

        <ReadOnlyTextField
          label="Address"
          value={permission?.panel?.location?.address}
        />

        <ReadOnlyTextField
          label="Ward"
          value={permission?.panel?.location?.ward}
        />

        <ReadOnlyTextField
          label="District"
          value={permission?.panel?.location?.commue}
        />

        <ReadOnlyTextField
          label="Position type"
          value={permission?.panel?.location?.positionType}
        />

        <ReadOnlyTextField
          label="Advertising type"
          value={permission?.panel?.location?.adsType}
        />
      </Stack>

      <Typography variant="h6">Company</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Email"
          value={permission?.panel?.company?.email}
        />

        <ReadOnlyTextField
          label="Phone"
          value={permission?.panel?.company?.phone}
        />

        <ReadOnlyTextField
          label="Created contract date"
          value={formatDate(permission?.panel?.company?.createdContractDate)}
        />

        <ReadOnlyTextField
          label="Expired contract date"
          value={formatDate(permission?.panel?.company?.expiredContractDate)}
        />
      </Stack>
    </DetailWrapper>
  );
}
