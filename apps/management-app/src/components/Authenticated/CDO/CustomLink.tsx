import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const CustomLink = styled(Link)(({ theme }) => ({
  transition: 'all 0.2s ease',

  '&:hover': { color: theme.palette.primary.main },
}));

export default CustomLink;
