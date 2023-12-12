import TextField from '@mui/material/TextField';
import { Control, Controller } from 'react-hook-form';

interface ControlledTextFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const ControlledTextField = ({
  control,
  name,
  label = name,
}: ControlledTextFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default ControlledTextField;
