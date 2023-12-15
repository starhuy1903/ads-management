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
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useLogoutMutation } from '@/store/api/userApiSlice';
import Logo from '@/assets/images/app-logo.png';
import SearchBar from './SearchBar';
import CloseIcon from '@mui/icons-material/Close';
import { hideSidebar } from '@/store/slice/sidebar';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const tokenId = useAppSelector((state) => state.user.token?.tokenId) || '';
  const displaySidebar = useAppSelector((state) => state.sidebar);

  
  const [requestLogout] = useLogoutMutation();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleHideSidebar = useCallback(() => hideSidebar(), []);

  const handleLogout = async () => {
    try {
      await requestLogout({
        tokenId,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

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
            <SearchBar />
            {displaySidebar ? (
              <Box
                sx={{ cursor: "pointer"}}
                onClick={handleHideSidebar}
              >
                <CloseIcon />
              </Box>
            ) : null}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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
