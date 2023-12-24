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
import ControlledTextField from '@/components/Common/ControlledTextField';
import { ModalKey } from '@/constants/modal';
import {
  useDeleteReportTypesMutation,
  useLazyGetReportTypeByIdQuery,
  useUpdateReportTypeMutation,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showModal } from '@/store/slice/modal';
import { showError } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const schema = yup.object({
  name: yup.string().required("Report type's name is required"),
});

const ReportTypesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getReportType, { data }] = useLazyGetReportTypeByIdQuery();

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
        const reportType = await getReportType(parseInt(id!), true).unwrap();
        return reportType;
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/report-types', { replace: true });
        return { name: '' };
      }
    },
  });

  const [updateReportType] = useUpdateReportTypeMutation();

  const handleUpdateReportType = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updateReportType({ id: parseInt(id!), data }).unwrap();
            reset(data);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  const [deleteReportTypes] = useDeleteReportTypesMutation();

  const handleDeleteReportType = useCallback(() => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Delete ${data?.name} ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await deleteReportTypes(parseInt(id!)).unwrap();
            navigate(-1);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  }, [data?.name, deleteReportTypes, dispatch, id, navigate]);

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
              onClick={handleUpdateReportType}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteReportType}
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

export default ReportTypesDetail;
