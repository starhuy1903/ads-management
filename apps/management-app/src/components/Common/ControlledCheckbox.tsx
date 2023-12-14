import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Control, Controller } from 'react-hook-form';

interface ControlledCheckboxProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const ControlledCheckbox = ({
  control,
  name,
  label = name,
}: ControlledCheckboxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormControlLabel
          label={label}
          labelPlacement="end"
          control={
            <Checkbox checked={value} onChange={onChange} onBlur={onBlur} />
          }
          sx={{ width: '100%', userSelect: 'none' }}
        />
      )}
    />
  );
};

export default ControlledCheckbox;
