import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { ModalKey } from '@/constants/modal';
import { useCreateLocationTypeMutation } from '@/store/api/cdo/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const schema = yup.object({
  name: yup.string().required("Location type's name is required"),
});

const LocationTypesCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const [createLocationType] = useCreateLocationTypeMutation();

  const handleCreateLocationType = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Create new location type ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await createLocationType(data).unwrap();
            reset();
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  return (
    <StaticActionBar
      actionBarAlign="space-between"
      actionBar={
        <>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disabled={!isDirty || !isValid}
            sx={{ color: (theme) => theme.palette.common.white }}
            onClick={handleCreateLocationType}
          >
            Create location type
          </Button>
        </>
      }
    >
      <Box component="form" sx={{ width: '50%' }}>
        <ControlledTextField control={control} name="name" label="Name" />
      </Box>
    </StaticActionBar>
  );
};

export default LocationTypesCreate;
