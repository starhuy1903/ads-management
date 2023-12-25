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
          label="Created"
          value={formatDateTime(request?.createdAt)}
        />

        <ReadOnlyTextField
          label="Modified"
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
          value={`${request?.user?.first_name} ${request?.user?.last_name}`}
        />

        <ReadOnlyTextField label="Role" value={request?.user?.role} />

        <ReadOnlyTextField label="Email" value={request?.user?.email} />

        <ReadOnlyTextField label="Phone" value={request?.user?.phone_number} />

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
          label="Created"
          value={
            request?.panel ? formatDateTime(request?.panel?.created_time) : ''
          }
        />

        <ReadOnlyTextField
          label="Modified"
          value={
            request?.panel ? formatDateTime(request?.panel?.modified_time) : ''
          }
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={request?.panel?.location?.id} />

        <ReadOnlyTextField
          label="Address"
          value={request?.panel?.location?.full_address}
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
          value={request?.panel?.location?.ad_type?.name}
        />
      </Stack>

      <ImageListField images={request?.panel?.image_urls} />

      <Typography variant="h6">Company</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField
          label="Email"
          value={request?.panel?.company_email}
        />

        <ReadOnlyTextField
          label="Phone"
          value={request?.panel?.company_number}
        />

        <ReadOnlyTextField
          label="Created Contract Date"
          value={
            request?.panel
              ? formatDateTime(request?.panel?.create_contract_date)
              : ''
          }
        />

        <ReadOnlyTextField
          label="Expired Contract Date"
          value={
            request?.panel
              ? formatDateTime(request?.panel?.expired_contract_date)
              : ''
          }
        />
      </Stack>
    </DetailWrapper>
  );
}
