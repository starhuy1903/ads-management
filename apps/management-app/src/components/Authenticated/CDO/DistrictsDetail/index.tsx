/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import ControlledTextField from '@/components/Common/ControlledTextField';
import {
  useDeleteDistrictsMutation,
  useLazyGetDistrictByIdQuery,
  useUpdateDistrictMutation,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const schema = yup.object({
  name: yup.string().required("District's name is required"),
});

const DistrictsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [getDistrict] = useLazyGetDistrictByIdQuery();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      try {
        const district = await getDistrict(parseInt(id!), true).unwrap();
        return district;
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/districts', { replace: true });
        return { name: '' };
      }
    },
  });

  const [updateDistrict] = useUpdateDistrictMutation();

  const handleUpdateDistrict = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await updateDistrict({ id: parseInt(id!), data }).unwrap();
        showSuccess('District updated');
        reset(data);
      } catch (error) {
        showError(
          isApiErrorResponse(error)
            ? error.data?.message
            : 'Something went wrong',
        );
      }
    }),
    [updateDistrict],
  );

  const [deleteDistricts] = useDeleteDistrictsMutation();

  const handleDeleteDistrict = useCallback(async () => {
    try {
      await deleteDistricts(parseInt(id!)).unwrap();
      showSuccess('District deleted');
      navigate(-1);
    } catch (error) {
      showError(
        isApiErrorResponse(error)
          ? error.data?.message
          : 'Something went wrong',
      );
    }
  }, [deleteDistricts, id, navigate]);

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
          <Box sx={{ display: 'inline-flex', columnGap: '16px' }}>
            <Button
              variant="outlined"
              disabled={!isDirty}
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              disabled={!isDirty || !isValid}
              sx={{ color: (theme) => theme.palette.common.white }}
              onClick={handleUpdateDistrict}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteDistrict}
            >
              Delete
            </Button>
          </Box>
        </>
      }
    >
      <Box component="form" sx={{ width: '50%' }}>
        {isLoading ? (
          <FormInputSkeleton label="Name" />
        ) : (
          <ControlledTextField control={control} name="name" label="Name" />
        )}
      </Box>
    </StaticActionBar>
  );
};

export default DistrictsDetail;
