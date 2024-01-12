import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import { useId } from 'react';
import { Control, Controller } from 'react-hook-form';
import CustomSelect from './CustomSelect';

interface ControlledSelectProps<T extends number | string> {
  control: Control<any>;
  name: string;
  label?: string;
  options: Array<{
    value: T;
    label: string;
  }>;
}

const ControlledSelect = <T extends number | string>({
  control,
  name,
  label = name,
  options,
}: ControlledSelectProps<T>) => {
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <FormControl sx={{ width: '100%' }}>
          <FormLabel>{label}</FormLabel>
          <CustomSelect
            fullWidth
            labelId={id + '-label'}
            id={id}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          >
            {options.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </CustomSelect>
        </FormControl>
      )}
    />
  );
};

export default ControlledSelect;
