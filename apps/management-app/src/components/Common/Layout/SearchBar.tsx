import { Box, BoxProps, TextField, TextFieldProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchBarProps = TextFieldProps

export default function SearchBar({ sx, ...rest }: SearchBarProps) {
  return (
    <TextField
      size='small'
      id="outlined-basic"
      variant="outlined"
      placeholder="Search Maps"
      InputProps={{
        endAdornment: (<SearchIcon />),
      }}
      sx={sx}
      {...rest}
    />
  );
}
