import { DevTool } from '@hookform/devtools';
import {
  Box,
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
import { useAppDispatch } from '@/store';
import { BackButton } from '@/components/Common/Buttons';
import DropFileContainer from '@/components/Common/DropFileContainer';
import { ReadOnlyTextField } from '@/components/Common/FormComponents';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { showModal } from '@/store/slice/modal';
import { showSuccess } from '@/utils/toast';

interface EditLocationFormType {
  positionType: string;
  adsType: string;
  imageFiles: File[];
  reason: string;
}

const PositionTypes = [
  'Public land/Park/Traffic safety corridor',
  'Private land/Individual houses',
  'Shopping mall',
  'Market',
  'Gas station',
  'Bus stop',
];

const AdsTypes = [
  'Political agitation',
  'Commercial advertising',
  'Socialization',
];

const location = {
  id: 5,
  address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
  ward: 'Ben Nghe',
  commue: '1',
  lat: 10.777,
  long: 106.666,
  positionType: 'Public land/Park/Traffic safety corridor',
  adsType: 'Commercial advertising',
  imageUrl:
    'https://piximus.net/media2/46719/cool-advertising-that-gets-straight-to-the-point-20.jpg',
  isPlanning: true,
  createdTime: '2023-12-08T11:30:53.945Z',
  modifiedTime: '2023-12-08T11:30:53.945Z',
};

export default function LocationEditing() {
  const dispatch = useAppDispatch();

  const { handleSubmit, register, control, formState, setValue, watch } =
    useForm<EditLocationFormType>({
      mode: 'onChange',
      defaultValues: {
        positionType: location?.positionType,
        adsType: location?.adsType,
        imageFiles: [],
        reason: '',
      },
    });

  useEffect(() => {
    // Fetch image and convert it to File
    fetch(location?.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], location?.imageUrl);
        setValue('imageFiles', [file]);
      });
  }, []);

  const { errors: formError } = formState;
  const formValue = watch();

  const [submitting, setSubmitting] = useState(false);

  const handleAddImage = useCallback(
    (file: File) => setValue('imageFiles', [...formValue.imageFiles, file]),
    [formValue.imageFiles, setValue],
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
        'imageFiles',
        formValue?.imageFiles.filter((image) => image !== file),
      );
    },
    [formValue.imageFiles, setValue],
  );

  const renderUpdateImageContainer = ({
    open,
    disabled,
  }: {
    open: () => void;
    disabled: boolean;
  }) => <UploadImageCard open={open} disabled={disabled} />;

  const onSubmit = (data: EditLocationFormType) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
    showSuccess('Create the location edit request successfully!');
  };

  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        Create Location Editing Request
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'white',
          p: 4,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">Location</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <FormLabel htmlFor="lat">ID</FormLabel>
            <ReadOnlyTextField value={location?.id} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Address</FormLabel>
            <ReadOnlyTextField value={location?.address} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">District</FormLabel>
            <ReadOnlyTextField value={location?.commue} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Ward</FormLabel>
            <ReadOnlyTextField value={location?.ward} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Latitude</FormLabel>
            <ReadOnlyTextField value={location?.lat} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Longtitude</FormLabel>
            <ReadOnlyTextField value={location?.long} disabled />
          </FormControl>
        </Stack>

        <Typography variant="h6">Classification</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth error={!!formError.positionType}>
            <FormLabel htmlFor="reportType">Position type</FormLabel>
            <Select
              id="positionType"
              {...register('positionType')}
              aria-describedby="positionType-helper-text"
              defaultValue={location?.positionType}
            >
              {PositionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="positionType-helper-text">
              {formError.positionType?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!formError.adsType}>
            <FormLabel htmlFor="adsType">Advertising type</FormLabel>
            <Select
              id="adsType"
              {...register('adsType')}
              aria-describedby="adsType-helper-text"
              defaultValue={location?.adsType}
            >
              {AdsTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="adsType-helper-text">
              {formError.adsType?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <FormControl>
          <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {formValue.imageFiles.map((image, index) => (
              <ImagePreview
                key={index}
                image={image}
                disabled={submitting}
                onDeleteImage={handleDeleteImage}
              />
            ))}
            {formValue.imageFiles.length < 1 && (
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
      </Box>
    </Box>
  );
}
