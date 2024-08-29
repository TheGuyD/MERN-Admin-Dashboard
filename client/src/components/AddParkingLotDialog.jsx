import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  useTheme,
  Box,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AutoFillAwareTextField from "./AutoFillAwareTextField";

const AddParkingLotDialog = ({ open, handleClose, handleSubmit }) => {
  const [parkingLotName, setParkingLotName] = useState("");
  const [address, setAddress] = useState("");
  const [hourlyParkingCost, setHourlyParkingCost] = useState("");
  const [startingAt, setStartingAt] = useState(null);
  const [endingAt, setEndingAt] = useState(null);
  const [numberOfParkingSlot, setNumberOfParkingSlot] = useState("");
  const [updateInterval, setUpdateInterval] = useState("");
  const theme = useTheme();

  const isSubmitDisabled =
    !parkingLotName ||
    !address ||
    !hourlyParkingCost ||
    !startingAt ||
    !endingAt ||
    !numberOfParkingSlot ||
    !updateInterval;

  const onSubmit = () => {
    if (!isSubmitDisabled) {
      handleSubmit({
        parkingLotName,
        address,
        hourlyParkingCost,
        operationHours: {
          startingAt,
          endingAt,
        },
        numberOfParkingSlot,
        updateInterval,
      });
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px", // Increased border-radius for rounded corners
          boxShadow: theme.shadows[5], // Using theme shadow for a softer look
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: theme.palette.text.primary,
        }}
      >
        Add Parking Lot
      </DialogTitle>
      <Box>
        <DialogContent sx={{ paddingTop: "1rem" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2.75} alignItems="center">
              <Grid item xs={10}>
                <AutoFillAwareTextField
                  label="Parking Lot Name"
                  value={parkingLotName}
                  onChange={setParkingLotName}
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <AutoFillAwareTextField
                  isLogin={false}
                  variant="outlined"
                  label="Address"
                  value={address}
                  onChange={setAddress}
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={10}>
                <AutoFillAwareTextField
                  label="Hourly Parking Cost"
                  value={hourlyParkingCost}
                  onChange={setHourlyParkingCost}
                  type="number"
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TimePicker
                  label="Operation Start Time"
                  value={startingAt}
                  onChange={setStartingAt}
                  renderInput={(params) => (
                    <AutoFillAwareTextField
                      {...params}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          fontSize: "0.9rem",
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <TimePicker
                  label="Operation End Time"
                  value={endingAt}
                  onChange={setEndingAt}
                  renderInput={(params) => (
                    <AutoFillAwareTextField
                      {...params}
                      fullWidth
                      required
                      InputLabelProps={{
                        style: {
                          fontSize: "0.9rem",
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={10}>
                <AutoFillAwareTextField
                  label="Number of Parking Slots"
                  value={numberOfParkingSlot}
                  onChange={setNumberOfParkingSlot}
                  type="number"
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <AutoFillAwareTextField
                  label="Update Interval (in minutes)"
                  value={updateInterval}
                  onChange={setUpdateInterval}
                  type="number"
                  required
                  fullWidth
                  InputLabelProps={{
                    style: {
                      fontSize: "0.9rem",
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ padding: "1.5rem", justifyContent: "flex-end" }}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                onClick={handleClose}
                sx={{
                  fontSize: "0.875rem",
                  color: theme.palette.grey[500],
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={onSubmit}
                variant="contained"
                color="primary"
                disabled={isSubmitDisabled}
                sx={{
                  fontSize: "0.875rem",
                  textTransform: "none",
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddParkingLotDialog;
