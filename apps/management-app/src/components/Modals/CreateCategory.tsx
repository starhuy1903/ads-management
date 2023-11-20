import { DevTool } from '@hookform/devtools';
import { Box, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import SelectFile from '../Common/SelectFile';
import GeneralModal from './GeneralModal';

interface CreateCategoryProps {
  onModalClose: () => void;
}

interface FormDataType {
  title: string;
  description: string;
  file: File | null;
}

function CreateCategory({ onModalClose }: CreateCategoryProps) {
  const { register, handleSubmit, control, formState, setValue, watch } =
    useForm<FormDataType>({
      mode: 'onChange',
      defaultValues: {
        title: '',
        description: '',
        file: null,
      },
    });
  const { errors } = formState;
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (data: FormDataType) => {
    setSubmitting(true);
    console.log('submit data ', data);
    setSubmitting(false);
    onModalClose();
  };

  const body = (
    <Box component="form" autoComplete="off">
      <Stack spacing={2}>
        <TextField
          label="Title"
          {...register('title', {
            required: 'Title is required',
          })}
          disabled={submitting}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
        />
        <TextField
          label="Description"
          {...register('description', {
            required: 'Description is required',
          })}
          disabled={submitting}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
          multiline
          rows={3}
        />
        <SelectFile
          file={watch('file')}
          setFile={(file) => setValue('file', file)}
          disabled={submitting}
        />
      </Stack>
      <DevTool control={control} />
    </Box>
  );

  return (
    <GeneralModal
      headerText="Create Category"
      onModalClose={onModalClose}
      body={body}
      primaryButtonText="Create"
      onClickPrimaryButton={() => handleSubmit(onSubmit)()}
      disabledPrimaryButton={false}
    />
  );
}

export default CreateCategory;
