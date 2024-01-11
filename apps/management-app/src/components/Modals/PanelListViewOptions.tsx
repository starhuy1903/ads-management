import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  useGetDistrictsQuery,
  useGetPanelTypesQuery,
  useGetWardsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import {
  PanelStatus,
  IPanelListViewOptions,
} from '@/types/cdoManagement';
import CustomSelect from '../Common/CustomSelect';
import GeneralModal from './GeneralModal';

interface PanelListViewOptionsProps {
  viewOptions: IPanelListViewOptions;
  onSubmit: (viewOptions: IPanelListViewOptions) => void;
  onModalClose: () => void;
}

const PanelListViewOptions = ({
  viewOptions,
  onSubmit,
  onModalClose,
}: PanelListViewOptionsProps) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<
    IPanelListViewOptions & {
      district?: number;
      _status: PanelStatus | -1;
      _typeId: number;
    }
  >({
    ...viewOptions,
    district:
      viewOptions.districts.length > 0 ? viewOptions.districts[0] : undefined,
    _status: viewOptions.status || -1,
    _typeId: viewOptions.typeId || -1,
  });

  const { data: districts, isLoading: districtLoading } = useGetDistrictsQuery(
    {},
  );
  const { data: wards, isLoading: wardLoading } = useGetWardsQuery({});
  const { data: panelTypes, isLoading: panelTypeLoading } =
    useGetPanelTypesQuery({});

  const id = useId();

  return (
    <GeneralModal
      headerText="Apply view options"
      onModalClose={onModalClose}
      onClickPrimaryButton={() => {
        onSubmit({
          ...state,
          districts:
            state.district && state.district !== -1 ? [state.district] : [],
          status: state._status !== -1 ? state._status : undefined,
          typeId: state._typeId !== -1 ? state._typeId : undefined,
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
              Panels' status
            </InputLabel>
            <CustomSelect
              labelId={id + '-select-status'}
              input={<OutlinedInput label="Panels' status" />}
              value={state._status || -1}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _status: e.target.value as PanelStatus,
                }))
              }
            >
              <MenuItem value={-1}>Any</MenuItem>
              {Object.keys(PanelStatus)
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
            <InputLabel id={id + '-select-type'}>Panels' type</InputLabel>
            <CustomSelect
              labelId={id + '-select-type'}
              input={<OutlinedInput label="Panels' type" />}
              value={state._typeId}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _typeId: e.target.value as number,
                }))
              }
              disabled={panelTypeLoading}
            >
              <MenuItem value={-1}>Any</MenuItem>
              {panelTypes?.data.map((e) => (
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

export default PanelListViewOptions;
