import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import ControlledTextField from '@/components/Common/ControlledTextField';
import {
  useDeletePanelTypesMutation,
  useLazyGetPanelTypeByIdQuery,
  useUpdatePanelTypeMutation,
} from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showError, showSuccess } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

interface FormData {
  name: string;
}

const PanelTypesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [getPanelType, { isError }] = useLazyGetPanelTypeByIdQuery();

  useEffect(() => {
    if (isError) navigate(-1);
  }, [isError, navigate]);

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().required("Panel type's name is required"),
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
      const panelType = await getPanelType(parseInt(id!)).unwrap();
      return panelType ? { name: panelType.name } : { name: '' };
    },
  });

  const [updatePanelType] = useUpdatePanelTypeMutation();

  const handleUpdatePanelType = useCallback(
    handleSubmit(async (data: FormData) => {
      try {
        await updatePanelType(data).unwrap();
        showSuccess('Panel type updated');
        reset(data);
      } catch (error) {
        showError(
          isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
        );
      }
    }),
    [updatePanelType],
  );

  const [deletePanelTypes] = useDeletePanelTypesMutation();

  const handleDeletePanelType = useCallback(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await deletePanelTypes([parseInt(id!)]).unwrap();
      showSuccess('Panel type deleted');
      navigate(-1);
    } catch (error) {
      showError(
        isApiErrorResponse(error) ? error.data?.message : 'Unknown error',
      );
    }
  }, [deletePanelTypes, id, navigate]);

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
              onClick={handleUpdatePanelType}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeletePanelType}
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

export default PanelTypesDetail;
