import { Box } from '@mui/material';
import Header from './Common/Header';
import { Outlet } from 'react-router-dom';

function PageLayout() {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}
export default PageLayout;
