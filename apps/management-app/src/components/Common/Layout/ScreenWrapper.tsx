import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BackButton } from '../Buttons';

export function ListWrapper({
  label = '',
  btnLabel = '',
  btnLink = '',
  children,
}: {
  label: string;
  btnLabel?: string;
  btnLink?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          {label}
        </Typography>
        {btnLabel && btnLink && (
          <Button
            component={Link}
            to={btnLink}
            variant="contained"
            sx={{
              color: 'white',
            }}
          >
            {btnLabel}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export function DetailWrapper({
  label = '',
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        {label}
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
