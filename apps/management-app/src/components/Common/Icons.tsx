import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

export const Info = ({ link }: { link: string }) => {
  return (
    <Link to={link}>
      <InfoIcon
        sx={{
          cursor: 'pointer',
          color: '#14B8A6',
        }}
      />
    </Link>
  );
};

export const Edit = ({ link }: { link: string }) => {
  return (
    <Link to={link}>
      <EditNoteIcon
        sx={{
          cursor: 'pointer',
          color: '#0174BE',
        }}
      />
    </Link>
  );
};

export const Delete = ({ onClick }: { onClick: () => void }) => {
  return (
    <DeleteIcon
      sx={{
        cursor: 'pointer',
        color: '#FF2E63',
      }}
      onClick={onClick}
    />
  );
};
