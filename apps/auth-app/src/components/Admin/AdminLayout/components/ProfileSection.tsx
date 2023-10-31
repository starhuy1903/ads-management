import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Box,
  ButtonBase,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
  Zoom,
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useRef, useState } from 'react';

const PopperListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,

  '& .MuiListItemButton-root': {
    '--nav-item__background': 'transparent',
    '--nav-item__text': theme.palette.text.primary,
    borderRadius: '12px',
    backgroundColor: 'var(--nav-item__background) !important',
    transition: 'all 0.5s ease',

    '&:hover': {
      '--nav-item__background': theme.palette.primary.light,
      '--nav-item__text': theme.palette.primary.main,
    },
  },

  '& .MuiListItemIcon-root': {
    color: 'var(--nav-item__text)',
    transition: 'all 0.5s ease',
  },

  '& .MuiListItemText-root': {
    color: 'var(--nav-item__text)',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    transition: 'all 0.5s ease',
  },
}));

type ProfileSectionProps = {
  src?: string;
  alt?: string;
};

function ProfileSection(props: ProfileSectionProps) {
  const { src, alt } = props;

  const theme = useTheme();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((open) => !open);
  };

  const handlePopperClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setPopperOpen(false);
  };

  const handleLogout = () => {
    console.log('Logging out');
  };

  return (
    <>
      <ButtonBase type="button" ref={anchorRef} onClick={handlePopperToggle}>
        <Avatar src={src} alt={alt}>
          {!src && <PersonIcon />}
        </Avatar>
      </ButtonBase>
      <Popper
        open={popperOpen}
        placement="bottom-end"
        anchorEl={anchorRef.current}
        disablePortal
        transition
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 16],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Zoom {...TransitionProps} style={{ transformOrigin: '100% 0' }}>
            <Paper sx={{ borderRadius: '12px' }}>
              <ClickAwayListener onClickAway={handlePopperClose}>
                <Box className="min-w-fit p-2">
                  <List>
                    <PopperListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={<Typography >Log out</Typography>}
                        />
                      </ListItemButton>
                    </PopperListItem>
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Zoom>
        )}
      </Popper>
    </>
  );
}

export default ProfileSection;
