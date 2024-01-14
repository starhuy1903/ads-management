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
import { useNavigate } from 'react-router-dom';
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
  useCreatePanelMutation,
  useLazyGetLocationsQuery,
} from '@/store/api/cdo/adsManagementApiSlice';
import { useLazyGetPanelTypesQuery } from '@/store/api/cdo/generalManagementApiSlice';
import { showModal } from '@/store/slice/modal';
import { PanelStatus } from '@/types/cdoManagement';
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

const PanelsCreate = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [getPanelTypes, { data: panelTypes }] = useLazyGetPanelTypesQuery();
  const [getLocation, { data: locations }] = useLazyGetLocationsQuery();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isLoading },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: async () => {
      const panelTypesResult = await getPanelTypes({}, true).unwrap();
      const locationResult = await getLocation(
        { districts: [], wards: [] },
        true,
      ).unwrap();

      return {
        // name: '',
        typeId: panelTypesResult.data[0].id,
        width: 0,
        height: 0,
        locationId: locationResult.data[0].id,
        createContractDate: dayjs.utc(),
        expiredContractDate: dayjs.utc(),
        companyEmail: '',
        companyNumber: '',
        images: [],
      };
    },
  });

  const formValue = watch();

  const handleAddImage = useCallback(
    (file: File) => setValue('images', [...formValue.images, file]),
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
        initialLocation: formValue.locationId,
      }),
    );
  }, [dispatch, formValue.locationId, setValue]);

  const [createPanel] = useCreatePanelMutation();

  const handleCreatePanel = handleSubmit((data: FormData) => {
    dispatch(
      showModal(ModalKey.GENERAL, {
        headerText: `Create new panel ?`,
        primaryButtonText: 'Confirm',
        onClickPrimaryButton: async () => {
          try {
            dispatch(showModal(null));
            await createPanel({
              ...data,
              createContractDate: data.createContractDate.format(),
              expiredContractDate: data.expiredContractDate.format(),
              status: PanelStatus.APPROVED,
            }).unwrap();
            reset();
          } catch (error) {
            /* empty */
          }
        },
      }),
    );
  });

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
            onClick={handleCreatePanel}
            variant="contained"
            disabled={!isDirty || !isValid}
            sx={{ color: (theme) => theme.palette.common.white }}
          >
            Create panel
          </Button>
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
        {isLoading ? (
          <>
            {/* <FormInputSkeleton label="Name" reserveHelperTextSpace /> */}
            <FormInputSkeleton label="Type" />
            <Box />
            <FormInputSkeleton label="Width (m)" reserveHelperTextSpace />
            <FormInputSkeleton label="Height (m)" reserveHelperTextSpace />
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
          // <ControlledTextField control={control} name="name" label="Name" />
          <>
            <ControlledSelect
              control={control}
              name="typeId"
              label="Type"
              options={panelTypes!.data.map((e) => ({
                value: e.id,
                label: e.name,
              }))}
            />
            <Box />
            <ControlledTextField
              control={control}
              name="width"
              label="Width (m)"
              type="number"
            />
            <ControlledTextField
              control={control}
              name="height"
              label="Height (m)"
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
                <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
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

export default PanelsCreate;
