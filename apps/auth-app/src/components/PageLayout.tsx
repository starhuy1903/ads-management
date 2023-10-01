import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Common/Header';

function PageLayout() {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}
export default PageLayout;
