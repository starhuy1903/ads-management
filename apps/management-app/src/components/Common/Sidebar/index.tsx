import { SidebarKey } from '@/constants/sidebar';
import { useAppSelector } from '@/store';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import AdDetail from './AdDetail';

const sidebarsMap: { [sidebarKey: string]: any } = {
  [SidebarKey.AD_DETAIL]: AdDetail,
}

export default function SidebarContainer({ style }: { style?: React.CSSProperties }) {
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
      style={{ zIndex: 1, width: displaySidebar ? 360 : 0, ...style }}
    >
      <Box
        position="relative"
        height="100%"
        sx={{ background: 'white' }}
      >
        {renderSidebarContent()}
      </Box>
    </motion.div>
  );
}
