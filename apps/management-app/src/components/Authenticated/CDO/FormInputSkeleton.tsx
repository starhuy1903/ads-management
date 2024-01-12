import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Skeleton from '@mui/material/Skeleton';

interface FormInputSkeletonProps {
  label: string;
  reserveHelperTextSpace?: boolean;
}

const FormInputSkeleton = ({
  label,
  reserveHelperTextSpace = false,
}: FormInputSkeletonProps) => {
  return (
    <FormControl
      sx={{ width: '100%', paddingBottom: reserveHelperTextSpace ? '23px' : 0 }}
    >
      <FormLabel>{label}</FormLabel>
      <Skeleton
        variant="rounded"
        sx={{ width: '100%', height: 'calc(23px + 16.5px * 2)' }}
      />
    </FormControl>
  );
};

export default FormInputSkeleton;
