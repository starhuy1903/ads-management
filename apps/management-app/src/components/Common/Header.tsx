import { Avatar, Box } from '@mui/material';
import { useAppSelector } from '@/store';
import { useLogoutMutation } from '@/store/api/userApiSlice';

export default function Header() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const tokenId = useAppSelector((state) => state.user.token?.tokenId) || '';
  const [requestLogout] = useLogoutMutation();

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
    <Box>
      <Avatar src="/broken-image.jpg" />
    </Box>
  );
}
