import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';
import { useEffect, useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import { MONTHS, OLDEST_DATA_YEAR } from '@/constants/app';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { IStatisticsViewOptions } from '@/types/cdoManagement';
import GeneralModal from './GeneralModal';

interface StatisticsViewOptionsProps {
  viewOptions: IStatisticsViewOptions;
  onSubmit: (viewOptions: IStatisticsViewOptions) => void;
  onModalClose: () => void;
}

const StatisticsViewOptions = ({
  viewOptions,
  onSubmit,
  onModalClose,
}: StatisticsViewOptionsProps) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<IStatisticsViewOptions>(viewOptions);

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );
  const { data: wards, isLoading: wardLoading } = useGetWardsQuery({});

  useEffect(() => {
    if (wards) {
      const selectedWards = wards.data.wards.filter((e) =>
        state.wards.includes(e.id),
      );
      const validWards = selectedWards.filter((e) =>
        state.districts.includes(e.district_id),
      );
      setState((pre) => ({ ...pre, wards: validWards.map((e) => e.id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.districts, wards]);

  const id = useId();

  const now = dayjs();

  return (
    <GeneralModal
      headerText="Apply view options"
      onModalClose={onModalClose}
      onClickPrimaryButton={() => {
        onSubmit(state);
        dispatch(showModal(null));
      }}
      primaryButtonText="Apply"
      body={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
            padding: '16px',
          }}
        >
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-districts'}>Districts</InputLabel>
            <Select
              labelId={id + '-select-districts'}
              multiple
              input={<OutlinedInput label="Districts" />}
              value={state.districts}
              onChange={(e) => {
                setState((pre) => ({
                  ...pre,
                  districts: e.target.value as Array<number>,
                }));
              }}
              disabled={districtLoading}
            >
              {districts?.data.districts.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-wards'}>Wards</InputLabel>
            <Select
              labelId={id + '-select-wards'}
              multiple
              input={<OutlinedInput label="Wards" />}
              value={state.wards}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  wards: e.target.value as Array<number>,
                }))
              }
              disabled={wardLoading}
            >
              {wards &&
                (state.districts.length < 1
                  ? wards.data.wards
                  : wards.data.wards.filter((e) =>
                      state.districts.includes(e.district_id),
                    )
                ).map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-mode'}>View statistics in</InputLabel>
            <Select
              labelId={id + '-select-mode'}
              input={<OutlinedInput label="View statistics in" />}
              value={state.mode}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  mode: e.target.value as 'YEAR' | 'MONTH',
                  month: 1,
                }))
              }
            >
              <MenuItem value="YEAR">Year</MenuItem>
              <MenuItem value="MONTH">Month</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-year'}>Year</InputLabel>
            <Select
              labelId={id + '-select-year'}
              multiple
              input={<OutlinedInput label="Year" />}
              value={state.year}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  year: e.target.value as number,
                }))
              }
            >
              {Array.from(
                { length: now.get('year') - OLDEST_DATA_YEAR + 1 },
                (e, i) => OLDEST_DATA_YEAR + i,
              ).map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-month'}>Month</InputLabel>
            <Select
              labelId={id + '-select-month'}
              multiple
              input={<OutlinedInput label="Month" />}
              value={state.month}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  month: e.target.value as number,
                }))
              }
              disabled={state.mode === 'YEAR'}
            >
              {Array.from({ length: 12 }, (e, i) => i + 1).map((e) => (
                <MenuItem key={e} value={e}>
                  {MONTHS[e]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      }
    />
  );
};

export default StatisticsViewOptions;
