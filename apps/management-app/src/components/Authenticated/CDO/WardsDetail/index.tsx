/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { ModalKey } from '@/constants/modal';
import {
  useDeleteWardsMutation,
  useGetDistrictsQuery,
  useLazyGetWardByIdQuery,
  useUpdateWardMutation,
} from '@/store/api/cdo/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showModal } from '@/store/slice/modal';
import { showError } from '@/utils/toast';
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

const WardsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getWard, { data }] = useLazyGetWardByIdQuery();

  const { data: districts } = useGetDistrictsQuery({});

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
        const ward = await getWard(parseInt(id!), true).unwrap();
        return ward.data;
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/wards', { replace: true });
        return { name: '', districtId: 0 };
      }
    },
  });

  const [updateWard] = useUpdateWardMutation();

  const handleUpdateWard = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updateWard({
              id: parseInt(id!),
              data,
            }).unwrap();
            reset(data);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  const [deleteWards] = useDeleteWardsMutation();

  const handleDeleteWard = useCallback(() => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Delete ${data?.data.name} ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await deleteWards(parseInt(id!)).unwrap();
            navigate(-1);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  }, [data?.data.name, deleteWards, dispatch, id, navigate]);

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

export default WardsDetail;
