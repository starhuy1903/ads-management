import { Box } from '@mui/material';
import { useState } from 'react';
import Maps from '@/components/Common/Maps';
import Sidebar from './Sidebar';

export default function CitizenHome() {
  const [openSidebar, setOpenSidebar] = useState(false);
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
      <Sidebar open={openSidebar} onOpen={setOpenSidebar} />
      <Maps />
    </Box>
  );
}
