import { Box, BoxProps } from '@mui/material';
import { Link } from 'react-router-dom';

function Logo(props: BoxProps) {
  return (
    <Box {...props}>
      <Link to="/">
        <img
          src="https://conceptdraw.com/a1703c3/p1/preview/640/pict--advertising-board-advertising---vector-stencils-library.png--diagram-flowchart-example.png"
          alt="logo"
          className="max-h-full"
        />
      </Link>
    </Box>
  );
}

export default Logo;
