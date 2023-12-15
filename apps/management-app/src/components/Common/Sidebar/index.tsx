import { SidebarKey } from '@/constants/sidebar';
import { useAppSelector } from '@/store';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import AdDetail from './AdDetail';

const sidebarsMap: { [sidebarKey: string]: any } = {
  [SidebarKey.AD_DETAIL]: AdDetail,
}

interface SidebarProps {
  open: boolean;
  onOpen: (value: boolean) => void;
}

export default function SidebarContainer({ open, onOpen }: SidebarProps) {
  const { displaySidebar, ...rest } = useAppSelector(
    (state) => state.sidebar,
  );
  
  const renderSidebarContent = () => {
    if (!displaySidebar) {
      return null;
    }
  
    const sidebarProps = {
      ...rest
    }
  
    const DisplayedSidebar = sidebarsMap[displaySidebar];
    return <DisplayedSidebar {...sidebarProps} />;
  }

  return (
    <motion.div
      initial={{ x: displaySidebar ? '-100%' : '0%' }}
      style={{ height: '100%', zIndex: 1, width: displaySidebar ? 410 : 0 }}
    >
      <Box
        position="relative"
        height="100%"
        paddingTop={8}
        sx={{ background: 'white' }}
      >
        {renderSidebarContent()}
      </Box>
    </motion.div>
  );
}
