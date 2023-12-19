/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import ControlledTextField from '@/components/Common/ControlledTextField';
import {
  useDeleteAdsTypesMutation,
  useLazyGetAdsTypeByIdQuery,
  useUpdateAdsTypeMutation,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const schema = yup.object({
  name: yup.string().required("Advertisement type's name is required"),
});

const AdsTypesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [getAdsType, { isError }] = useLazyGetAdsTypeByIdQuery();

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      const adsType = await getAdsType(parseInt(id!)).unwrap();
      return adsType ? { name: adsType.name } : { name: '' };
    },
  });

  const [updateAdsType] = useUpdateAdsTypeMutation();

  const handleUpdateAdsType = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await updateAdsType({ id: parseInt(id!), data }).unwrap();
        showSuccess('Advertisement type updated');
        reset(data);
      } catch (error) {
        showError(
          isApiErrorResponse(error)
            ? error.data?.message
            : 'Something went wrong',
        );
      }
    }),
    [updateAdsType],
  );

  const [deleteAdsTypes] = useDeleteAdsTypesMutation();

  const handleDeleteAdsType = useCallback(async () => {
    try {
      await deleteAdsTypes(parseInt(id!)).unwrap();
      showSuccess('Advertisement type deleted');
      navigate(-1);
    } catch (error) {
      showError(
        isApiErrorResponse(error)
          ? error.data?.message
          : 'Something went wrong',
      );
    }
  }, [deleteAdsTypes, id, navigate]);

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
              onClick={handleUpdateAdsType}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAdsType}
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

export default AdsTypesDetail;
