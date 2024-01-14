import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { Box, Drawer, IconButton } from '@mui/material';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { SidebarKey } from '@/constants/sidebar';
import { hideSidebar } from '@/store/slice/sidebar';
import AdDetail from './AdDetail';
import AnyPoint from './AnyPoint';

const sidebarsMap: { [sidebarKey: string]: any } = {
  [SidebarKey.AD_DETAIL]: AdDetail,
  [SidebarKey.ANY_POINT]: AnyPoint,
};

export default function SidebarContainer({
  style,
}: {
  style?: React.CSSProperties;
}) {
  const { displaySidebar, onSidebarClose, ...rest } = useAppSelector(
    (state) => state.sidebar,
  );

  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(hideSidebar());
    onSidebarClose?.();
  }, [dispatch, onSidebarClose]);

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
      anchor="right"
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
      <Box style={style} sx={{ marginY: 6, paddingX: 2 }}>
        {renderSidebarContent()}
      </Box>
    </Drawer>
  );
}
