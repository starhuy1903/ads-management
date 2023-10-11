import { Box, Button, Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { useAppDispatch } from '../../store';
import { setIsLoggedIn } from '../../store/slice/userSlice';

function Home() {
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Typography>Home Page go here</Typography>
      <Stack>
        <Button
          variant="contained"
          onClick={() => toast.success('Success toast')}
        >
          Stimulate success toast
        </Button>
        <Button
          variant="contained"
          onClick={() => toast.error('Error toast')}
        >
          Stimulate error toast
        </Button>
      </Stack>
    </Box>
  );
}

export default Home;
