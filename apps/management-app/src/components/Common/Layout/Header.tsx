import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import Logo from '@/assets/images/app-logo.png';
import CitizenNotification from './CitizenNotification';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    },
    [],
  );

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  if (location.pathname === '/') {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{ background: 'transparent', boxShadow: 'none' }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <Link to="/">
              <img src={Logo} alt="app-logo" width={36} height={36} />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Notification">
              <CitizenNotification />
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isLoggedIn ? (
                settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={() => navigate('/login')}>
                  <Typography textAlign="center">Log in</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
