import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
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
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import CustomIconButton from '@/components/Common/CustomIconButton';

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

function Notification() {
  const navigate = useNavigate();

  const userId = useAppSelector((state) => state.user?.profile?.id);
  const [notification, setNotification] = useState<{
    targetType: string;
    targetId: string;
    email: string;
  }>();
  const [isSeen, setIsSeen] = useState(true);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    if (popperOpen && !isSeen) {
      setIsSeen(true);
    }

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

    if (!isSeen) {
      setIsSeen(true);
    }
  };

  useEffect(() => {
    if (!userId) return;
    const SERVER_URL = `https://ads-management-api.onrender.com/api/reports/officer/sse/${userId}`;
    const open = async () => {
      const eventSource = new EventSource(SERVER_URL);

      eventSource.onmessage = (event) => {
        const dataString = event.data.trim();
        if (dataString.length === 0) return;
        const data = JSON.parse(dataString);
        setNotification({
          targetType: data?.data?.targetType,
          email: data?.data?.email,
          targetId: data?.data?.id,
        });
        setIsSeen(false);
      };

      eventSource.onerror = (error) => {
        console.error('Error:', error);
      };
    };

    open();
  }, [userId]);

  return (
    <>
      <ButtonBase type="button" ref={anchorRef} onClick={handlePopperToggle}>
        <CustomIconButton className="h-fit">
          {isSeen ? (
            <NotificationsNoneOutlinedIcon />
          ) : (
            <NotificationsIcon color="warning" />
          )}
        </CustomIconButton>
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
                  {notification ? (
                    <List>
                      <PopperListItem>
                        <Box
                          onClick={() => {
                            if (!notification.targetId) return;
                            setPopperOpen(false);
                            if (!isSeen) {
                              setIsSeen(true);
                            }
                            const route =
                              notification.targetType === 'Location'
                                ? `/location-reports/${notification.targetId}`
                                : `/panel-reports/${notification.targetId}`;
                            navigate(route);
                          }}
                        >
                          <ListItemButton disabled={isSeen}>
                            <ListItemIcon>
                              <PriorityHighIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                  }}
                                >
                                  New Report
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  sx={{
                                    fontSize: '0.875rem',
                                  }}
                                >
                                  {`${notification.targetType} report from email ${notification.email}`}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </Box>
                      </PopperListItem>
                    </List>
                  ) : (
                    <Box
                      sx={{
                        minWidth: '300px',
                        minHeight: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'gray',
                        }}
                      >
                        No notification.
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ClickAwayListener>
            </Paper>
          </Zoom>
        )}
      </Popper>
    </>
  );
}

export default Notification;
