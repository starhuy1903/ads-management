import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
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
import CustomIconButton from '@/components/Common/CustomIconButton';
import { ReportStatus } from '@/constants/report';
import anonymousUser from '@/utils/anonymous-user';

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

function CitizenNotification() {
  const userUuid = anonymousUser.getUserUuid();
  const [notification, setNotification] = useState<{
    email: string;
    status: string;
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
    if (!userUuid) return;
    const SERVER_URL = `https://ads-management-api.onrender.com/api/reports/user/sse/${userUuid}`;
    const open = async () => {
      const eventSource = new EventSource(SERVER_URL);

      eventSource.onmessage = (event) => {
        const dataString = event.data.trim();
        if (dataString.length === 0) return;
        const data = JSON.parse(dataString);
        setNotification({
          email: data?.data?.email,
          status: data?.data?.status,
        });
        setIsSeen(false);
      };

      eventSource.onerror = (error) => {
        console.error('Error:', error);
      };
    };

    open();
  }, [userUuid]);

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
                        <ListItemButton disabled={isSeen}>
                          <ListItemIcon>
                            <EmailIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  fontWeight: 'bold',
                                }}
                                color={
                                  notification.status === ReportStatus?.PENDING
                                    ? 'mediumblue'
                                    : 'green'
                                }
                              >
                                {`Your Report Has Been ${
                                  notification.status === ReportStatus?.PENDING
                                    ? 'Processing'
                                    : 'Resolved'
                                }`}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                sx={{
                                  fontSize: '0.875rem',
                                }}
                              >
                                A new response has been sent to {''}
                                <span className="font-bold">
                                  {notification.email}
                                </span>
                                .
                                <br />
                                Please check your email.
                              </Typography>
                            }
                          />
                        </ListItemButton>
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

export default CitizenNotification;
