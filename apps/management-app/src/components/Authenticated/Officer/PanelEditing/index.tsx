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
  useCreateUpdatePanelRequestMutation,
  useGetPanelByIdQuery,
  useGetPanelTypesOfficerQuery,
} from '@/store/api/officerApiSlice';
import { showModal } from '@/store/slice/modal';
import { Panel, PanelType, UpdatePanelDto } from '@/types/officer-management';

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

export default function PanelEditing() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { panelId } = useParams<{ panelId: string }>();

  const userId = useAppSelector((state) => state?.user?.profile?.id);

  const [panel, setPanel] = useState<Panel | undefined>(undefined);
  const [panelTypes, setPanelTypes] = useState<PanelType[]>([]);

  const { data: panelData, isLoading: panelLoading } = useGetPanelByIdQuery(
    panelId!,
  );
  const { data: panelTypeData, isLoading: panelTypeLoading } =
    useGetPanelTypesOfficerQuery({});

  const { handleSubmit, register, control, formState, setValue, watch, reset } =
    useForm<UpdatePanelDto>({
      mode: 'onChange',
    });

  useEffect(() => {
    if (panelData && panelTypeData && userId) {
      setPanel(panelData?.data);
      setPanelTypes(panelTypeData?.data);

      reset({
        belongPanelId: panelData?.data?.id,
        locationId: panelData?.data?.location?.id,
        userId: userId,
        typeId: panelData?.data?.type?.id,
        images: [],
        width: panelData?.data?.width,
        height: panelData?.data?.height,
        createContractDate: panelData?.data?.createContractDate,
        expiredContractDate: panelData?.data?.expiredContractDate,
        companyEmail: panelData?.data?.companyEmail,
        companyNumber: panelData?.data?.companyNumber,
        reason: '',
      });
    }
  }, [panelData, panelTypeData, reset, userId]);

  useEffect(() => {
    if (panel?.imageUrls) {
      fetch(panel?.imageUrls[0])
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], panel?.imageUrls[0]);
          setValue('images', [file]);
        });
    }
  }, [panel?.imageUrls, setValue]);

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

  const [updatePanel] = useCreateUpdatePanelRequestMutation();

  const onSubmit = async (data: UpdatePanelDto) => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('belongPanelId', data.belongPanelId.toString());
      formData.append('locationId', data.locationId.toString());
      formData.append('userId', data.userId.toString());
      formData.append('typeId', data.typeId.toString());
      data.images.forEach((image) => formData.append('images', image));
      formData.append('reason', data.reason);
      formData.append('width', data.width.toString());
      formData.append('height', data.height.toString());
      data.createContractDate = new Date(data.createContractDate).toISOString();
      data.expiredContractDate = new Date(
        data.expiredContractDate,
      ).toISOString();
      formData.append('createContractDate', data.createContractDate);
      formData.append('expiredContractDate', data.expiredContractDate);
      formData.append('companyEmail', data.companyEmail);
      formData.append('companyNumber', data.companyNumber);

      await updatePanel(formData).unwrap();

      setSubmitting(false);

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  if (panelLoading || panelTypeLoading || !panel || !panelTypes) {
    return <CenterLoading />;
  }

  return (
    <DetailWrapper label="Create Panel Editing Request">
      <Typography variant="h6">Location</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm
          field="fullAddress"
          label="Address"
          value={panel?.location?.fullAddress ?? ''}
        />

        <ReadOnlyTextForm
          field="ward"
          label="Ward"
          value={panel?.location?.ward?.name ?? ''}
        />

        <ReadOnlyTextForm
          field="district"
          label="District"
          value={panel?.location?.district?.name ?? ''}
        />

        <ReadOnlyTextForm
          field="type"
          label="Type"
          value={panel?.location?.type?.name ?? ''}
        />

        <ReadOnlyTextForm
          field="adType"
          label="Advertising Type"
          value={panel?.location?.adType?.name ?? ''}
        />
      </Stack>

      <Typography variant="h6">Panel</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <ReadOnlyTextForm field="id" label="ID" value={panel?.id ?? ''} />

        <FormControl fullWidth error={!!formError.typeId}>
          <FormLabel htmlFor="typeId">Type</FormLabel>
          <Select
            id="typeId"
            {...register('typeId')}
            aria-describedby="typeId-helper-text"
            defaultValue={panel?.type?.id}
          >
            {panelTypes.map((type) => (
              <MenuItem key={type?.id} value={type?.id}>
                {type?.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="panelType-helper-text">
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
            value={formValue.createContractDate}
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
    </DetailWrapper>
  );
}
