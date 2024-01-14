import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  useGetAdsTypesQuery,
  useGetDistrictsQuery,
  useGetLocationTypesQuery,
  useGetWardsQuery,
} from '@/store/api/cdo/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import {
  LocationStatus,
  ILocationListViewOptions,
} from '@/types/cdoManagement';
import CustomSelect from '../Common/CustomSelect';
import GeneralModal from './GeneralModal';

interface LocationListViewOptionsProps {
  viewOptions: ILocationListViewOptions;
  onSubmit: (viewOptions: ILocationListViewOptions) => void;
  onModalClose: () => void;
}

const LocationListViewOptions = ({
  viewOptions,
  onSubmit,
  onModalClose,
}: LocationListViewOptionsProps) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<
    ILocationListViewOptions & {
      district?: number;
      _status: LocationStatus | -1;
      _typeId: number;
      _adTypeId: number;
    }
  >({
    ...viewOptions,
    district:
      viewOptions.districts.length > 0 ? viewOptions.districts[0] : undefined,
    _status: viewOptions.status || -1,
    _typeId: viewOptions.locationTypeId || -1,
    _adTypeId: viewOptions.adTypeId || -1,
  });

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );
  const { data: wards, isLoading: wardLoading } = useGetWardsQuery({});
  const { data: locationTypes, isLoading: locationTypeLoading } =
    useGetLocationTypesQuery({});
  const { data: adsTypes, isLoading: adsTypeLoading } = useGetAdsTypesQuery({});

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
          locationTypeId: state._typeId !== -1 ? state._typeId : undefined,
          adTypeId: state._adTypeId !== -1 ? state._adTypeId : undefined,
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
            <InputLabel id={id + '-select-status'}>
              Locations' status
            </InputLabel>
            <CustomSelect
              labelId={id + '-select-status'}
              input={<OutlinedInput label="Locations' status" />}
              value={state._status || -1}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _status: e.target.value as LocationStatus,
                }))
              }
            >
              <MenuItem value={-1}>Any</MenuItem>
              {Object.keys(LocationStatus)
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
            <InputLabel id={id + '-select-type'}>Locations' type</InputLabel>
            <CustomSelect
              labelId={id + '-select-type'}
              input={<OutlinedInput label="Locations' type" />}
              value={state._typeId}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _typeId: e.target.value as number,
                }))
              }
              disabled={locationTypeLoading}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {locationTypes?.data.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id={id + '-select-adType'}>
              Locations' advertisement type
            </InputLabel>
            <CustomSelect
              labelId={id + '-select-adType'}
              input={<OutlinedInput label="Locations' advertisement type" />}
              value={state._adTypeId}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _adTypeId: e.target.value as number,
                }))
              }
              disabled={adsTypeLoading}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {adsTypes?.data.map((e) => (
                <MenuItem key={e.id} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </CustomSelect>
          </FormControl>
        </Box>
      }
    />
  );
};

export default LocationListViewOptions;
