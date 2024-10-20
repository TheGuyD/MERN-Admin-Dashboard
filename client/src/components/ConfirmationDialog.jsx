// ConfirmationDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>
          This operation will delete information that cannot be restored. Are you sure you want to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "Accept"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
