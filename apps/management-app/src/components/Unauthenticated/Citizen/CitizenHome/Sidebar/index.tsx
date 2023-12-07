import { Box } from '@mui/material';

export default function Sidebar() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width={410}
      zIndex={10}
      sx={{ background: 'white' }}
      height="100%"
      paddingTop={8}
    >
      Hello
    </Box>
  );
}
