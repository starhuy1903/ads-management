import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetWardsByDistrictIdQuery } from '@/store/api/officer/wardApiSlide';
import { Ward } from '@/types/officer-management';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

export default function WardSelect({
  wards,
  setWards,
}: {
  wards: number[];
  setWards: (wards: number[]) => void;
}) {
  const districtId = '18';

  const [allWards, setAllWards] = useState<Ward[]>([]);

  const { data } = useGetWardsByDistrictIdQuery(districtId);

  useEffect(() => {
    if (data) {
      setAllWards(data);
    }
  }, [data]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    setWards(
      typeof value === 'string' ? value.split(',').map((id) => +id) : value,
    );
  };

  return (
    <FormControl sx={{ width: 250, marginBottom: 2 }}>
      <InputLabel id="select-wards">Wards</InputLabel>
      <Select
        labelId="select-wards"
        id="select-wards"
        multiple
        value={wards}
        onChange={handleChange}
        input={<OutlinedInput label="Wards" />}
        renderValue={(selectedIds) =>
          selectedIds
            .map((id) => allWards.find((ward) => ward.id === id)?.name)
            .join(', ')
        }
        MenuProps={MenuProps}
      >
        {allWards.map((ward) => (
          <MenuItem key={ward?.id} value={ward?.id}>
            <Checkbox checked={wards.indexOf(ward?.id) > -1} />
            <ListItemText primary={ward?.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
