import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  useGetDistrictsQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import {
  AdsRequestStatus,
  IAdsRequestViewOptions,
} from '@/types/cdoManagement';
import CustomSelect from '../Common/CustomSelect';
import GeneralModal from './GeneralModal';

interface AdsRequestListViewOptionsProps {
  viewOptions: IAdsRequestViewOptions;
  onSubmit: (viewOptions: IAdsRequestViewOptions) => void;
  onModalClose: () => void;
  disableTargetType: boolean;
}

const AdsRequestListViewOptions = ({
  viewOptions,
  onSubmit,
  onModalClose,
  disableTargetType = false,
}: AdsRequestListViewOptionsProps) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<
    IAdsRequestViewOptions & {
      district?: number;
      _status?: AdsRequestStatus | -1;
      _targetType?: 'Panel' | 'Location' | -1;
    }
  >({
    ...viewOptions,
    district:
      viewOptions.districts.length > 0 ? viewOptions.districts[0] : undefined,
    _status: viewOptions.status,
    _targetType: viewOptions.targetType,
  });

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );
  const { data: wards, isLoading: wardLoading } = useGetWardsQuery({});

  const id = useId();

  return (
    <GeneralModal
      headerText="Apply filter options"
      onModalClose={onModalClose}
      onClickPrimaryButton={() => {
        onSubmit({
          ...state,
          districts:
            state.district && state.district !== -1 ? [state.district] : [],
          status: state._status !== -1 ? state._status : undefined,
          targetType: state._targetType !== -1 ? state._targetType : undefined,
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
                  wards: [],
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
              value={state.wards}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  wards: e.target.value as Array<number>,
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
            <InputLabel id={id + '-select-status'}>Requests' status</InputLabel>
            <CustomSelect
              labelId={id + '-select-status'}
              input={<OutlinedInput label="Requests' status" />}
              value={state._status || -1}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _status: e.target.value as AdsRequestStatus,
                }))
              }
            >
              <MenuItem value={-1}>Any</MenuItem>
              {Object.keys(AdsRequestStatus)
                .filter((e) => isNaN(Number(e)))
                .map((e) => {
                  return (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  );
                })}
            </CustomSelect>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-targetType'}>
              Requests' target type
            </InputLabel>
            <CustomSelect
              labelId={id + '-select-targetType'}
              input={<OutlinedInput label="Requests' target type" />}
              value={state._targetType || -1}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _targetType: e.target.value as 'Panel' | 'Location',
                }))
              }
              disabled={disableTargetType}
            >
              <MenuItem value={-1}>Any</MenuItem>
              <MenuItem value="Panel">Panel</MenuItem>
              <MenuItem value="Location">Location</MenuItem>
            </CustomSelect>
          </FormControl>
        </Box>
      }
    />
  );
};

export default AdsRequestListViewOptions;
