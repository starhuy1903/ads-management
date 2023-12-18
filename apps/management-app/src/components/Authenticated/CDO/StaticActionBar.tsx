import Box from '@mui/material/Box';
import { ReactNode } from 'react';

interface StaticActionBarProps {
  children: ReactNode;
  actionBar: ReactNode;
  actionBarAlign?: 'flex-start' | 'middle' | 'flex-end' | 'space-between';
}

const StaticActionBar = ({
  children,
  actionBar,
  actionBarAlign = 'flex-end',
}: StaticActionBarProps) => {
  return (
    <Box
      sx={{
        height: (theme) =>
          `calc(100dvh - ${theme.layout.headerHeight} - 16px * 2)`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: actionBarAlign,
          marginBottom: '8px',
          columnGap: '8px',
        }}
      >
        {actionBar}
      </Box>
      {children}
    </Box>
  );
};

export default StaticActionBar;
