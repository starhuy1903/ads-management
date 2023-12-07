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
import { Editor } from '@tinymce/tinymce-react';
import { useCallback, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Editor as TinyMCEEditor } from 'tinymce';
import { useAppDispatch } from '@/store';
import DropFileContainer from '@/components/Common/DropFileContainer';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { showModal } from '@/store/slice/modal';
import UploadImageCard from './UploadImageCard';

const ReportTypes = [
  {
    id: 1,
    value: 'Tố giác sai phạm',
  },
  {
    id: 2,
    value: 'Đăng ký nội dung',
  },
  {
    id: 3,
    value: 'Đóng góp ý kiến',
  },
  {
    id: 4,
    value: 'Giải đáp thắc mắc',
  },
];

interface FormType {
  fullName: string;
  email: string;
  phoneNumber: string;
  reportType: string;
  description: string;
  images: File[];
}

export default function CitizenReport() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [editorMounted, setEditorMounted] = useState(false);
  const dispatch = useAppDispatch();

  const { handleSubmit, register, control, formState } = useForm<FormType>({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      reportType: '',
      description: '',
      images: [],
    },
  });
  const { errors: formError } = formState;

  const {
    field: { value: descValue, onChange: onChangeDesc },
  } = useController({
    control,
    name: 'description',
    rules: {
      maxLength: {
        value: 255,
        message: 'Course name can not exceed 255 characters.',
      },
    },
    defaultValue: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleEditorChange = (a: string, _: TinyMCEEditor) => {
    onChangeDesc(a);
  };

  const handleUpdateImage = useCallback(
    (file: File | null) => {
      if (!file) {
        return;
      }

      dispatch(
        showModal(ModalKey.CROP_IMAGE, {
          image: file,
          onSubmit: () => {},
          onModalClose: () => {},
        }),
      );
    },
    [dispatch],
  );

  const renderUpdateImageContainer = ({
    open,
    disabled,
  }: {
    open: () => void;
    disabled: boolean;
  }) => <UploadImageCard open={open} disabled={disabled} />;

  const onSubmit = (data: FormType) => {
    setSubmitting(true);
    console.log(data);
    setSubmitting(false);
  };

  return (
    <Container maxWidth="xl">
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
            <Select
              id="reportType"
              {...register('reportType')}
              aria-describedby="reportType-helper-text"
            >
              {ReportTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText id="reportType-helper-text">
              {formError.reportType?.message}
            </FormHelperText>
          </FormControl>
        </Stack>
        <FormControl fullWidth>
          <FormLabel>Description</FormLabel>
          <Box minHeight={400}>
            <Editor
              id="report-description-editor"
              apiKey="kulkkatvrqim8ho9lhxqo5d0l4u80m68n44pbjphhlyzsy8n" // TODO: get from env
              onInit={(evt, editor) => {
                editorRef.current = editor;
                setEditorMounted(true);
              }}
              initialValue=""
              onEditorChange={handleEditorChange}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:"Roboto","Helvetica","Arial",sans-serif; font-size:14px }',
              }}
              disabled={submitting}
            />
            {!editorMounted && <Box>Loading...</Box>}
          </Box>
        </FormControl>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <DropFileContainer
            onDropFile={handleUpdateImage}
            onRejectFile={() => {}}
            acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
            renderChildren={renderUpdateImageContainer}
            disabled={submitting}
            maxSize={ImageFileConfig.MAX_SIZE}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          disabled={submitting}
          onClick={handleSubmit(onSubmit)}
        >
          Send
        </Button>
        <DevTool control={control} /> {/* set up the dev tool */}
      </Box>
    </Container>
  );
}