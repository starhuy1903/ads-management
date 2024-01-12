import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoIcon from '@mui/icons-material/Info';
import MailIcon from '@mui/icons-material/Mail';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';

export const Info = ({
  link,
  title = 'Detail',
}: {
  link: string;
  title?: string;
}) => {
  return (
    <Tooltip title={title}>
      <Link to={link}>
        <InfoIcon
          sx={{
            cursor: 'pointer',
            color: '#14B8A6',
          }}
        />
      </Link>
    </Tooltip>
  );
};

export const Edit = ({
  link,
  title = 'Edit',
}: {
  link: string;
  title?: string;
}) => {
  return (
    <Tooltip title={title}>
      <Link to={link}>
        <EditNoteIcon
          sx={{
            cursor: 'pointer',
            color: '#0174BE',
          }}
        />
      </Link>
    </Tooltip>
  );
};

export const Delete = ({
  onClick,
  title = 'Delete',
}: {
  onClick: () => void;
  title?: string;
}) => {
  return (
    <Tooltip title={title}>
      <DeleteIcon
        sx={{
          cursor: 'pointer',
          color: '#FF2E63',
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export const Cancel = ({
  onClick,
  title = 'Cancel',
}: {
  onClick: () => void;
  title?: string;
}) => {
  return (
    <Tooltip title={title}>
      <DoDisturbOnIcon
        sx={{
          cursor: 'pointer',
          color: '#F38181',
        }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export const Response = ({
  link,
  title = 'Respond',
}: {
  link: string;
  title?: string;
}) => {
  return (
    <Tooltip title={title}>
      <Link to={link}>
        <MailIcon
          sx={{
            cursor: 'pointer',
            color: '#FFA732',
          }}
        />
      </Link>
    </Tooltip>
  );
};
