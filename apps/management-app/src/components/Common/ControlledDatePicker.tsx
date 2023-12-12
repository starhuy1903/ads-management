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
        <DatePicker
          value={value}
          label={label}
          onChange={(date) => {
            console.log(date);
            console.log(date.format());
            console.log(date.utc().format());
            onChange(date);
          }}
        />
      )}
    />
  );
};

export default ControlledDatePicker;
