import {
  FormControl,
  FormLabel,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { configs } from '@/configurations';

export function ReadOnlyTextField({
  label = '',
  value = '',
  disabled,
}: {
  label?: string;
  value?: string | number;
  disabled?: boolean;
}) {
  return (
    <TextField
      label={label}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
      value={value}
      disabled={disabled}
    />
  );
}

export function ReadOnlyTextForm({
  label = '',
  field = '',
  value = '',
}: {
  label: string;
  field: string;
  value: string | number;
}) {
  return (
    <FormControl fullWidth>
      <FormLabel htmlFor={field}>{label}</FormLabel>
      <ReadOnlyTextField value={value} disabled />
    </FormControl>
  );
}

export function ReadOnlyTinyEditor({
  label = '',
  value = '',
}: {
  label?: string;
  value?: string;
}) {
  return (
    <>
      <Typography variant="h6">{label}</Typography>
      <Editor
        id="content"
        apiKey={configs.tinyMceEditor}
        value={value}
        init={{
          height: 200,
          menubar: false,
          toolbar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          content_style:
            'body { font-family:"Roboto","Helvetica","Arial",sans-serif; font-size:14px }',
        }}
        disabled
      />
    </>
  );
}

export function ImageListField({
  label = 'Image',
  images,
}: {
  label?: string;
  images: string[] | undefined;
}) {
  return (
    <>
      <Typography variant="h6">{label}</Typography>
      {images && images.length !== 0 ? (
        <ImageList sx={{ width: '70%' }} cols={2}>
          {images.map((item) => (
            <ImageListItem key={item}>
              <img src={item} alt="location" loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography
          variant="body1"
          sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}
        >
          No image.
        </Typography>
      )}
    </>
  );
}
