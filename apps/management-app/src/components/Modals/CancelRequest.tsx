import { Box, Typography } from '@mui/material';
import React from 'react';
import GeneralModal from './GeneralModal';

interface CancelRequestProps {
  handleDelete: () => void;
  onModalClose: () => void;
}

export default function CancelRequest({
  handleDelete,
  onModalClose,
}: CancelRequestProps) {
  const body = (
    <Box>
      <Typography variant="subtitle1">
        Are you sure to cancel this request?
      </Typography>
    </Box>
  );

  return (
    <GeneralModal
      headerText="Cancel Request"
      onModalClose={onModalClose}
      body={body}
      primaryButtonText="Confirm"
      onClickPrimaryButton={() => {
        handleDelete();
        onModalClose();
      }}
      disabledPrimaryButton={false}
    />
  );
}
