import { Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
} from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetRequestByIdQuery } from '@/store/api/officerApiSlice';
import { AdsRequest } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function LicensingRequestDetail() {
  const [request, setRequest] = useState<AdsRequest | undefined>(undefined);
  const { requestId } = useParams<{ requestId: string }>();
  const { data, isLoading } = useGetRequestByIdQuery(requestId!);

  useEffect(() => {
    if (data) {
      setRequest(data?.data);
    }
  }, [data]);

  if (isLoading || !request) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Permission Details">
      <Typography variant="h6">Information</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="ID" value={request?.id} />

        <ReadOnlyTextField
          label="Created Time"
          value={formatDateTime(request?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(request?.updatedAt)}
        />

        <ReadOnlyTextField label="Status" value={request?.status} />
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField
          label="Request Sender"
          value={`${request?.user?.firstName} ${request?.user?.lastName}`}
        />

        <ReadOnlyTextField label="Role" value={request?.user?.role} />

        <ReadOnlyTextField label="Email" value={request?.user?.email} />

        <ReadOnlyTextField label="Phone" value={request?.user?.phoneNumber} />

        <ReadOnlyTextField label="Ward" value={request?.user?.ward?.name} />

        <ReadOnlyTextField
          label="District"
          value={request?.user?.district?.name}
        />
      </Stack>

      <TextField
        label="Reason"
        value={request?.reason}
        multiline
        rows={4}
        fullWidth
      />

      <Typography variant="h6">Panel</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={request?.panel?.id} />

        <ReadOnlyTextField
          label="Panel Type"
          value={request?.panel?.type?.name}
        />

        <ReadOnlyTextField label="Width" value={request?.panel?.width} />

        <ReadOnlyTextField label="Height" value={request?.panel?.height} />

        <ReadOnlyTextField
          label="Created Time"
          value={
            request?.panel ? formatDateTime(request?.panel?.createdAt) : ''
          }
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={
            request?.panel ? formatDateTime(request?.panel?.updatedAt) : ''
          }
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={request?.panel?.location?.id} />

        <ReadOnlyTextField
          label="Address"
          value={request?.panel?.location?.fullAddress}
        />

        <ReadOnlyTextField
          label="Ward"
          value={request?.panel?.location?.ward?.name}
        />

        <ReadOnlyTextField
          label="District"
          value={request?.panel?.location?.district?.name}
        />

        <ReadOnlyTextField
          label="Position Type"
          value={request?.panel?.location?.type?.name}
        />

        <ReadOnlyTextField
          label="Advertising Type"
          value={request?.panel?.location?.adType?.name}
        />
      </Stack>

      <ImageListField images={request?.panel?.imageUrls} />

      <Typography variant="h6">Company</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Email" value={request?.panel?.companyEmail} />

        <ReadOnlyTextField
          label="Phone"
          value={request?.panel?.companyNumber}
        />

        <ReadOnlyTextField
          label="Created Contract Date"
          value={
            request?.panel
              ? formatDateTime(request?.panel?.createContractDate)
              : ''
          }
        />

        <ReadOnlyTextField
          label="Expired Contract Date"
          value={
            request?.panel
              ? formatDateTime(request?.panel?.expiredContractDate)
              : ''
          }
        />
      </Stack>
    </DetailWrapper>
  );
}
