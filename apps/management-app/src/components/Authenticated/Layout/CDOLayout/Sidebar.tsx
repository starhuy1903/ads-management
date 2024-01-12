import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import ReportIcon from '@mui/icons-material/Report';
import SignpostIcon from '@mui/icons-material/Signpost';
import TaskIcon from '@mui/icons-material/Task';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
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
          options={{ swipeEasing: true }}
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
              title="Panel Types"
              icon={<ViewListIcon />}
              href="/panel-types"
            />
            <NavItem
              title="Report Types"
              icon={<ReportIcon />}
              href="/report-types"
            />
            <NavItem
              title="Location Types"
              icon={<EditLocationIcon />}
              href="/location-types"
            />
            <NavItem
              title="Advertisement Types"
              icon={<PermMediaIcon />}
              href="/ads-types"
            />
          </NavGroupWrapper>
          <NavGroupWrapper title="Panels Management">
            <NavItem
              title="Location"
              icon={<LocationOnIcon />}
              href="/locations"
            />
            <NavItem title="Panel" icon={<VideoLabelIcon />} href="/panels" />
          </NavGroupWrapper>
          <NavGroupWrapper title="Request Management">
            <NavItem
              title="Modification Requests"
              icon={<EditIcon />}
              href="/modification-requests"
            />
            <NavItem
              title="Permission Requests"
              icon={<TaskIcon />}
              href="/permission-requests"
            />
          </NavGroupWrapper>
          <NavGroupWrapper title="Statictis">
            <NavItem
              title="Report Statictis"
              icon={<EqualizerIcon />}
              href="/report-statistics"
            />
          </NavGroupWrapper>
          <NavGroupWrapper title="Account Management">
            <NavItem
              title="Accounts Management"
              icon={<ManageAccountsIcon />}
              href="/accounts"
            />
          </NavGroupWrapper>
        </PerfectScrollbar>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
