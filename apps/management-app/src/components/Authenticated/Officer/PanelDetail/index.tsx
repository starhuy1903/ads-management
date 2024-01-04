import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenterLoading from '@/components/Common/CenterLoading';
import {
  ImageListField,
  ReadOnlyTextField,
} from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import { useGetPanelByIdQuery } from '@/store/api/officerApiSlice';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';
import { capitalize } from '@/utils/format-string';

export default function PanelDetail() {
  const [panel, setPanel] = useState<Panel | undefined>(undefined);
  const { panelId } = useParams<{ panelId: string }>();
  const { data, isLoading } = useGetPanelByIdQuery(panelId!);

  useEffect(() => {
    if (data) {
      setPanel(data?.data);
    }
  }, [data]);

  if (isLoading || !panel) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Advertising Panel Details">
      <Typography variant="h6">Panel</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="ID" value={panel?.id} />

        <ReadOnlyTextField label="Type" value={panel?.type?.name} />

        <ReadOnlyTextField label="Width" value={panel?.width} />

        <ReadOnlyTextField label="Height" value={panel?.height} />

        <ReadOnlyTextField label="Status" value={capitalize(panel?.status)} />

        <ReadOnlyTextField
          label="Created Time"
          value={formatDateTime(panel?.createdAt)}
        />

        <ReadOnlyTextField
          label="Updated Time"
          value={formatDateTime(panel?.updatedAt)}
        />
      </Stack>

      <Typography variant="h6">Location</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 1,
        }}
      >
        <ReadOnlyTextField label="Name" value={panel?.location?.name} />

        <ReadOnlyTextField
          label="Address"
          value={panel?.location?.fullAddress}
        />

        <ReadOnlyTextField label="Ward" value={panel?.location?.ward?.name} />

        <ReadOnlyTextField
          label="District"
          value={panel?.location?.district?.name}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Type" value={panel?.location?.type?.name} />

        <ReadOnlyTextField
          label="Advertising Type"
          value={panel?.location?.adType?.name}
        />
      </Stack>

      <ImageListField images={panel?.imageUrls} />

      <Typography variant="h6">Company</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextField label="Email" value={panel?.companyEmail} />

        <ReadOnlyTextField label="Phone" value={panel?.companyNumber} />

        <ReadOnlyTextField
          label="Created Contract Time"
          value={formatDateTime(panel?.createContractDate)}
        />

        <ReadOnlyTextField
          label="Expired Contract Time"
          value={formatDateTime(panel?.expiredContractDate)}
        />
      </Stack>
    </DetailWrapper>
  );
}
