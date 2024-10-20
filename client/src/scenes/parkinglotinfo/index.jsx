import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Header from "components/Header";
import CameraCard from "components/CameraCard";
import CameraDialog from "components/CameraDialog";
import StatBox from "components/StatBox";
import {
  useGetAllParkingLotsByUserIdQuery,
  useGetCamerasQuery,
  useDeleteCameraMutation,
} from "store/index";
import { useSelector } from "react-redux";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const ParkingLotInfo = () => {
  const { parkingLotId } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const [openCameraDialog, setOpenCameraDialog] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const { data: parkingLots, isLoading: isLoadingParkingLots } =
    useGetAllParkingLotsByUserIdQuery(userId);
  const {
    data: cameras,
    refetch: refetchCameras,
    isLoading: isLoadingCameras,
  } = useGetCamerasQuery(parkingLotId);
  const [deleteCamera] = useDeleteCameraMutation();

  const parkingLot = parkingLots?.find((lot) => lot._id === parkingLotId);

  // Show loading animation if either query is loading
  if (isLoadingParkingLots || isLoadingCameras) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!parkingLot) {
    return <Typography>Loading...</Typography>;
  }

  const handleAddCamera = () => {
    setSelectedCamera(null);
    setOpenCameraDialog(true);
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setOpenCameraDialog(true);
  };

  const handleCloseCameraDialog = () => {
    setOpenCameraDialog(false);
    setSelectedCamera(null);
    refetchCameras();
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      await deleteCamera(cameraId).unwrap();
      refetchCameras();
    } catch (error) {
      console.error("Failed to delete camera:", error);
    }
  };

  // Function to format time strings to a more user-friendly format
  const formatTime = (timeStr) => {
    if (timeStr === "Closed") return "Closed";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title={parkingLot.parkingLotName}
        subtitle="Parking Lot Information"
      />
      <Box display="flex" justifyContent="flex-start" mt={2} mb={2}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        {/* Left Side - Parking Lot Details */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatBox
                title="Address"
                value={parkingLot.address}
                icon={
                  <LocationOnIcon
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "26px",
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBox
                title="Hourly Rate"
                value={`$${parkingLot.hourlyParkingCost}`}
                icon={
                  <AttachMoneyIcon
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "26px",
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatBox
                title="Total Slots"
                value={parkingLot.numberOfParkingSlot}
                icon={
                  <LocalParkingIcon
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "26px",
                    }}
                  />
                }
              />
            </Grid>
            {/* Replace the Paper component with StatBox for Operation Hours */}
            <Grid item xs={12}>
              <StatBox
                title="Operation Hours"
                value={
                  <Box>
                    {daysOfWeek.map((day) => {
                      const dayData = parkingLot.operationHours[day];
                      const displayDay =
                        day.charAt(0).toUpperCase() + day.slice(1);
                      if (dayData) {
                        const startingAt = formatTime(dayData.startingAt);
                        const endingAt = formatTime(dayData.endingAt);
                        return (
                          <Box
                            key={day}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2">{displayDay}:</Typography>
                            <Typography variant="body2">
                              {startingAt} - {endingAt}
                            </Typography>
                          </Box>
                        );
                      } else {
                        return (
                          <Box
                            key={day}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2">{displayDay}:</Typography>
                            <Typography variant="body2">Closed</Typography>
                          </Box>
                        );
                      }
                    })}
                  </Box>
                }
                icon={
                  <AccessTimeIcon
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "26px",
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        {/* Right Side - Cameras */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: "24px",
              border: `2px solid ${theme.palette.primary.main}`,
              backgroundColor: "transparent",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5">Cameras</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCamera}
              >
                Add Camera
              </Button>
            </Box>
            <Grid container spacing={2}>
              {cameras?.map((camera) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={camera._id}>
                  <CameraCard
                    camera={camera}
                    onEdit={handleEditCamera}
                    onDelete={handleDeleteCamera}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <CameraDialog
        open={openCameraDialog}
        handleClose={handleCloseCameraDialog}
        parkingLotId={parkingLotId}
        cameraToEdit={selectedCamera}
      />
    </Box>
  );
};

export default ParkingLotInfo;
