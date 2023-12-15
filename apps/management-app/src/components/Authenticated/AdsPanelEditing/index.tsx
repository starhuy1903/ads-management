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
import { ReadOnlyTextField } from '@/components/Common/ReadOnlyTextField';
import ImagePreview from '@/components/Unauthenticated/Citizen/CitizenReport/ImagePreview';
import UploadImageCard from '@/components/Unauthenticated/Citizen/CitizenReport/UploadImageCard';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { showModal } from '@/store/slice/modal';
import { AdsPanelResponse } from '@/types/form';
import { showSuccess } from '@/utils/toast';

interface EditPanelFormType {
  panelType: string;
  width: number;
  height: number;
  quantity: number;
  imageFiles: File[];
  companyEmail: string;
  companyPhone: string;
  createdContractDate: string;
  expiredContractDate: string;
  reason: string;
}

const PanelTypes = [
  'Hiflex table pillar',
  'LED electronic screen pillar',
  'Light box pillar',
  'Hiflex wall panels',
  'Wall mounted electronic screen',
  'Vertical banner hanger',
  'Horizontal banner hanger',
  'Pillar/Panel cluster',
  'Welcome gate',
  'Shopping mall',
];

const panel: AdsPanelResponse = {
  id: 3,
  panelType: 'Pillar/Panel cluster',
  location: {
    id: 1,
    address: 'Dong Khoi - Nguyen Du (Department of Culture and Sports)',
    ward: 'Ben Nghe',
    commue: '1',
    positionType: 'Public land/Park/Traffic safety corridor',
    adsType: 'Commercial advertising',
  },
  width: 2.5,
  height: 10,
  quantity: 1,
  imageUrl:
    'https://cdn.tuoitrethudo.com.vn/stores/news_dataimages/ngovuongtuan/122021/06/14/711e32670b0f625bf1252c028017da66.png?rt=20211206144254',
  company: {
    email: 'shopee@gmail.com',
    phone: '0123456789',
    createdContractDate: '2023-12-01',
    expiredContractDate: '2024-01-01',
  },
  createdTime: '2023-12-08T11:30:53.945Z',
  modifiedTime: '2023-12-08T11:30:53.945Z',
};

export default function AdsPanelEditing() {
  const dispatch = useAppDispatch();

  const { handleSubmit, register, control, formState, setValue, watch } =
    useForm<EditPanelFormType>({
      mode: 'onChange',
      defaultValues: {
        panelType: panel?.panelType,
        width: panel?.width,
        height: panel?.height,
        quantity: panel?.quantity,
        imageFiles: [],
        companyEmail: panel?.company.email,
        companyPhone: panel?.company.phone,
        createdContractDate: panel?.company.createdContractDate,
        expiredContractDate: panel?.company.expiredContractDate,
        reason: '',
      },
    });

  useEffect(() => {
    // Fetch image and convert it to File
    fetch(panel?.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], panel?.imageUrl);
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

  const onSubmit = (data: EditPanelFormType) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
    showSuccess('Create the panel edit request successfully!');
  };

  return (
    <Box>
      <BackButton />
      <Typography variant="h4" sx={{ my: 2 }}>
        Create Panel Editing Request
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
            <FormLabel htmlFor="lat">Address</FormLabel>
            <ReadOnlyTextField value={panel?.location?.address} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">District</FormLabel>
            <ReadOnlyTextField value={panel?.location?.commue} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Ward</FormLabel>
            <ReadOnlyTextField value={panel?.location?.ward} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Position type</FormLabel>
            <ReadOnlyTextField value={panel?.location?.positionType} disabled />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel htmlFor="lat">Advertising type</FormLabel>
            <ReadOnlyTextField value={panel?.location?.adsType} disabled />
          </FormControl>
        </Stack>

        <Typography variant="h6">Panel</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <FormLabel htmlFor="lat">ID</FormLabel>
            <ReadOnlyTextField value={panel?.id} disabled />
          </FormControl>

          <FormControl fullWidth error={!!formError.panelType}>
            <FormLabel htmlFor="reportType">Panel type</FormLabel>
            <Select
              id="panelType"
              {...register('panelType')}
              aria-describedby="panelType-helper-text"
              defaultValue={panel.panelType}
            >
              {PanelTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="panelType-helper-text">
              {formError.panelType?.message}
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

          <FormControl fullWidth error={!!formError.quantity}>
            <FormLabel htmlFor="quantity">Quantity</FormLabel>
            <TextField
              type="number"
              {...register('quantity', {
                required: 'The quantity is required.',
              })}
              id="quantity"
              error={!!formError.quantity}
              aria-describedby="quantity-helper-text"
              inputProps={{ min: 1, max: 3 }}
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
              value={formValue.createdContractDate}
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
              value={formValue.expiredContractDate}
              id="expiredContractDate"
              error={!!formError.expiredContractDate}
              aria-describedby="expiredContractDate-helper-text"
            />
            <FormHelperText id="expiredContractDate-helper-text">
              {formError.expiredContractDate?.message}
            </FormHelperText>
          </FormControl>
        </Stack>

        <Typography variant="h6">Update reason</Typography>
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
