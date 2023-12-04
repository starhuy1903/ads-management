import { Box } from '@mui/material';
import Maps from '@/components/Common/Maps';

export default function CitizenHome() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
    >
      <Maps />
    </Box>
  );
}
