import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo_placeholder.svg';

function Logo(props: BoxProps) {
  return (
    <Box {...props}>
      <Link to="/">
        <img src={logo} alt="logo" className="max-h-full"/>
      </Link>
    </Box>
  );
}

export default Logo;
