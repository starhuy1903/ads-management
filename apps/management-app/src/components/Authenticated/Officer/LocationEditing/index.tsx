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
import { ImageFileConfig } from '@/constants/validation';
import {
  useCreateUpdateLocationRequestMutation,
  useGetLocationByIdQuery,
  useGetLocationTypesOfficerQuery,
} from '@/store/api/officerApiSlice';
import { showModal } from '@/store/slice/modal';
import {
  Location,
  LocationType,
  UpdateLocationDto,
} from '@/types/officer-management';

const adsTypes = [
  {
    id: 1,
    name: 'Political agitation',
  },
  {
    id: 2,
    name: 'Commercial advertising',
  },
  {
    id: 3,
    name: 'Socialization',
  },
];

export default function LocationEditing() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { locationId } = useParams<{ locationId: string }>();

  const userId = useAppSelector((state) => state?.user?.profile?.id);

  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);

  const { data: locationData, isLoading: locationLoading } =
    useGetLocationByIdQuery(locationId!);
  const { data: locationTypeData, isLoading: locationTypeLoading } =
    useGetLocationTypesOfficerQuery({});

  const { handleSubmit, register, control, formState, setValue, watch, reset } =
    useForm<UpdateLocationDto>({
      mode: 'onChange',
    });

  useEffect(() => {
    if (locationData && locationTypeData && userId) {
      setLocation(locationData?.data);
      setLocationTypes(locationTypeData?.data);

      reset({
        belongLocationId: locationData?.data?.id,
        userId: userId,
        typeId: locationData?.data?.type?.id,
        adsTypeId: locationData?.data?.adType?.id,
        name: locationData?.data?.name,
        images: [],
        reason: '',
        lat: locationData?.data?.lat,
        long: locationData?.data?.long,
        isPlanning: locationData?.data?.isPlanning,
        fullAddress: locationData?.data?.fullAddress,
        wardId: locationData?.data?.ward?.id,
        districtId: locationData?.data?.district?.id,
      });
    }
  }, [locationData, locationTypeData, reset, userId]);

  useEffect(() => {
    if (location?.imageUrls) {
      fetch(location?.imageUrls[0])
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], location?.imageUrls[0]);
          setValue('images', [file]);
        });
    }
  }, [location?.imageUrls, setValue]);

  const { errors: formError } = formState;
  const formValue = watch();

  const [submitting, setSubmitting] = useState(false);

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

  const [updateLocation] = useCreateUpdateLocationRequestMutation();

  const onSubmit = async (data: UpdateLocationDto) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('belongLocationId', data.belongLocationId.toString());
      formData.append('userId', data.userId.toString());
      formData.append('typeId', data.typeId.toString());
      formData.append('adsTypeId', data.adsTypeId.toString());
      formData.append('name', data.name);
      data.images.forEach((image) => formData.append('images', image));
      formData.append('reason', data.reason);
      formData.append('lat', data.lat.toString());
      formData.append('long', data.long.toString());
      formData.append('isPlanning', data.isPlanning.toString());
      formData.append('fullAddress', data.fullAddress);
      formData.append('wardId', data.wardId.toString());
      formData.append('districtId', data.districtId.toString());

      await updateLocation(formData).unwrap();

      setSubmitting(false);

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  if (locationLoading || locationTypeLoading || !location || !locationTypes) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Create Location Editing Request">
      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm field="id" label="ID" value={location?.id} />

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

      <Typography variant="h6">Classification</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth error={!!formError.name}>
          <FormLabel htmlFor="reportType">Name</FormLabel>
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
          <FormLabel htmlFor="reportType">Type</FormLabel>
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
        <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          {formValue.images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              disabled={submitting}
              onDeleteImage={handleDeleteImage}
            />
          ))}
          {formValue.images.length < 1 && (
            <DropFileContainer
              onDropFile={handleUpdateImage}
              acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
              renderChildren={renderUpdateImageContainer}
              disabled={submitting}
              maxSize={ImageFileConfig.MAX_SIZE}
            />
          )}
        </Stack>
      </FormControl>

      <Typography
        variant="h6"
        sx={{
          mt: 2,
        }}
      >
        Update reason
      </Typography>
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
        disabled={submitting}
        onClick={handleSubmit(onSubmit)}
        sx={{ mt: 2, color: 'white' }}
      >
        Submit request
      </Button>
      <DevTool control={control} />
    </DetailWrapper>
  );
}
