import { Box, Button, CircularProgress } from '@mui/material';
import { useLoginMutation } from '../../store/api/userApiSlice';

function Login() {
  const [requestLogin, { isLoading }] = useLoginMutation();

  const handleSubmit = async () => {
    try {
      const res = await requestLogin({
        email: 'huy@gmail.com',
        password: '12341234',
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <div>
      <Button variant="contained" onClick={handleSubmit}>
        Login
      </Button>
    </div>
  );
}

export default Login;
