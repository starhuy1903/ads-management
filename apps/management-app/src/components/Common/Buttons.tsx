import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      startIcon={<ChevronLeftIcon />}
      sx={{
        borderRadius: '20px',
      }}
      onClick={() => navigate(-1)}
    >
      Back
    </Button>
  );
};
