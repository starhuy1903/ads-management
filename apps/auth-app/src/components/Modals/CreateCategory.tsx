import { Box, TextField } from '@mui/material';
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
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormDataType>({
    defaultValues: {
      title: '',
      description: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);

  console.log({ errors });

  const body = (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Title"
        {...register('title', {
          minLength: 3,
          maxLength: 255,
        })}
        disabled={submitting}
        helperText={errors.title?.message as string}
        fullWidth
      />
      <TextField
        label="Description"
        {...register('description', {
          minLength: 40,
          maxLength: 2000,
        })}
        disabled={submitting}
        helperText={errors.description?.message as string}
        fullWidth
        multiline
        rows={3}
      />
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
