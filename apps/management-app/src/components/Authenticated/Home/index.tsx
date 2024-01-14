import { Box } from '@mui/material';
import Maps from '@/components/Common/Maps';
import SidebarContainer from '@/components/Common/Sidebar';

export default function Home() {
  return (
    <Box position="relative" width="100%" height="100%">
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
        display="flex"
        overflow="hidden"
      >
        <Maps></Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </Box>
  );
}
