import { Box, Typography } from '@mui/material';
import { motion, useAnimationControls } from 'framer-motion';
import { useCallback } from 'react';

interface SidebarProps {
  open: boolean;
  onOpen: (value: boolean) => void;
}

export default function Sidebar({ open, onOpen }: SidebarProps) {
  const openSidebarBtnControl = useAnimationControls();

  const openSidebar = useCallback(async () => {
    onOpen(true);

    await openSidebarBtnControl.start({
      x: '0',
      width: 410,
      transition: {
        duration: 0.2,
      },
    });
  }, [onOpen, openSidebarBtnControl]);

  const closeSidebar = useCallback(async () => {
    onOpen(false);

    await openSidebarBtnControl.start({
      x: '-100%',
      width: 10,
      transition: {
        duration: 0.3,
      },
    });
  }, [openSidebarBtnControl, onOpen]);

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={openSidebarBtnControl}
      style={{ height: '100%', zIndex: 1, width: 10 }}
    >
      <Box
        position="relative"
        height="100%"
        paddingTop={8}
        sx={{ background: 'white' }}
      >
        <Typography>Hello</Typography>

        {/* Collapse button */}
        <Box
          position="absolute"
          right={-20}
          top="50%"
          zIndex={10}
          sx={{ background: 'red', cursor: 'pointer' }}
          onClick={open ? closeSidebar : openSidebar}
        >
          Open
        </Box>
      </Box>
    </motion.div>
  );
}
