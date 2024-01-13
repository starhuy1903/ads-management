import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Box, Drawer, IconButton } from '@mui/material';
import React, { useCallback, useState } from 'react';
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
  const [openSidebar, setOpenSidebar] = useState(false);
  const { displaySidebar, onSidebarClose, ...rest } = useAppSelector(
    (state) => state.sidebar,
  );
  const { selectedLocation } = useAppSelector((state) => state.maps);

  const showOpenButton = selectedLocation && !displaySidebar;

  const dispatch = useAppDispatch();

  // const handleReopen = useCallback(() => {
  //   onSidebarReopen?.();
  // }, [onSidebarReopen]);

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
    <>
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
        <Box style={style} sx={{ marginY: 6, paddingX: 2 }}>
          {renderSidebarContent()}
        </Box>
      </Drawer>
      {/* Use to open side bar */}
      {/* <Drawer
        anchor="left"
        open={!!showOpenButton}
        hideBackdrop
        variant="persistent"
      >
        <IconButton onClick={handleReopen}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Drawer> */}
    </>
  );
}
