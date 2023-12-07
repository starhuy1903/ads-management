import { Box } from '@mui/material';
import Maps from '@/components/Common/Maps';
import Sidebar from './Sidebar';

export default function CitizenHome() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      zIndex={-1}
      display="flex"
    >
      <Sidebar />
      <Maps />
    </Box>
  );
}
