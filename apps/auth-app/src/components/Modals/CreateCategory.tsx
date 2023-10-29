import { DevTool } from '@hookform/devtools';
import { Box, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import GeneralModal from './GeneralModal';

interface CreateCategoryProps {
  onModalClose: () => void;
}

interface FormDataType {
  title: string;
  description: string;
}

function CreateCategory({ onModalClose }: CreateCategoryProps) {
  const { register, handleSubmit, control, formState } = useForm<FormDataType>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const { errors } = formState;
  const [submitting, setSubmitting] = useState(false);

  console.log({ errors });

  const onSubmit = (data: FormDataType) => {
    setSubmitting(true);

    setSubmitting(false);
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
      onClickPrimaryButton={() => {
        console.log('Created');
      }}
      disabledPrimaryButton={false}
    />
  );
}

export default CreateCategory;
