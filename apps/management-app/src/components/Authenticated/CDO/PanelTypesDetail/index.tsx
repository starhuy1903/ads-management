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
  useDeletePanelTypesMutation,
  useLazyGetPanelTypeByIdQuery,
  useUpdatePanelTypeMutation,
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
  name: yup.string().required("Panel type's name is required"),
});

const PanelTypesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getPanelType, { data }] = useLazyGetPanelTypeByIdQuery();

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
        const panelType = await getPanelType(parseInt(id!), true).unwrap();
        return panelType;
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/panel-types', { replace: true });
        return { name: '' };
      }
    },
  });

  const [updatePanelType] = useUpdatePanelTypeMutation();

  const handleUpdatePanelType = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updatePanelType({ id: parseInt(id!), data }).unwrap();
            reset(data);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  const [deletePanelTypes] = useDeletePanelTypesMutation();

  const handleDeletePanelType = useCallback(() => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Delete ${data?.name} ?`,
        
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await deletePanelTypes(parseInt(id!)).unwrap();
            navigate(-1);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  }, [data?.name, deletePanelTypes, dispatch, id, navigate]);

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
