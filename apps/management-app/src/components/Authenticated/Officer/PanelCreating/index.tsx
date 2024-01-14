import { DevTool } from '@hookform/devtools';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import DropFileContainer from '@/components/Common/DropFileContainer';
import { ReadOnlyTextForm } from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { useGetLocationsOfficerQuery } from '@/store/api/officer/locationApiSlice';
import {
  useCreatePanelOfficerMutation,
  useGetPanelTypesOfficerQuery,
} from '@/store/api/officer/panelApiSlide';
import { showModal } from '@/store/slice/modal';
import { Location, PanelDto, PanelType } from '@/types/officer-management';
import { showError, showSuccess } from '@/utils/toast';

export default function PanelCreating() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);
  const [panelTypes, setPanelTypes] = useState<PanelType[]>([]);

  const { data: locationData, isLoading: locationLoading } =
    useGetLocationsOfficerQuery({});
  const { data: panelTypeData, isLoading: panelTypeLoading } =
    useGetPanelTypesOfficerQuery();

  useEffect(() => {
    if (locationData && panelTypeData) {
      setLocations(locationData.data);
      setPanelTypes(panelTypeData);
    }
  }, [locationData, panelTypeData]);

  const { handleSubmit, register, control, formState, setValue, watch } =
    useForm<PanelDto>({
      mode: 'onChange',
      defaultValues: {
        images: [],
        typeId: 1,
        width: 0,
        height: 0,
        locationId: locations ? locations[0]?.id : 0,
        companyEmail: '',
        companyNumber: '',
        createContractDate: new Date().toISOString(),
        expiredContractDate: new Date().toISOString(),
      },
    });

  const { errors: formError } = formState;
  const formValue = watch();

  const handleAddImage = useCallback(
    (file: File) => setValue('images', [...formValue.images, file]),
    [formValue.images, setValue],
  );

  const handleUpdateImage = useCallback(
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
        formValue?.images.filter((image) => image !== file),
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

  const [createPanel, { isLoading: isSubmitting }] =
    useCreatePanelOfficerMutation();

  const onSubmit = async (data: PanelDto) => {
    try {
      await createPanel(data).unwrap();

      showSuccess('Draft panel created successfully');
      navigate('/panels');
    } catch (error) {
      console.log(error);
      showError('Draft panel created failed');
    }
  };

  if (locationLoading || panelTypeLoading || !locations || !panelTypes) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Create Panel Licensing Request">
      <Typography variant="h6">Choose location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth error={!!formError.locationId}>
          <FormLabel htmlFor="locationId">Location Name</FormLabel>
          <Select
            id="locationId"
            {...register('locationId')}
            aria-describedby="locationId-helper-text"
            defaultValue={locations ? locations[0]?.id : 0}
          >
            {locations &&
              locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText id="locationId-helper-text">
            {formError.locationId?.message}
          </FormHelperText>
        </FormControl>

        <ReadOnlyTextForm
          field="address"
          label="Address"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.fullAddress ?? ''
          }
        />

        <ReadOnlyTextForm
          field="ward"
          label="Ward"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.ward?.name ?? ''
          }
        />

        <ReadOnlyTextForm
          field="district"
          label="District"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.district?.name ?? ''
          }
        />

        <ReadOnlyTextForm
          field="lat"
          label="Latitude"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.lat ?? ''
          }
        />

        <ReadOnlyTextForm
          field="long"
          label="Longtitude"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.long ?? ''
          }
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm
          field="positionType"
          label="Position Type"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.type?.name ?? ''
          }
        />

        <ReadOnlyTextForm
          field="adType"
          label="Adverting Type"
          value={
            locations.find((location) => location.id === formValue.locationId)
              ?.adType?.name ?? ''
          }
        />
      </Stack>

      <Typography variant="h6">Panel</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth error={!!formError.typeId}>
          <FormLabel htmlFor="typeId">Type</FormLabel>
          <Select
            id="typeId"
            {...register('typeId')}
            aria-describedby="typeId-helper-text"
            defaultValue={panelTypes[0]}
          >
            {panelTypes.map((type) => (
              <MenuItem key={type?.id} value={type?.id}>
                {type?.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="typeId-helper-text">
            {formError.typeId?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.width}>
          <FormLabel htmlFor="width">Width</FormLabel>
          <TextField
            type="number"
            {...register('width', {
              required: 'The width is required.',
              min: {
                value: 0,
                message: 'The width must be greater than 0.',
              },
            })}
            id="width"
            error={!!formError.width}
            aria-describedby="width-helper-text"
            inputProps={{ min: 0 }}
          />
          <FormHelperText id="width-helper-text">
            {formError.width?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.height}>
          <FormLabel htmlFor="height">Height</FormLabel>
          <TextField
            type="number"
            {...register('height', {
              required: 'The height is required.',
              min: {
                value: 0,
                message: 'The height must be greater than 0.',
              },
            })}
            id="height"
            error={!!formError.height}
            aria-describedby="height-helper-text"
            inputProps={{ min: 0 }}
          />
          <FormHelperText id="height-helper-text">
            {formError.height?.message}
          </FormHelperText>
        </FormControl>
      </Stack>

      <FormControl>
        <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {formValue.images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              disabled={isSubmitting}
              onDeleteImage={handleDeleteImage}
            />
          ))}
          {formValue.images.length < 1 && (
            <DropFileContainer
              onDropFile={handleUpdateImage}
              acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
              renderChildren={renderUpdateImageContainer}
              disabled={isSubmitting}
              maxSize={ImageFileConfig.MAX_SIZE}
            />
          )}
        </Stack>
      </FormControl>

      <Typography variant="h6">Company</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth error={!!formError.companyEmail}>
          <FormLabel htmlFor="companyEmail">Email</FormLabel>
          <TextField
            {...register('companyEmail', {
              required: 'The company email is required.',
            })}
            id="companyEmail"
            placeholder="company@gmail.com"
            error={!!formError.companyEmail}
            aria-describedby="companyEmail-helper-text"
          />
          <FormHelperText id="companyEmail-helper-text">
            {formError.companyEmail?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.companyNumber}>
          <FormLabel htmlFor="companyNumber">Phone</FormLabel>
          <TextField
            {...register('companyNumber', {
              required: 'The company phone is required.',
            })}
            id="companyNumber"
            placeholder="0123456789"
            error={!!formError.companyNumber}
            aria-describedby="companyNumber-helper-text"
          />
          <FormHelperText id="companyNumber-helper-text">
            {formError.companyNumber?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.createContractDate}>
          <FormLabel htmlFor="createContractDate">
            Created Contract Date
          </FormLabel>
          <TextField
            type="date"
            {...register('createContractDate', {
              required: 'The created contract date is required.',
            })}
            id="createContractDate"
            error={!!formError.createContractDate}
            aria-describedby="createContractDate-helper-text"
          />
          <FormHelperText id="createContractDate-helper-text">
            {formError.createContractDate?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.expiredContractDate}>
          <FormLabel htmlFor="expiredContractDate">
            Expired Contract Date
          </FormLabel>
          <TextField
            type="date"
            {...register('expiredContractDate', {
              required: 'The expired contract date is required.',
              validate: (value) => {
                if (value < formValue.createContractDate) {
                  return 'The expired contract date must be after the created contract date.';
                }
                return true;
              },
            })}
            id="expiredContractDate"
            error={!!formError.expiredContractDate}
            aria-describedby="expiredContractDate-helper-text"
          />
          <FormHelperText id="expiredContractDate-helper-text">
            {formError.expiredContractDate?.message}
          </FormHelperText>
        </FormControl>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
        sx={{ mt: 2, color: 'white' }}
      >
        Submit request
      </Button>

      <DevTool control={control} />
    </DetailWrapper>
  );
}
