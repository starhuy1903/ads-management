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
import { useLazyGetPanelByIdOfficerQuery } from '@/store/api/officer/panelApiSlide';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';
import { isString, isValidLength } from '@/utils/validate';

export default function PanelDetail() {
  const navigate = useNavigate();

  const [panel, setPanel] = useState<Panel | null>(null);
  const { panelId } = useParams<{ panelId: string }>();

  const [getPanel, { isLoading }] = useLazyGetPanelByIdOfficerQuery();

  function handleInvalidRequest() {
    setPanel(null);
    navigate('/panels', { replace: true });
  }

  useEffect(() => {
    if (
      !panelId ||
      !isString(panelId) ||
      !isValidLength(panelId, MAX_ID_LENGTH)
    ) {
      handleInvalidRequest();
      return;
    }

    async function fetchData() {
      try {
        const res = await getPanel(panelId!, true).unwrap();
        setPanel(res);
      } catch (error) {
        console.log(error);
        handleInvalidRequest();
      }
    }

    fetchData();
  }, [getPanel, panelId]);

  if (isLoading || !panel) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label={`Panel #${panel?.id}`}>
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
