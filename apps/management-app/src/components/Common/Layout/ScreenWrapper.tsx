import { Box, Typography } from '@mui/material';
import { BackButton } from '../Buttons';

export function ListWrapper({
  label = '',
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        height: '100%',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {label}
      </Typography>
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
  label: string;
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
