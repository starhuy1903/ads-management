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
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import DropFileContainer from '@/components/Common/DropFileContainer';
import { ReadOnlyTextForm } from '@/components/Common/FormComponents';
import { DetailWrapper } from '@/components/Common/Layout/ScreenWrapper';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { MAX_ID_LENGTH } from '@/constants/url-params';
import { ImageFileConfig } from '@/constants/validation';
import {
  useLazyGetAdsTypesOfficerQuery,
  useLazyGetLocationByIdOfficerQuery,
  useLazyGetLocationTypesOfficerQuery,
} from '@/store/api/officer/locationApiSlice';
import { useCreateUpdateLocationRequestMutation } from '@/store/api/officer/requestApiSlide';
import { showModal } from '@/store/slice/modal';
import {
  AdsType,
  Location,
  LocationType,
  UpdateLocationDto,
} from '@/types/officer-management';
import { formatDateTime } from '@/utils/datetime';
import { capitalize } from '@/utils/format-string';
import { showError, showSuccess } from '@/utils/toast';
import { isString, isValidLength } from '@/utils/validate';

export default function LocationEditing() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { locationId } = useParams<{ locationId: string }>();
  const userId = useAppSelector((state) => state?.user?.profile?.id);

  const [location, setLocation] = useState<Location | null>(null);
  const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
  const [adsTypes, setAdsTypes] = useState<AdsType[]>([]);

  const [getLocation, { isLoading: locationLoading }] =
    useLazyGetLocationByIdOfficerQuery();
  const [getLocationTypes, { isLoading: locationTypesLoading }] =
    useLazyGetLocationTypesOfficerQuery();
  const [getAdsTypes, { isLoading: adsTypesLoading }] =
    useLazyGetAdsTypesOfficerQuery();

  const { handleSubmit, register, control, formState, setValue, watch, reset } =
    useForm<UpdateLocationDto>({
      mode: 'onChange',
    });

  function handleInvalidRequest() {
    setLocation(null);
    navigate('/locations', { replace: true });
  }

  useEffect(() => {
    if (
      !locationId ||
      !isString(locationId) ||
      !isValidLength(locationId, MAX_ID_LENGTH)
    ) {
      handleInvalidRequest();
      return;
    }

    async function fetchData() {
      try {
        const locationData = await getLocation(locationId!, true).unwrap();
        const locationTypesData = await getLocationTypes().unwrap();
        const adsTypesData = await getAdsTypes().unwrap();

        setLocation(locationData);
        setLocationTypes(locationTypesData);
        setAdsTypes(adsTypesData);

        reset({
          belongLocationId: locationData.id,
          userId: userId,
          typeId: locationData.type.id,
          adsTypeId: locationData.adType.id,
          name: locationData.name,
          images: [],
          reason: '',
          lat: locationData.lat,
          long: locationData.long,
          isPlanning: locationData.isPlanning,
          fullAddress: locationData.fullAddress,
          wardId: locationData.ward.id,
          districtId: locationData.district.id,
        });
      } catch (error) {
        console.log(error);
        handleInvalidRequest();
      }
    }

    fetchData();
  }, [getAdsTypes, getLocation, getLocationTypes, locationId, userId]);

  useEffect(() => {
    if (location?.imageUrls) {
      const fetchImages = async () => {
        const files = [];
        for (const url of location.imageUrls) {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            files.push(new File([blob], 'image.jpg', { type: blob.type }));
          } catch (error) {
            console.error(`Error fetching image ${url}:`, error);
          }
        }
        setValue('images', files);
      };
      fetchImages();
    }
  }, [location?.imageUrls, setValue]);

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

  const [updateLocation, { isLoading: isSubmitting }] =
    useCreateUpdateLocationRequestMutation();

  const onSubmit = async (data: UpdateLocationDto) => {
    try {
      await updateLocation(data).unwrap();

      showSuccess('Editing request sent successfully');
      navigate('/locations');
    } catch (error) {
      console.log(error);
      showError('Editing request sent failed');
    }
  };

  if (
    locationLoading ||
    locationTypesLoading ||
    adsTypesLoading ||
    !location ||
    !locationTypes ||
    !adsTypes
  ) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper
      label={`
      Update Location #${location?.id}
    `}
    >
      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm field="id" label="ID" value={location?.id} />

        <ReadOnlyTextForm
          field="name"
          label="Planned"
          value={location?.isPlanning ? 'No' : 'Yes'}
        />

        <ReadOnlyTextForm
          field="status"
          label="Status"
          value={capitalize(location?.status)}
        />

        <ReadOnlyTextForm
          field="createdTime"
          label="Created Time"
          value={formatDateTime(location?.createdAt)}
        />

        <ReadOnlyTextForm
          field="updatedTime"
          label="Updated Time"
          value={formatDateTime(location?.updatedAt)}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm
          field="address"
          label="Address"
          value={location?.fullAddress}
        />

        <ReadOnlyTextForm
          field="ward"
          label="Ward"
          value={location?.ward?.name}
        />

        <ReadOnlyTextForm
          field="district"
          label="District"
          value={location?.district?.name}
        />

        <ReadOnlyTextForm field="lat" label="Latitude" value={location?.lat} />

        <ReadOnlyTextForm
          field="long"
          label="Longtitude"
          value={location?.long}
        />
      </Stack>

      <Typography variant="h6">Updateable Fields</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth error={!!formError.name}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <TextField
            {...register('name', {
              required: 'The name is required.',
            })}
            id="name"
            error={!!formError.name}
            aria-describedby="name-helper-text"
          />
          <FormHelperText id="name-helper-text">
            {formError.name?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.typeId}>
          <FormLabel htmlFor="typeId">Type</FormLabel>
          <Select
            id="typeId"
            {...register('typeId')}
            aria-describedby="typeId-helper-text"
            defaultValue={location?.type?.id}
          >
            {locationTypes.map((type) => (
              <MenuItem key={type?.id} value={type?.id}>
                {type?.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="typeId-helper-text">
            {formError.typeId?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={!!formError.adsTypeId}>
          <FormLabel htmlFor="adsType">Advertising Type</FormLabel>
          <Select
            id="adsTypeId"
            {...register('adsTypeId')}
            aria-describedby="adsTypeId-helper-text"
            defaultValue={location?.adType?.id}
          >
            {adsTypes.map((type) => (
              <MenuItem key={type?.id} value={type?.id}>
                {type?.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="adsType-helper-text">
            {formError.adsTypeId?.message}
          </FormHelperText>
        </FormControl>
      </Stack>

      <FormControl>
        <FormLabel sx={{ mb: 1 }}>Image</FormLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {formValue.images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              disabled={isSubmitting}
              onDeleteImage={handleDeleteImage}
            />
          ))}
          {formValue.images.length < 2 && (
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

      <FormControl fullWidth error={!!formError.reason}>
        <FormLabel htmlFor="reason">Reason</FormLabel>
        <TextField
          {...register('reason', {
            required: 'The reason is required.',
          })}
          id="reason"
          error={!!formError.reason}
          aria-describedby="reason-helper-text"
          multiline
          rows={4}
        />
        <FormHelperText id="reason-helper-text">
          {formError.reason?.message}
        </FormHelperText>
      </FormControl>

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
