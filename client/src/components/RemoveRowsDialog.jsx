// RemoveRowsDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const RemoveRowsDialog = ({
  open,
  onClose,
  onConfirm,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Date to Remove Documents</DialogTitle>
      <DialogContent>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onClose();
            onConfirm();
          }}
          disabled={!selectedDate}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveRowsDialog;
