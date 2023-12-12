import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import ControlledCheckbox from '@/components/Common/ControlledCheckbox';
import ControlledDatePicker from '@/components/Common/ControlledDatePicker';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';

interface FormData {
  name: string;
  select: string;
  checkbox: boolean;
  date: dayjs.Dayjs;
}

const DistrictsManagement = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      select: '',
      checkbox: false,
      date: dayjs.utc(),
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) => console.log(data.date.format()))}
      sx={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}
    >
      <ControlledTextField control={control} name="name" />
      <ControlledCheckbox control={control} name="checkbox" />
      <ControlledSelect
        control={control}
        name="select"
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
        ]}
      />
      <ControlledDatePicker control={control} name="date" />
      <Button type="submit">submit</Button>
    </Box>
  );
};

export default DistrictsManagement;
