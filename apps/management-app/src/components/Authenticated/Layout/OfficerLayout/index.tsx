import { Box, useMediaQuery } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})<{ sidebarOpen: boolean }>(({ theme, sidebarOpen }) => ({
  width: '100%',
  minHeight: `calc(100dvh - ${theme.layout.headerHeight})`,
  padding: '16px',
  borderTopLeftRadius: '20px',
  borderTopRightRadius: '20px',
  marginTop: theme.layout.headerHeight,
  marginLeft: '16px',
  marginRight: '16px',
  backgroundColor: theme.palette.grey[100],

  [theme.breakpoints.up('md')]: {
    width: sidebarOpen ? `calc(100% - ${theme.layout.drawerWidth})` : '100%',
    marginLeft: sidebarOpen ? theme.layout.drawerWidth : '16px',
    transition: theme.transitions.create(
      ['margin', 'width'],
      sidebarOpen
        ? {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }
        : {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          },
    ),
  },
}));

function OfficerLayout() {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const [sidebarOpen, setSidebarOpen] = useState(matchUpMd);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onSidebarToggle={() => setSidebarOpen((open) => !open)} />
      <Sidebar open={sidebarOpen} handleOnClose={() => setSidebarOpen(false)} />

      <Main sidebarOpen={sidebarOpen}>
        <Outlet />
      </Main>
    </Box>
  );
}
export default OfficerLayout;
