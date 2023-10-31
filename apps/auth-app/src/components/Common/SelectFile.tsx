import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ImageIcon from '@mui/icons-material/Image';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
} from '@mui/material';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { ImageFileConfig } from '@/constants/validation';
import DropFileContainer from './DropFileContainer';

function SelectFile({
  file,
  setFile,
  disabled = false,
}: {
  file: File | null;
  setFile: (value: File | null) => void;
  disabled?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const hasFile = !!file;

  const onRemoveFile = useCallback(() => {
    if (!disabled) {
      setFile(null);
    }
  }, [setFile, disabled]);

  useEffect(() => {
    if (disabled) {
      setError(null);
    }
  }, [disabled]);

  const renderChildren = ({
    open,
    disabled,
  }: {
    open: () => void;
    disabled: boolean;
  }) => (
    <Stack
      spacing={2}
      sx={{
        borderRadius: 2,
        minHeight: 194,
        borderColor: hasFile ? '#22A861' : '#C1C7D0',
        borderWidth: hasFile ? 2 : 1,
        position: 'relative',
      }}
      alignItems="center"
      justifyContent="center"
      className={clsx(
        hasFile ? 'u-border' : !disabled && 'u-borderDashed',
        disabled && 'u-opacityHalf u-backgroundNeutral20',
      )}
    >
      {/* Empty file */}
      {!hasFile && (
        <>
          <ImageIcon fontSize="large" color="primary" />
          <div>Drop your image here</div>
          <div>Or</div>
          <Button
            size="small"
            component="label"
            onClick={open}
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={disabled}
          >
            Select an image...
          </Button>
        </>
      )}
      {/* Currently selected file */}
      {hasFile && (
        <>
          <HighlightOffIcon
            sx={{ position: 'absolute', top: 11, right: 11, cursor: 'pointer' }}
            onClick={onRemoveFile}
          />
          <Stack alignItems="center" sx={{ width: 300 }}>
            <ImageIcon color="success" />
            <span>{file.name}</span>
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <FormControl sx={{ width: '100%' }} error={!!error}>
      <FormLabel>Image</FormLabel>
      <DropFileContainer
        onDropFile={setFile}
        onRejectFile={setError}
        acceptMIMETypes={ImageFileConfig.ACCEPTED_MINE_TYPES}
        renderChildren={renderChildren}
        disabled={disabled}
        maxSize={ImageFileConfig.MAX_SIZE}
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}

export default SelectFile;
