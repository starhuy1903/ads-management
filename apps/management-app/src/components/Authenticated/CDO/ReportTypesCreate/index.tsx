import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import ControlledTextField from '@/components/Common/ControlledTextField';
import { useCreateReportTypeMutation } from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const ReportTypesCreate = () => {
  const navigate = useNavigate();

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required("Report type's name is required"),
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

  const [createReportType] = useCreateReportTypeMutation();

  const handleCreateReportType = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await createReportType(data).unwrap();
        showSuccess('Report type created');
        reset();
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }),
    [createReportType],
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
            onClick={handleCreateReportType}
          >
            Create report type
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

export default ReportTypesCreate;
