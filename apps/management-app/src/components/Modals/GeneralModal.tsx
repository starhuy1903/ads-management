import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
} from '@mui/material';

export enum FooterType {
  SINGLE = 'single',
  DOUBLE = 'double',
  NONE = 'none',
}

interface GeneralModalProps {
  id?: string;
  headerText: string;
  onModalClose: () => void;
  body?: React.ReactNode;
  primaryButtonText?: string;
  onClickPrimaryButton?: () => void;
  disabledPrimaryButton?: boolean;
  secondaryButtonText?: string;
  onClickSecondaryButton?: () => void;
  disabledSecondaryButton?: boolean;
  size?: DialogProps['maxWidth'];
  footer?: React.ReactNode;
  showFooter?: boolean;
  footerType?: FooterType;
}

function GeneralModal({
  headerText,
  onModalClose,
  body = null,
  primaryButtonText,
  onClickPrimaryButton,
  disabledPrimaryButton = false,
  secondaryButtonText = 'Cancel',
  onClickSecondaryButton,
  disabledSecondaryButton = false,
  size = 'sm',
  showFooter = true,
  footerType = FooterType.SINGLE,
}: GeneralModalProps) {
  const renderPrimaryButton = () => (
    <Button
      variant="contained"
      autoFocus
      onClick={onClickPrimaryButton}
      disabled={disabledPrimaryButton}
    >
      {primaryButtonText}
    </Button>
  );

  const renderSecondaryButton = () => (
    <Button
      onClick={onClickSecondaryButton ? onClickSecondaryButton : onModalClose}
      disabled={disabledSecondaryButton}
    >
      {secondaryButtonText}
    </Button>
  );

  const renderFooterButtons = () => {
    switch (footerType) {
      case FooterType.SINGLE: {
        return renderPrimaryButton();
      }
      case FooterType.DOUBLE: {
        return (
          <Box>
            {renderSecondaryButton()}
            {renderPrimaryButton()}
          </Box>
        );
      }
      case FooterType.NONE: {
        return null;
      }
      default:
        throw new Error('Footer type does not supported');
    }
  };

  return (
    <Dialog
      open
      aria-labelledby="customized-dialog-title"
      fullWidth
      maxWidth={size}
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {headerText}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onModalClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>{body}</DialogContent>
      {showFooter && <DialogActions>{renderFooterButtons()}</DialogActions>}
    </Dialog>
  );
}

export default GeneralModal;
