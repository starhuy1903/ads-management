import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import {
  useCreateWardMutation,
  useGetDistrictsQuery,
  useLazyGetDistrictsQuery,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
  district_id: number;
}

const WardsCreate = () => {
  const navigate = useNavigate();

  const { data: districts } = useGetDistrictsQuery({});

  const [getDistricts] = useLazyGetDistrictsQuery();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required("Ward's name is required"),
        district_id: yup.number().required(),
      }),
    [],
  );

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
        district_id: districtsResult.data[0].id,
      };
    },
  });

  const [createWard] = useCreateWardMutation();

  const handleCreateWard = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await createWard(data).unwrap();
        showSuccess('Ward created');
        reset();
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }),
    [createWard],
  );

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
        {isLoading ? (
          <>
            <FormInputSkeleton label="Name" />
            <FormInputSkeleton label="District" />
          </>
        ) : (
          <>
            <ControlledTextField control={control} name="name" label="Name" />
            <ControlledSelect
              control={control}
              name="district_id"
              label="District"
              options={districts!.data!.map((e) => ({
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
