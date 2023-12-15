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
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store';
import { BackButton } from '@/components/Common/Buttons';
import { DetailTextField } from '@/components/Common/DetailTextField';
import DropFileContainer from '@/components/Common/DropFileContainer';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { showModal } from '@/store/slice/modal';
import { AdsLocationResponse } from '@/types/form';
import { showSuccess } from '@/utils/toast';

const PanelTypes = [
  {
    id: 1,
    value: 'Trụ bảng hiflex',
  },
  {
    id: 2,
    value: 'Trụ màn hình điện tử LED',
  },
  {
    id: 3,
    value: 'Trụ hộp đèn',
  },
  {
    id: 4,
    value: 'Bảng hiflex ốp tường',
  },
  {
    id: 5,
    value: 'Màn hình điện tử ốp tường',
  },
  {
    id: 6,
    value: 'Trụ treo băng rôn dọc',
  },
  {
    id: 7,
    value: 'Trụ treo băng rôn ngang',
  },
  {
    id: 8,
    value: 'Trụ/Cụm pano',
  },
  {
    id: 9,
    value: 'Cổng chào',
  },
  {
    id: 10,
    value: 'Trung tâm thương mại',
  },
];

const rows: AdsLocationResponse[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
  {
    id: 4,
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
  },
  {
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
  },
];

interface PermissionFormType {
  type: number;
  reason: string;
  panelType: string;
  locationId: number;
  width: number;
  height: number;
  quantity: number;
  imageFiles: File[];
  companyEmail: string;
  companyPhone: string;
  createdContractDate: Date;
  expiredContractDate: Date;
}

export default function CreateAdsPermission() {
  const dispatch = useAppDispatch();

  const { handleSubmit, register, control, formState, setValue, watch } =
    useForm<PermissionFormType>({
      mode: 'onChange',
      defaultValues: {
        type: 1,
        reason: '',
        panelType: '',
        locationId: 1,
        width: 0,
        height: 0,
        quantity: 0,
        imageFiles: [],
        companyEmail: '',
        companyPhone: '',
        createdContractDate: new Date(),
        expiredContractDate: new Date(),
      },
    });

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

  const onSubmit = (data: PermissionFormType) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
    showSuccess('Create request successfully!');
  };

  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        Create Panel Licensing Request
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6">Choose location</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth error={!!formError.locationId}>
              <FormLabel htmlFor="locationId">Location</FormLabel>
              <Select
                id="locationId"
                {...register('locationId')}
                aria-describedby="locationId-helper-text"
              >
                {rows.map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {row.address}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText id="locationId-helper-text">
                {formError.locationId?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="ward">Ward</FormLabel>
              <DetailTextField
                value={
                  rows.find((row) => row.id === formValue.locationId)?.ward
                }
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="district">District</FormLabel>
              <DetailTextField
                value={
                  rows.find((row) => row.id === formValue.locationId)?.commue
                }
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="lat">Latitude</FormLabel>
              <DetailTextField
                value={rows.find((row) => row.id === formValue.locationId)?.lat}
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="long">Longtitude</FormLabel>
              <DetailTextField
                value={
                  rows.find((row) => row.id === formValue.locationId)?.long
                }
                disabled
              />
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="positionType">Position type</FormLabel>
              <DetailTextField
                value={
                  rows.find((row) => row.id === formValue.locationId)
                    ?.positionType
                }
                disabled
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel htmlFor="adsType">Ads type</FormLabel>
              <DetailTextField
                value={
                  rows.find((row) => row.id === formValue.locationId)?.adsType
                }
                disabled
              />
            </FormControl>
          </Stack>
        </Box>

        <Typography variant="h6">Panel</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth error={!!formError.panelType}>
            <FormLabel htmlFor="reportType">Panel type</FormLabel>
            <Select
              id="panelType"
              {...register('panelType')}
              aria-describedby="panelType-helper-text"
            >
              {PanelTypes.map((type) => (
                <MenuItem key={type.id} value={type.value}>
                  {type.value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="panelType-helper-text">
              {formError.panelType?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!formError.height}>
            <FormLabel htmlFor="height">Height</FormLabel>
            <TextField
              type="number"
              {...register('height', {
                required: 'The height is required.',
                validate: (value) => {
                  if (value < 1) {
                    return 'The height must be greater than 0.';
                  }
                  return true;
                },
              })}
              id="height"
              error={!!formError.height}
              aria-describedby="height-helper-text"
            />
            <FormHelperText id="height-helper-text">
              {formError.height?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!formError.width}>
            <FormLabel htmlFor="width">Width</FormLabel>
            <TextField
              type="number"
              {...register('width', {
                required: 'The width is required.',
                validate: (value) => {
                  if (value < 1) {
                    return 'The width must be greater than 0.';
                  }
                  return true;
                },
              })}
              id="width"
              error={!!formError.width}
              aria-describedby="width-helper-text"
            />
            <FormHelperText id="width-helper-text">
              {formError.width?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!formError.quantity}>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <TextField
              type="number"
              {...register('quantity', {
                required: 'The quantity is required.',
                validate: (value) => {
                  if (value < 1) {
                    return 'The quantity must be greater than 0.';
                  } else if (value > 3) {
                    return 'The quantity must be less than 3.';
                  }
                  return true;
                },
              })}
              id="quantity"
              error={!!formError.quantity}
              aria-describedby="quantity-helper-text"
            />
            <FormHelperText id="quantity-helper-text">
              {formError.quantity?.message}
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
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

            <FormControl fullWidth error={!!formError.companyPhone}>
              <FormLabel htmlFor="companyPhone">Phone</FormLabel>
              <TextField
                {...register('companyPhone', {
                  required: 'The company phone is required.',
                })}
                id="companyPhone"
                placeholder="0123456789"
                error={!!formError.companyPhone}
                aria-describedby="companyPhone-helper-text"
              />
              <FormHelperText id="companyPhone-helper-text">
                {formError.companyPhone?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!formError.createdContractDate}>
              <FormLabel htmlFor="createdContractDate">
                Created contract date
              </FormLabel>
              <TextField
                type="date"
                {...register('createdContractDate', {
                  required: 'The created contract date is required.',
                })}
                id="createdContractDate"
                error={!!formError.createdContractDate}
                aria-describedby="createdContractDate-helper-text"
              />
              <FormHelperText id="createdContractDate-helper-text">
                {formError.createdContractDate?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!formError.expiredContractDate}>
              <FormLabel htmlFor="expiredContractDate">
                Expired contract date
              </FormLabel>
              <TextField
                type="date"
                {...register('expiredContractDate', {
                  required: 'The expired contract date is required.',
                  validate: (value) => {
                    if (value < formValue.createdContractDate) {
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
        </Box>

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
