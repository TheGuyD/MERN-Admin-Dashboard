import React, { useState, useEffect } from "react";
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
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import ImagePicker from "components/ImagePicker";

const ParkingLotDialog = ({
  open,
  handleClose,
  handleSubmit,
  parkingLotToEdit,
}) => {
  const [parkingLotName, setParkingLotName] = useState("");
  const [address, setAddress] = useState("");
  const [hourlyParkingCost, setHourlyParkingCost] = useState("");
  const [startingAt, setStartingAt] = useState(null);
  const [endingAt, setEndingAt] = useState(null);
  const [numberOfParkingSlot, setNumberOfParkingSlot] = useState("");
  const [updateInterval, setUpdateInterval] = useState("");
  const [avatar, setAvatar] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (parkingLotToEdit) {
      setParkingLotName(parkingLotToEdit.parkingLotName);
      setAddress(parkingLotToEdit.address);
      setHourlyParkingCost(parkingLotToEdit.hourlyParkingCost);
      setStartingAt(new Date(parkingLotToEdit.operationHours.startingAt));
      setEndingAt(new Date(parkingLotToEdit.operationHours.endingAt));
      setNumberOfParkingSlot(parkingLotToEdit.numberOfParkingSlot);
      setUpdateInterval(parkingLotToEdit.updateInterval);
      setAvatar(parkingLotToEdit.avatar);
    } else {
      resetForm();
    }
  }, [parkingLotToEdit]);

  const resetForm = () => {
    setParkingLotName("");
    setAddress("");
    setHourlyParkingCost("");
    setStartingAt(null);
    setEndingAt(null);
    setNumberOfParkingSlot("");
    setUpdateInterval("");
    setAvatar(null);
  };

  const handleImageChange = (file) => {
    setAvatar(file);
  };

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
        _id: parkingLotToEdit?._id,
        parkingLotName,
        address,
        hourlyParkingCost,
        operationHours: {
          startingAt,
          endingAt,
        },
        numberOfParkingSlot,
        updateInterval,
        avatar,
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
          borderRadius: "16px",
          boxShadow: theme.shadows[5],
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
        {parkingLotToEdit ? "Edit Parking Lot" : "Add Parking Lot"}
      </DialogTitle>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImagePicker
          onImageChange={handleImageChange}
          imageUrl={
            avatar &&
            (typeof avatar === "string" ? avatar : URL.createObjectURL(avatar))
          }
        />
      </Box>

      <DialogContent sx={{ paddingTop: "1rem" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2.75} alignItems="center">
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <AutoFillAwareTextField
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
            <Grid item xs={12}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
              {parkingLotToEdit ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default ParkingLotDialog;
