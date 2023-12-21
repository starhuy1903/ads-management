import {
  Box,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '@/components/Common/Buttons';
import CenterLoading from '@/components/Common/CenterLoading';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
import { useGetPanelByIdQuery } from '@/store/api/officerApiSlice';
import { Panel } from '@/types/officer-management';
import { formatDateTime } from '@/utils/format-date';

export default function AdsPanelDetail() {
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
        <Typography variant="h6">Panel</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ReadOnlyTextField label="ID" value={panel?.id} />

          <ReadOnlyTextField label="Panel Type" value={panel?.type?.name} />

          <ReadOnlyTextField label="Width" value={panel?.width} />

          <ReadOnlyTextField label="Height" value={panel?.height} />

          <ReadOnlyTextField
            label="Created"
            value={formatDateTime(panel?.created_time)}
          />

          <ReadOnlyTextField
            label="Modified"
            value={formatDateTime(panel?.modified_time)}
          />

          <ReadOnlyTextField label="Status" value={panel?.status} />
        </Stack>

        <Typography variant="h6">Location</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ReadOnlyTextField
            label="Address"
            value={panel?.location?.full_address}
          />

          <ReadOnlyTextField label="Ward" value={panel?.location?.ward?.name} />

          <ReadOnlyTextField
            label="District"
            value={panel?.location?.district?.name}
          />
        </Stack>

        <Typography variant="h6">Image</Typography>
        {panel?.image_urls.length !== 0 ? (
          <ImageList sx={{ width: '70%' }} cols={2}>
            {panel?.image_urls.map((item) => (
              <ImageListItem key={item}>
                <img src={item} alt="panel" loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography
            variant="body1"
            sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
          >
            No image.
          </Typography>
        )}

        <Typography variant="h6">Company</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ReadOnlyTextField label="Email" value={panel?.company_email} />

          <ReadOnlyTextField label="Phone" value={panel?.company_number} />

          <ReadOnlyTextField
            label="Created Contract Date"
            value={formatDateTime(panel?.create_contract_date)}
          />

          <ReadOnlyTextField
            label="Expired Contract Date"
            value={formatDateTime(panel?.expired_contract_date)}
          />
        </Stack>
      </Box>
    </Box>
  );
}
