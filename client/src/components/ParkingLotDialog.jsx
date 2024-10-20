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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import ImagePicker from "components/ImagePicker";
import { useRetriveImageQuery } from "store/dataManagementApi";
import WeeklyTimePicker from "components/WeeklyTimePicker";

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ParkingLotDialog = ({
  open,
  handleClose,
  handleSubmit,
  parkingLotToEdit,
}) => {
  const [parkingLotName, setParkingLotName] = useState("");
  const [address, setAddress] = useState("");
  const [hourlyParkingCost, setHourlyParkingCost] = useState("");
  const [numberOfParkingSlot, setNumberOfParkingSlot] = useState("");
  const [updateInterval, setUpdateInterval] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [operationHours, setOperationHours] = useState({});
  const theme = useTheme();

  // Fetch the current image when editing
  const { data: imageData } = useRetriveImageQuery(
    parkingLotToEdit
      ? {
          imageName: "profile.webp",
          path: `${parkingLotToEdit.ownerUserId}/myparkinglots/${parkingLotToEdit._id}`,
        }
      : null,
    {
      skip: !parkingLotToEdit, // Skip query if not editing
    }
  );

  useEffect(() => {
    if (parkingLotToEdit) {
      setParkingLotName(parkingLotToEdit.parkingLotName);
      setAddress(parkingLotToEdit.address);
      setHourlyParkingCost(parkingLotToEdit.hourlyParkingCost);
      setNumberOfParkingSlot(parkingLotToEdit.numberOfParkingSlot);
      setUpdateInterval(parkingLotToEdit.updateInterval);

      // Initialize operationHours with 'enabled' property
      const initialOperationHours = {};
      daysOfWeek.forEach((day) => {
        const dayKey = day.toLowerCase();
        const dayData = parkingLotToEdit.operationHours
          ? parkingLotToEdit.operationHours[dayKey]
          : null;

        if (dayData && dayData.startingAt && dayData.startingAt !== 'Closed') {
          initialOperationHours[day] = {
            startingAt: parseTimeString(dayData.startingAt),
            endingAt: parseTimeString(dayData.endingAt),
            enabled: true,
          };
        } else {
          initialOperationHours[day] = {
            startingAt: null,
            endingAt: null,
            enabled: false,
          };
        }
      });
      setOperationHours(initialOperationHours);
      setAvatar(imageData?.downloadURL);
    } else {
      resetForm();
    }
  }, [parkingLotToEdit, imageData]);

  const parseTimeString = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  };

  const resetForm = () => {
    setParkingLotName("");
    setAddress("");
    setHourlyParkingCost("");
    setNumberOfParkingSlot("");
    setUpdateInterval("");
    setAvatar(null);
    setOperationHours({});
  };

  const handleImageChange = (file) => {
    setAvatar(file);
  };

  const isSubmitDisabled =
    !parkingLotName ||
    !address ||
    !hourlyParkingCost ||
    !numberOfParkingSlot ||
    !updateInterval ||
    !Object.values(operationHours).some(
      (day) =>
        day.enabled &&
        day.startingAt &&
        day.endingAt &&
        day.startingAt instanceof Date &&
        day.endingAt instanceof Date
    );

  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onSubmit = () => {
    if (!isSubmitDisabled) {
      // Build operationHours object
      const formattedOperationHours = {};
      daysOfWeek.forEach((day) => {
        const dayKey = day.toLowerCase();
        if (operationHours[day].enabled) {
          formattedOperationHours[dayKey] = {
            startingAt: formatTime(operationHours[day].startingAt),
            endingAt: formatTime(operationHours[day].endingAt),
          };
        } else {
          formattedOperationHours[dayKey] = {
            startingAt: 'Closed',
            endingAt: 'Closed',
          };
        }
      });

      handleSubmit({
        _id: parkingLotToEdit?._id,
        parkingLotName,
        address,
        hourlyParkingCost,
        operationHours: formattedOperationHours,
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
          mb: "40px",
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
            {/* Existing form fields */}
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
            {/* Insert the WeeklyTimePicker component */}
            <Grid item xs={12}>
              <WeeklyTimePicker
                initialTimes={operationHours}
                onTimesChange={setOperationHours}
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
                label="Update Interval (in seconds)"
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
