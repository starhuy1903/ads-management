import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@/store';
import DropFileContainer from '@/components/Common/DropFileContainer';
import { ModalKey } from '@/constants/modal';
import { ImageFileConfig } from '@/constants/validation';
import { showModal } from '@/store/slice/modal';
import UploadImageCard from './UploadImageCard';

const ReportTypes = [
  'Tố giác sai phạm',
  'Đăng ký nội dung',
  'Đóng góp ý kiến',
  'Giải đáp thắc mắc',
];

interface FormType {
  name: string;
  email: string;
  phoneNumber: string;
  reportType: string;
  description: string;
  images: File[];
}

export default function CitizenReport() {
  const editorRef = useRef<Editor>(null);
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm<FormType>();

  const [submitting, setSubmitting] = useState(false);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
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
      <Box component="form" autoComplete="off">
        <Stack direction="row" spacing={2}>
          <TextField
            required
            id="outlined-required"
            label="Full Name"
            placeholder="Nguyen Van A"
          />
          <TextField
            required
            id="outlined-required"
            label="Email"
            placeholder="example@gmail.com"
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            required
            id="outlined-required"
            label="Phone Number"
            placeholder="09999999"
          />
          <FormControl>
            <InputLabel id="demo-simple-select-label">Report Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              // value={age}
              label="Report Type"
              // onChange={handleChange}
            >
              {ReportTypes.map((type) => (
                <MenuItem>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Editor
          apiKey="kulkkatvrqim8ho9lhxqo5d0l4u80m68n44pbjphhlyzsy8n"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          init={{
            height: 600,
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
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
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
          onClick={() => handleSubmit(onSubmit)()}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
}
