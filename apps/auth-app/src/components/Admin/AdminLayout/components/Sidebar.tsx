import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logo from './Logo';
import NavGroupWrapper from './NavGroupWrapper';
import NavItem from './NavItem';

type SidebarProps = {
  open: boolean;
  handleOnClose: () => void;
};

function Sidebar(props: SidebarProps) {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const { open, handleOnClose } = props;

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
          <NavGroupWrapper title="Dashboard">
            <NavItem
              title="Dashboard"
              icon={<SpaceDashboardOutlinedIcon />}
              href="/admin/dashboard"
            />
          </NavGroupWrapper>
          <Divider />
          <NavGroupWrapper title="Management">
            <NavItem
              title="Categories"
              icon={<CategoryOutlinedIcon />}
              href="/admin/categories"
            />
            <NavItem
              title="Items"
              icon={<CategoryOutlinedIcon />}
              href="/admin/items"
            />
          </NavGroupWrapper>
          <Divider />
          <NavGroupWrapper>
            <NavItem
              title="Settings"
              icon={<SettingsOutlinedIcon />}
              href="/admin/settings"
            />
          </NavGroupWrapper>
        </PerfectScrollbar>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
