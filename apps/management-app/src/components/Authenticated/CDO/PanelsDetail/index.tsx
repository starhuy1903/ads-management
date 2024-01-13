/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '@/store';
import ControlledDatePicker from '@/components/Common/ControlledDatePicker';
import ControlledSelect from '@/components/Common/ControlledSelect';
import ControlledTextField from '@/components/Common/ControlledTextField';
import DropFileContainer from '@/components/Common/DropFileContainer';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import {
  useDeletePanelsMutation,
  useGetLocationsQuery,
  useLazyGetPanelByIdQuery,
  useUpdatePanelMutation,
} from '@/store/api/adsManagementApiSlice';
import { useGetPanelTypesQuery } from '@/store/api/generalManagementApiSlice';
import { isApiErrorResponse } from '@/store/api/helper';
import { showModal } from '@/store/slice/modal';
import { PanelStatus } from '@/types/cdoManagement';
import { showError } from '@/utils/toast';
import FormInputSkeleton from '../FormInputSkeleton';
import StaticActionBar from '../StaticActionBar';

dayjs.extend(utc);

interface FormData {
  // name: string;
  typeId: number;
  width: number;
  height: number;
  locationId: number;
  createContractDate: dayjs.Dayjs;
  expiredContractDate: dayjs.Dayjs;
  companyEmail: string;
  companyNumber: string;
  images: Array<File>;
}

const schema = yup.object({
  // name: yup.string().required("Panel's name is required"),
  typeId: yup.number().required(),
  width: yup
    .number()
    .typeError("Panel's width must be a number")
    .positive("Panel's width must be positive")
    .required("Panel's width is required"),
  height: yup
    .number()
    .typeError("Panel's height must be a number")
    .positive("Panel's width must be positive")
    .required("Panel's width is required"),
  locationId: yup.number().required(),
  createContractDate: yup.mixed().required(),
  expiredContractDate: yup.mixed().required(),
  companyEmail: yup
    .string()
    .email('Please enter valid email')
    .required("Company's email is required"),
  companyNumber: yup.string().required("Company's number is required"),
  images: yup.array(),
});

const PanelsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getPanel] = useLazyGetPanelByIdQuery();
  const { data: locations } = useGetLocationsQuery({
    districts: [],
    wards: [],
  });
  const { data: panelTypes } = useGetPanelTypesQuery({});

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      try {
        const panel = await getPanel(parseInt(id!), true).unwrap();
        const images = await Promise.all(
          panel.data.imageUrls.map(
            async (e) =>
              await fetch(e)
                .then((res) => res.blob())
                .then((blob) => {
                  return new File([blob], e);
                }),
          ),
        );

        return {
          ...panel.data,
          createContractDate: dayjs.utc(panel.data.createContractDate),
          expiredContractDate: dayjs.utc(panel.data.expiredContractDate),
          images,
        };
      } catch (error) {
        showError(
          isApiErrorResponse(error) && error.status === 404
            ? 'Detail not found'
            : 'Something went wrong',
        );
        navigate('/panels', { replace: true });
        return {
          name: '',
          typeId: 0,
          width: 0,
          height: 0,
          locationId: 0,
          createContractDate: dayjs.utc(),
          expiredContractDate: dayjs.utc(),
          companyEmail: '',
          companyNumber: '',
          images: [],
        };
      }
    },
  });

  const formValue = watch();

  const handleAddImage = useCallback(
    (file: File) =>
      setValue('images', [...formValue.images, file], {
        shouldDirty: true,
        shouldValidate: true,
      }),
    [formValue.images, setValue],
  );

  const handleUploadImage = useCallback(
    (file: File | null) => {
      if (!file) {
        return;
      }

      dispatch(
        showModal(ModalKey.CROP_IMAGE, {
          image: file,
          aspect: 16 / 9,
          onSubmit: handleAddImage,
        }),
      );
    },
    [dispatch, handleAddImage],
  );

  const handleDeleteImage = useCallback(
    (file: File) => {
      setValue(
        'images',
        formValue.images.filter((image) => image !== file),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    },
    [formValue.images, setValue],
  );

  const renderUpdateImageContainer = ({
    open,
    disabled,
  }: {
    open: () => void;
    disabled: boolean;
  }) => <UploadImageCard open={open} disabled={disabled} />;

  const handlePickLocation = useCallback(() => {
    dispatch(
      showModal(ModalKey.LOCATION_PICKING, {
        onConfirm: (id: number) => {
          setValue('locationId', id, {
            shouldDirty: true,
            shouldValidate: true,
          });
          dispatch(showModal(null));
        },
      }),
    );
  }, [dispatch, setValue]);

  const [updatePanel] = useUpdatePanelMutation();

  const handleUpdatePanel = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Apply changes ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await updatePanel({
              id: parseInt(id!),
              data: {
                ...data,
                createContractDate: data.createContractDate.format(),
                expiredContractDate: data.expiredContractDate.format(),
                status: PanelStatus.APPROVED,
              },
            }).unwrap();
            reset(data);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

  const [deletePanels] = useDeletePanelsMutation();

  const handleDeletePanel = useCallback(async () => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Delete  ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await deletePanels(parseInt(id!)).unwrap();
            navigate(-1);
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  }, [deletePanels, dispatch, id, navigate]);

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
              onClick={handleUpdatePanel}
            >
              Save changes
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeletePanel}
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '16px',
          rowGap: '16px',
        }}
      >
        {isLoading || !panelTypes ? (
          <>
            {/* <FormInputSkeleton label="Name" reserveHelperTextSpace /> */}
            <FormInputSkeleton label="Type" />
            <Box />
            <FormInputSkeleton label="Width" reserveHelperTextSpace />
            <FormInputSkeleton label="Height" reserveHelperTextSpace />
            <FormInputSkeleton label="Location" />
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button variant="contained" disabled>
                Pick location
              </Button>
            </Box>
            <FormInputSkeleton label="Contract created on" />
            <FormInputSkeleton label="Contract expire on" />
            <FormInputSkeleton label="Company email" />
            <FormInputSkeleton label="Company number" />
          </>
        ) : (
          <>
            {/* <ControlledTextField control={control} name="name" label="Name" /> */}
            <ControlledSelect
              control={control}
              name="typeId"
              label="Type"
              options={panelTypes.data.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
            />
            <Box />
            <ControlledTextField
              control={control}
              name="width"
              label="Width"
              type="number"
            />
            <ControlledTextField
              control={control}
              name="height"
              label="Height"
              type="number"
            />
            <FormControl fullWidth>
              <FormLabel>Location</FormLabel>
              <TextField
                value={
                  locations?.data.find((e) => e.id === formValue.locationId)
                    ?.name
                }
                disabled
              />
            </FormControl>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                sx={{ color: 'common.white' }}
                onClick={handlePickLocation}
              >
                Pick location
              </Button>
            </Box>
            <ControlledDatePicker
              control={control}
              name="createContractDate"
              label="Contract created on"
            />
            <ControlledDatePicker
              control={control}
              name="expiredContractDate"
              label="Contract expire on"
            />
            <ControlledTextField
              control={control}
              name="companyEmail"
              label="Company email"
            />
            <ControlledTextField
              control={control}
              name="companyNumber"
              label="Company number"
            />
            <Box sx={{ gridColumn: '1 / span 2' }}>
              <FormControl>
                <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
                <Stack direction="row" spacing={2}>
                  {formValue.images.map((image, index) => (
                    <ImagePreview
                      key={index}
                      image={image}
                      disabled={isLoading}
                      onDeleteImage={handleDeleteImage}
                    />
                  ))}
                  {formValue.images.length < 2 && (
                    <DropFileContainer
                      onDropFile={handleUploadImage}
                      acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
                      renderChildren={renderUpdateImageContainer}
                      disabled={isLoading}
                      maxSize={ImageFileConfig.MAX_SIZE}
                    />
                  )}
                </Stack>
              </FormControl>
            </Box>
          </>
        )}
      </Box>
    </StaticActionBar>
  );
};

export default PanelsDetail;
