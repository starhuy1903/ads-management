import { Box } from '@mui/material';
import { useState } from 'react';
import Maps from '@/components/Common/Maps';
import SidebarContainer from '@/components/Common/Sidebar';

export default function CitizenHome() {
  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        zIndex={-1}
        display="flex"
      >
        <Maps />
      </Box>
      <SidebarContainer 
        style={{
          height: 'calc(100% - 64px)', 
          position: 'absolute', 
          top: 64, 
          left: 0
        }} />
    </>
  );
}
