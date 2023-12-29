import { DevTool } from '@hookform/devtools';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Controller,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';
import { configs } from '@/configurations';
import { useAppDispatch } from '@/store';
import CenterLoading from '@/components/Common/CenterLoading';
import DropFileContainer from '@/components/Common/DropFileContainer';
import TinyEditor from '@/components/Common/TinyEditor';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import {
  useCreateReportMutation,
  useGetReportTypesQuery,
} from '@/store/api/reportApiSlice';
import { showModal } from '@/store/slice/modal';
import { ReportPayload } from '@/types/report';
import ImagePreview from './ImagePreview';
import UploadImageCard from './UploadImageCard';

export default function CitizenReport() {
  const dispatch = useAppDispatch();
  const [createReport, { isLoading }] = useCreateReportMutation();
  const { data: reportTypesRes, isSuccess: hasReportTypesData } =
    useGetReportTypesQuery();
  const reportTypes = reportTypesRes?.data;

  const { handleSubmit, register, control, formState, setValue, watch } =
    useForm<ReportPayload>({
      mode: 'onChange',
      defaultValues: {
        fullName: '',
        email: '',
        phoneNumber: '',
        imageFiles: [],
        captcha: '',
      },
    });
  const { errors: formError } = formState;
  const formValue = watch();

  const {
    field: { value: descValue, onChange: onChangeDesc },
  } = useController({
    control,
    name: 'description',
    rules: {
      maxLength: {
        value: 5000,
        message: 'Description can not exceed 5000 characters.',
      },
    },
    defaultValue: '',
  });

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
        formValue.imageFiles.filter((image) => image !== file),
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

  const onSubmit: SubmitHandler<ReportPayload> = async (data) => {
    console.log(data);
    const res = await createReport(data).unwrap();
  };

  if (!hasReportTypesData || !reportTypes) {
    return <CenterLoading />;
  }

  return (
    <Container maxWidth="xl" sx={{ marginY: 8 }}>
      <Typography
        variant="h3"
        noWrap
        component="h3"
        sx={{
          display: 'flex',
          fontWeight: 700,
        }}
      >
        Send Report
      </Typography>
      <Box
        component="form"
        autoComplete="off"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
      >
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth error={!!formError.fullName}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <TextField
              {...register('fullName', {
                required: 'The full name is required.',
              })}
              required
              id="fullName"
              placeholder="Nguyen Van A"
              error={!!formError.fullName}
              aria-describedby="fullName-helper-text"
            />
            <FormHelperText id="fullName-helper-text">
              {formError.fullName?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!formError.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              {...register('email', {
                required: 'The email is required.',
              })}
              id="email"
              placeholder="example@gmail.com"
              error={!!formError.email}
              aria-describedby="email-helper-text"
            />
            <FormHelperText id="email-helper-text">
              {formError.email?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth error={!!formError.phoneNumber}>
            <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
            <TextField
              {...register('phoneNumber', {
                required: 'The phone number is required.',
              })}
              id="phoneNumber"
              placeholder="0999999999"
              error={!!formError.phoneNumber}
              aria-describedby="phoneNumber-helper-text"
            />
            <FormHelperText id="phoneNumber-helper-text">
              {formError.phoneNumber?.message}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth error={!!formError.reportType}>
            <FormLabel htmlFor="reportType">Report Type</FormLabel>
            <Controller
              control={control}
              name="reportType"
              defaultValue={reportTypes[0].id}
              rules={{ required: 'Please select a report type.' }}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value}
                  id="reportType"
                  onChange={onChange}
                  aria-describedby="reportType-helper-text"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText id="reportType-helper-text">
              {formError.reportType?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <FormControl fullWidth>
          <FormLabel>Description</FormLabel>
          <TinyEditor
            value={descValue}
            onChange={onChangeDesc}
            disabled={isLoading}
            height={400}
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ mb: 1 }}>Upload image</FormLabel>
          <Stack direction="row" spacing={2}>
            {formValue.imageFiles.map((image, index) => (
              <ImagePreview
                key={index}
                image={image}
                disabled={isLoading}
                onDeleteImage={handleDeleteImage}
              />
            ))}
            {formValue.imageFiles.length < 2 && (
              <DropFileContainer
                onDropFile={handleUpdateImage}
                acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
                renderChildren={renderUpdateImageContainer}
                disabled={isLoading}
                maxSize={ImageFileConfig.MAX_SIZE}
              />
            )}
          </Stack>
        </FormControl>
        <Controller
          control={control}
          name="captcha"
          rules={{ required: 'The captcha is required.' }}
          render={({ field: { onChange } }) => (
            <ReCAPTCHA sitekey={configs.reCAPTCHASiteKey} onChange={onChange} />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          sx={{ mt: 4 }}
        >
          Send
        </Button>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Box>
    </Container>
  );
}
