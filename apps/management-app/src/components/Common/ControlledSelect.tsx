import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useId } from 'react';
import { Control, Controller } from 'react-hook-form';

interface ControlledSelectProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

const ControlledSelect = ({
  control,
  name,
  label = name,
  options,
}: ControlledSelectProps) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <FormControl fullWidth>
          <InputLabel id={id + '-label'}>{label}</InputLabel>
          <Select
            fullWidth
            labelId={id + '-label'}
            id={id}
            value={value}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
          >
            {options.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default ControlledSelect;
