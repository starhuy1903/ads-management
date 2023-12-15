import { TextField } from '@mui/material';

export function ReadOnlyTextField({
  label,
  value,
  disabled = false,
}: {
  label?: string;
  value?: string | number | undefined;
  disabled?: boolean;
}) {
  return (
    <TextField
      label={label}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
      value={value}
      disabled={disabled}
    />
  );
}
