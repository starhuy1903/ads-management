import { Box, TextField } from '@mui/material';

export default function SearchBar() {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Search Maps"
      />
    </Box>
  );
}
