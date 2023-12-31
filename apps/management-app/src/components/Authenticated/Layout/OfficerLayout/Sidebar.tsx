import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Logo from './Logo';
import NavGroupWrapper from './NavGroupWrapper';
import NavItem from './NavItem';

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
          <NavGroupWrapper title="Management">
            <NavItem
              title="Location"
              icon={<CategoryOutlinedIcon />}
              href="/locations"
            />
            <NavItem
              title="Report"
              icon={<CategoryOutlinedIcon />}
              href="/reports"
            />
            <NavItem
              title="Permission"
              icon={<CategoryOutlinedIcon />}
              href="/permissions"
            />
          </NavGroupWrapper>
        </PerfectScrollbar>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
