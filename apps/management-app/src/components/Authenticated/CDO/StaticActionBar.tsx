import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface StaticActionBarProps {
  children: ReactNode;
  actionBar?: ReactNode;
  actionBarBottom?: ReactNode;
  actionBarAlign?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  actionBarBottomAlign?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
}

const StaticActionBar = ({
  children,
  actionBar,
  actionBarBottom,
  actionBarAlign = 'flex-end',
  actionBarBottomAlign = 'center',
}: StaticActionBarProps) => {
  const theme = useTheme();
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
      {actionBar && (
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
      )}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
            padding: '0px 2px',
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.grey[200],
          },

          '&::-webkit-scrollbar-thumb': {
            border: '2px solid transparent',
            borderRadius: '4px',
            backgroundClip: 'padding-box',
            backgroundColor: theme.palette.primary.main,
          },

          '&::-webkit-scrollbar-track-piece': {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },
        }}
      >
        {children}
      </Box>
      {actionBarBottom && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: actionBarBottomAlign,
            marginTop: '8px',
            columnGap: '8px',
          }}
        >
          {actionBarBottom}
        </Box>
      )}
    </Box>
  );
};

export default StaticActionBar;
