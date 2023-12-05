import { Button } from '@mui/material';

interface UploadImageCardProps {
  open: () => void;
  disabled?: boolean;
}

export default function UploadImageCard({
  open,
  disabled,
}: UploadImageCardProps) {
  return (
    <div>
      <Button disabled={disabled} onClick={open}>
        Browse image
      </Button>
    </div>
  );
}
