import { TextField } from '@mui/material';

export function DetailTextField({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <TextField
      label={label}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
      value={value}
    />
  );
}
