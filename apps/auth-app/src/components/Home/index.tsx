import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch } from '../../store';
import { setIsLoggedIn } from '../../store/slice/userSlice';

function Home() {
  const dispatch = useAppDispatch();
  return (
    <Box>
      <Typography>Home Page go here</Typography>
      <Button
        variant="contained"
        onClick={() => dispatch(setIsLoggedIn(false))}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Home;
