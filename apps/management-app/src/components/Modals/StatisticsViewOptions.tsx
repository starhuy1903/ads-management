import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import dayjs from 'dayjs';
import { useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import { MONTHS, OLDEST_DATA_YEAR } from '@/constants/app';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { IStatisticsViewOptions } from '@/types/cdoManagement';
import CustomSelect from '../Common/CustomSelect';
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
  const [state, setState] = useState<
    IStatisticsViewOptions & { district?: number }
  >({
    ...viewOptions,
    district:
      viewOptions.districtIds.length > 0
        ? viewOptions.districtIds[0]
        : undefined,
  });

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );
  const { data: wards, isLoading: wardLoading } = useGetWardsQuery({});

  const id = useId();

  const now = dayjs();

  return (
    <GeneralModal
      headerText="Apply view options"
      onModalClose={onModalClose}
      onClickPrimaryButton={() => {
        onSubmit({
          ...state,
          districtIds:
            state.district && state.district !== -1 ? [state.district] : [],
        });
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
            <CustomSelect
              labelId={id + '-select-districts'}
              input={<OutlinedInput label="Districts" />}
              value={state.district || -1}
              onChange={(e) => {
                setState((pre) => ({
                  ...pre,
                  district: e.target.value as number,
                  wardIds: [],
                }));
              }}
              disabled={districtLoading}
            >
              <MenuItem value={-1}>All</MenuItem>
              {districts?.data.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-wards'}>Wards</InputLabel>
            <CustomSelect
              labelId={id + '-select-wards'}
              multiple
              input={<OutlinedInput label="Wards" />}
              value={state.wardIds}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  wardIds: e.target.value as Array<number>,
                }))
              }
              disabled={wardLoading || !state.district}
            >
              {wards &&
                wards.data
                  .filter((e) => e.districtId === state.district)
                  .map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
            </CustomSelect>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-mode'}>View statistics in</InputLabel>
            <CustomSelect
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
            </CustomSelect>
          </FormControl>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              columnGap: '16px',
            }}
          >
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id={id + '-select-year'}>Year</InputLabel>
              <CustomSelect
                labelId={id + '-select-year'}
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
              </CustomSelect>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id={id + '-select-month'}>Month</InputLabel>
              <CustomSelect
                labelId={id + '-select-month'}
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
              </CustomSelect>
            </FormControl>
          </Box>
        </Box>
      }
    />
  );
};

export default StatisticsViewOptions;
