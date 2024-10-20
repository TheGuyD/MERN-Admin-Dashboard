import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  CardActionArea,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Switch, // Import Switch component
  FormControlLabel, // Import FormControlLabel for the switch label
  Box,
} from "@mui/material";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import placeHolderImage from "assets/parkingLot.png";
import {
  useRetriveImageQuery,
  useDeleteParkingLotMutation,
  useGetCamerasQuery, // Import the hook to fetch cameras
  useScheduleTaskMutation,
  useCancelTaskMutation,
  useUpdateParkingLotMutation,
  useSaveSchedulerTaskMutation,
  useDeleteSchedulerTaskMutation,
} from "store/index";
import { useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const ParkingLotCard = ({
  _id,
  parkingLotName,
  address,
  hourlyParkingCost,
  operationHours,
  numberOfParkingSlot,
  sumCurrOcupiedSlots,
  monthlyEstimatedRevenue,
  isExpanded,
  handleExpandClick,
  handleEdit,
  imageUpdated, // New prop to force image refetch
  updateInterval, // Add updateInterval as a prop
  isCapture,
}) => {
  const theme = useTheme();
  const [deleteParkingLot] = useDeleteParkingLotMutation();
  const { userId } = useSelector((state) => state.auth);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const maxRetries = 3;
  const navigate = useNavigate();

  // State for the Active Monitoring switch
  const [activeMonitoring, setActiveMonitoring] = useState(isCapture);

  // Hooks from schedulerServiceApi
  const [scheduleTask, { isLoading: isScheduling }] = useScheduleTaskMutation();
  const [cancelTask, { isLoading: isCancelling }] = useCancelTaskMutation();
  const [
    saveSchedulerTask,
    { isLoading: isSavingSchedulerTask },
  ] = useSaveSchedulerTaskMutation();
  const [
    deleteSchedulerTask,
    { isLoading: isDeletingSchedulerTask },
  ] = useDeleteSchedulerTaskMutation();

  // Hooks from data-management
  const [
    updateParkingLot,
    { isLoading: isUpdatingParkingLot },
  ] = useUpdateParkingLotMutation();

  // Fetch cameras associated with the parking lot
  const {
    data: camerasData,
    isLoading: isLoadingCameras,
    error: camerasError,
  } = useGetCamerasQuery(_id);

  const cameras = camerasData || [];

  const {
    data: imageData,
    error,
    refetch: refetchImage,
  } = useRetriveImageQuery({
    imageName: "profile.webp",
    path: `${userId}/myparkinglots/${_id}`,
  });

  const imageUrl = imageData?.downloadURL || placeHolderImage;

  const isProcessing =
  isUpdatingParkingLot;

  // Refetch the image when the parent component notifies about an update
  useEffect(() => {
    if (imageUpdated) {
      setRetryAttempt(0); // Reset retry attempt on new image update
      refetchImage();
    }
  }, [imageUpdated, refetchImage]);

  useEffect(() => {
    if (error && retryAttempt < maxRetries) {
      const timer = setTimeout(() => {
        setRetryAttempt((prev) => prev + 1);
        refetchImage();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, retryAttempt, refetchImage]);

  useEffect(() => {
    setActiveMonitoring(isCapture);
  }, [isCapture]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onEdit = () => {
    handleEdit(_id);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await deleteParkingLot({
        parkingLotId: _id,
        ownerUserId: userId,
      }).unwrap();
      await deleteSchedulerTask(_id).unwarp();
      console.log("Parking lot deleted successfully and its schedulerTasks");
    } catch (error) {
      console.error("Failed to delete parking lot", error);
    }
    handleMenuClose();
  };

  const handleCardClick = () => {
    navigate(`/parkinglot/${_id}`);
  };

  // Handle Active Monitoring Switch Change
  const handleActiveMonitoringChange = async (event) => {
    const isChecked = event.target.checked;
    setActiveMonitoring(isChecked);

    if (isChecked) {
      // Prepare data for scheduling
      if (!cameras || cameras.length === 0) {
        console.error("No cameras available for this parking lot.");
        return;
      }

      const preparedCameras = cameras.map((camera) => ({
        cameraId: camera._id,
        cameraUrl: camera.cameraAddr,
      }));
      let intervalTime = `${updateInterval}s`;
      if (updateInterval < 1) {
        // If interval is less than 1 second, convert to seconds
        intervalTime = `${Math.round(updateInterval * 60)}s`;
      }

      const requestBody = {
        parkingLotId: _id,
        operationHours,
        intervalTime,
        cameras: preparedCameras,
      };

      try {
        await scheduleTask(requestBody).unwrap();
        await updateParkingLot({
          parkingLotId: _id,
          ownerUserId: userId,
          isCapture: isChecked,
        }).unwrap();
        await saveSchedulerTask(requestBody).unwrap();
        console.log("Task scheduled successfully.", requestBody);
      } catch (error) {
        console.error("Failed to schedule task:", requestBody);
        // Optionally, revert the switch state
        setActiveMonitoring(false);
      }
    } else {
      // Cancel the scheduled task
      try {
        await cancelTask(_id).unwrap();
        await updateParkingLot({
          parkingLotId: _id,
          ownerUserId: userId,
          isCapture: isChecked,
        }).unwrap();
        await deleteSchedulerTask(_id).unwrap();
        console.log("Task cancelled successfully.");
      } catch (error) {
        console.error("Failed to cancel task:", error);
        // Optionally, revert the switch state
        setActiveMonitoring(true);
      }
    }
  };

  return (
    <Card
      sx={{
        background: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
        boxShadow: isExpanded ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
        transition: "box-shadow 0.3s ease",
        overflow: "hidden",
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={parkingLotName}
          style={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[700]}
            gutterBottom
          >
            {address}
          </Typography>
          <Typography variant="h5" component="div">
            {parkingLotName}
          </Typography>
          <Typography
            sx={{ mb: "1.5rem" }}
            color={theme.palette.secondary[400]}
          >
            ${Number(hourlyParkingCost).toFixed(2)} / hour
          </Typography>
          <Typography variant="body2">
            Slots Available: {numberOfParkingSlot - sumCurrOcupiedSlots}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Active Monitoring Switch */}
        <FormControlLabel
          control={
            <Switch
              checked={activeMonitoring}
              onChange={handleActiveMonitoringChange}
              color="primary"
              disabled={isProcessing}
              />
          }
          label="Active Monitoring"
          sx={{ mb: 1 }}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            variant="primary"
            size="small"
            onClick={() => handleExpandClick(_id)}
            sx={{ minWidth: "100px" }}
          >
            {isExpanded ? "See Less" : "See More"}
          </Button>
          <FlexBetween sx={{ width: "100%" }} />
          <IconButton
            aria-label="settings"
            onClick={handleMenuOpen}
            sx={{ ml: "auto" }}
          >
            <MenuOpenRoundedIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={onEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
      </CardActions>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>ID: {_id}</Typography>
          <Typography>Total Slots: {numberOfParkingSlot}</Typography>
          <Typography>
            Currently Occupied Slots: {sumCurrOcupiedSlots}
          </Typography>
          <Typography>
            Monthly Estimated Revenue: ${monthlyEstimatedRevenue.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Operation Hours:
          </Typography>
          {daysOfWeek.map((day) => {
            const dayData = operationHours[day];
            const displayDay = day.charAt(0).toUpperCase() + day.slice(1);
            if (dayData) {
              const startingAt = dayData.startingAt;
              const endingAt = dayData.endingAt;
              return (
                <Typography key={day}>
                  {displayDay}: {startingAt} - {endingAt}
                </Typography>
              );
            } else {
              return <Typography key={day}>{displayDay}: Closed</Typography>;
            }
          })}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ParkingLotCard;
