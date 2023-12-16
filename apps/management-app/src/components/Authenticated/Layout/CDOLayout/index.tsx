import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../OfficerLayout/Header';
import Main from '../OfficerLayout/Main';
import Sidebar from './Sidebar';

function CDOLayout() {
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
export default CDOLayout;
