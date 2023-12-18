import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';

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

export function ReadOnlyTextForm({
  label,
  field,
  value,
}: {
  label?: string;
  field: string;
  value?: string | number | undefined;
}) {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={field}>{label}</FormLabel>
      <ReadOnlyTextField value={value} disabled />
    </FormControl>
  );
}
