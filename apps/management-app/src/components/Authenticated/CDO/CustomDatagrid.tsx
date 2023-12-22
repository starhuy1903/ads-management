import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
    padding: '0px 2px',
  },

  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[200],
  },

  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
    border: '2px solid transparent',
    borderRadius: '4px',
    backgroundClip: 'padding-box',
    backgroundColor: theme.palette.primary.main,
  },

  '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track-piece': {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
}));

export default CustomDataGrid;
