import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { Box, Drawer, IconButton } from '@mui/material';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { SidebarKey } from '@/constants/sidebar';
import { hideSidebar } from '@/store/slice/sidebar';
import AdDetail from './AdDetail';

const sidebarsMap: { [sidebarKey: string]: any } = {
  [SidebarKey.AD_DETAIL]: AdDetail,
};

export default function SidebarContainer({
  style,
}: {
  style?: React.CSSProperties;
}) {
  const { displaySidebar, ...rest } = useAppSelector((state) => state.sidebar);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(hideSidebar());
  }, [dispatch]);

  const renderSidebarContent = () => {
    if (!displaySidebar) {
      return null;
    }

    const sidebarProps = {
      ...rest,
    };

    const DisplayedSidebar = sidebarsMap[displaySidebar];
    return <DisplayedSidebar {...sidebarProps} />;
  };

  return (
    <Drawer
      anchor="left"
      open={!!displaySidebar}
      hideBackdrop
      variant="persistent"
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseSharpIcon color="action" fontSize="small" />
      </IconButton>
      <Box style={style}>{renderSidebarContent()}</Box>
    </Drawer>
  );
}
