import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, IconButton, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/types/panel';
import CenterLoading from '../CenterLoading';

interface AdDetailProps {
  panels: Array<Panel>;
}

export default function AdDetail({ panels }: AdDetailProps) {
  const navigate = useNavigate();

  if (!panels) {
    return <CenterLoading />;
  }

  return (
    <Stack>
      {panels.map((panel) => (
        <Box p={2}>
          <Box height={60} />
          <Typography variant="h4" mb={1}>
            {panel.type.name}
          </Typography>
          <Typography variant="subtitle1" color="gray">
            {/* TODO: need to show full */}
            {panel.location.fullAddress}
          </Typography>
          <Box mt={3}>
            <Box display="flex">
              <Typography mr={1}>Kich thuoc: </Typography>
              <Typography
                fontWeight={500}
              >{`${panel.width}m x ${panel.height}m`}</Typography>
            </Box>
            <Box display="flex">
              <Typography mr={1}>Hinh thuc:</Typography>
              <Typography fontWeight={500}>
                {panel.location.adType.name}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography mr={1}>Phan loai:</Typography>
              <Typography fontWeight={500}>
                {panel.location.type.name}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <IconButton>
              <InfoOutlinedIcon color="primary" />
            </IconButton>
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate('/report')}
            >
              Bao cao
            </Button>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
