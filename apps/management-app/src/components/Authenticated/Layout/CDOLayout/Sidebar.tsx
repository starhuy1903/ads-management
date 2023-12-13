import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SignpostIcon from '@mui/icons-material/Signpost';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logo from '../OfficerLayout/Logo';
import NavGroupWrapper from '../OfficerLayout/NavGroupWrapper';
import NavItem from '../OfficerLayout/NavItem';

type SidebarProps = {
  open: boolean;
  handleOnClose: () => void;
};

function Sidebar({ open, handleOnClose }: SidebarProps) {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box component="nav">
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={open}
        onClose={handleOnClose}
        PaperProps={{
          sx: {
            width: theme.layout.drawerWidth,
            top: matchUpMd ? theme.layout.headerHeight : 0,
            border: 0,
          },
        }}
      >
        <Box
          sx={{
            height: theme.layout.headerHeight,
            display: {
              xs: 'flex',
              md: 'none',
            },
            alignItems: 'center',
            flexShrink: 0,
            paddingLeft: {
              xs: '16px',
              sm: '24px',
            },
          }}
        >
          <Logo sx={{ height: '60px' }} />
        </Box>
        <PerfectScrollbar
          style={{
            height: `calc(100dvh - ${theme.layout.headerHeight})`,
            padding: '0 16px',
          }}
        >
          <NavGroupWrapper>
            <NavItem
              title="Dashboard"
              icon={<DashboardIcon />}
              href="/dashboard"
            />
          </NavGroupWrapper>
          <NavGroupWrapper title="General management">
            <NavItem
              title="Districts"
              icon={<SignpostIcon />}
              href="/districts"
            />
            <NavItem title="Wards" icon={<SignpostIcon />} href="/wards" />
            <NavItem
              title="Ads Types"
              icon={<ViewListIcon />}
              href="/ads-types"
            />
            <NavItem
              title="Report Types"
              icon={<ViewListIcon />}
              href="/report-types"
            />
          </NavGroupWrapper>
        </PerfectScrollbar>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
