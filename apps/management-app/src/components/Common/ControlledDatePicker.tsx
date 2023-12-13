import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Control, Controller } from 'react-hook-form';

dayjs.extend(utc);

interface ControlledDatePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
}

const ControlledDatePicker = ({
  control,
  name,
  label = name,
}: ControlledDatePickerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormControl fullWidth>
          <FormLabel>{label}</FormLabel>
          <DatePicker
            value={value}
            onChange={onChange}
          />
        </FormControl>
      )}
    />
  );
};

export default ControlledDatePicker;
