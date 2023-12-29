import DeleteIcon from '@mui/icons-material/Delete';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

const DeleteIconButton = ({ sx, ...rest }: IconButtonProps) => {
  return (
    <IconButton
      sx={{
        ...sx,
        transition: 'all 0.5s ease',

        '&:hover': {
          color: 'common.white',
          backgroundColor: 'error.main',
        },
      }}
      {...rest}
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default DeleteIconButton;
