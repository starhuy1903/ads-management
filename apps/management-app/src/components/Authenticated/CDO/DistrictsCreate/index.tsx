import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { useCreateDistrictMutation } from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const DistrictsCreate = () => {
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required("District's name is required"),
      }),
    [],
  );

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

  const [createDistrict] = useCreateDistrictMutation();

  const handleCreateDistrict = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await createDistrict(data).unwrap();
        showSuccess('District created');
        reset();
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }),
    [createDistrict],
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
            onClick={handleCreateDistrict}
            variant="contained"
            disabled={!isDirty || !isValid}
            sx={{ color: (theme) => theme.palette.common.white }}
          >
            Create district
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

export default DistrictsCreate;
