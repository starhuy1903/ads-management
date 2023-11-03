import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { ReactNode } from 'react';

export type StatusProps = {
  status?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

export default function Status({
  status,
  title,
  description,
  children,
}: StatusProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        {status === 'success' && (
          <CheckCircleOutlineIcon sx={{ color: '#79AC78', fontSize: 80 }} />
        )}
        {status === 'error' && (
          <HighlightOffIcon sx={{ color: '#F87171', fontSize: 80 }} />
        )}

        <h1 className="text-3xl font-bold text-[#101828] mt-4 mb-2">{title}</h1>
        <span>{description}</span>
      </div>

      {children}
    </div>
  );
}
