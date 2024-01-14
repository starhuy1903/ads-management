import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useId, useState } from 'react';
import { useAppDispatch } from '@/store';
import { showModal } from '@/store/slice/modal';
import { AccountRole, IAccountListViewOptions } from '@/types/cdoManagement';
import CustomSelect from '../Common/CustomSelect';
import GeneralModal from './GeneralModal';

interface AccountListViewOptionsProps {
  viewOptions: IAccountListViewOptions;
  onSubmit: (viewOptions: IAccountListViewOptions) => void;
  onModalClose: () => void;
}

const AccountListViewOptions = ({
  viewOptions,
  onSubmit,
  onModalClose,
}: AccountListViewOptionsProps) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<
    IAccountListViewOptions & {
      _role: AccountRole | -1;
    }
  >({
    ...viewOptions,
    _role: viewOptions.role || -1,
  });

  const id = useId();

  return (
    <GeneralModal
      headerText="Apply filter options"
      onModalClose={onModalClose}
      onClickPrimaryButton={() => {
        onSubmit({
          ...state,

          role: state._role !== -1 ? state._role : undefined,
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
            <InputLabel id={id + '-select-role'}>Accounts' role</InputLabel>
            <CustomSelect
              labelId={id + '-select-role'}
              input={<OutlinedInput label="Accounts' role" />}
              value={state._role || -1}
              onChange={(e) =>
                setState((pre) => ({
                  ...pre,
                  _role: e.target.value as AccountRole,
                }))
              }
            >
              <MenuItem value={-1}>Any</MenuItem>
              {Object.keys(AccountRole)
                .filter((e) => isNaN(Number(e)))
                .map((e) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <MenuItem key={e} value={AccountRole[e] || -1}>
                    {e}
                  </MenuItem>
                ))}
            </CustomSelect>
          </FormControl>
        </Box>
      }
    />
  );
};

export default AccountListViewOptions;
