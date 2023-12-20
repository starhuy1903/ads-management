import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { ModalKey } from '@/constants/modal';
import {
  useCreateWardMutation,
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
} from '@/store/api/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
  districtId: number;
}

const schema = yup.object({
  name: yup.string().required("Ward's name is required"),
  districtId: yup.number().required(),
});

const WardsCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: districts } = useGetDistrictsQuery({});

  const [getDistricts] = useLazyGetDistrictsQuery();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      const districtsResult = await getDistricts({}, true).unwrap();
      return {
        name: '',
        districtId: districtsResult.data[0].id,
      };
    },
  });

  const [createWard] = useCreateWardMutation();

  const handleCreateWard = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Create new ward ?`,
        onModalClose: () => null,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await createWard({
              ...data,
              district_id: data.districtId,
            }).unwrap();
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
            onClick={handleCreateWard}
          >
            Create ward
          </Button>
        </>
      }
    >
      <Box
        component="form"
        sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: '16px',
        }}
      >
        {isLoading || !districts ? (
          <>
            <FormInputSkeleton label="Name" />
            <FormInputSkeleton label="District" />
          </>
        ) : (
          <>
            <ControlledTextField control={control} name="name" label="Name" />
            <ControlledSelect
              control={control}
              name="districtId"
              label="District"
              options={districts.data.map((e) => ({
                value: e.id.toString(),
                label: e.name,
              }))}
            />
          </>
        )}
      </Box>
    </StaticActionBar>
  );
};

export default WardsCreate;
