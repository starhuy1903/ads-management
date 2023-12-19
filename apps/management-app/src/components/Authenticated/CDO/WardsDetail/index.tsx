/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import {
  useDeleteWardsMutation,
  useGetDistrictsQuery,
  useLazyGetWardByIdQuery,
  useUpdateWardMutation,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
  district_id: number;
}

const WardsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [getWard, { isError }] = useLazyGetWardByIdQuery();

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const { data: districts, isLoading: districtsLoading } = useGetDistrictsQuery(
    {},
  );

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
      const ward = await getWard(parseInt(id!), true).unwrap();
      return ward
        ? { name: ward.name, district_id: ward.district_id }
        : { name: '', district_id: 0 };
    },
  });

  const [updateWard] = useUpdateWardMutation();

  const handleUpdateWard = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await updateWard({ id: parseInt(id!), data }).unwrap();
        showSuccess('Ward updated');
        reset(data);
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }),
    [updateWard],
  );

  const [deleteWards] = useDeleteWardsMutation();

  const handleDeleteWard = useCallback(async () => {
    try {
      await deleteWards(parseInt(id!)).unwrap();
      showSuccess('Ward deleted');
      navigate(-1);
    } catch (error) {
      showError(
        isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
      );
    }
  }, [deleteWards, id, navigate]);

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
              onClick={handleUpdateWard}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteWard}
            >
              Delete
            </Button>
          </Box>
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
        {isLoading || districtsLoading ? (
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

export default WardsDetail;
