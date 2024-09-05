import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import placeHolderImage from "assets/parkingLot.png";
import {
  useRetriveImageQuery,
  useDeleteParkingLotMutation,
} from "state/dataManagementApi";
import { useSelector } from "react-redux";
import FlexBetween from "components/FlexBetween";

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
}) => {
  const theme = useTheme();
  const [deleteParkingLot] = useDeleteParkingLotMutation();
  const { userId } = useSelector((state) => state.auth);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const maxRetries = 3;

  const {
    data: imageData,
    error,
    refetch: refetchImage, // Use this to force refetch the image
  } = useRetriveImageQuery({
    imageName: "profile.png",
    path: `${userId}/myparkinglots/${_id}`,
  });

  const imageUrl = imageData?.downloadURL || placeHolderImage;

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
      console.log("Parking lot deleted successfully");
    } catch (error) {
      console.error("Failed to delete parking lot", error);
    }
    handleMenuClose();
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
      <CardActionArea>
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
      <CardActions>
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
      </CardActions>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Total Slots: {numberOfParkingSlot}</Typography>
          <Typography>
            Currently Occupied Slots: {sumCurrOcupiedSlots}
          </Typography>
          <Typography>
            Monthly Estimated Revenue: ${monthlyEstimatedRevenue.toFixed(2)}
          </Typography>
          <Typography>
            Operation Hours:{" "}
            {new Date(operationHours.startingAt).toLocaleTimeString()} -{" "}
            {new Date(operationHours.endingAt).toLocaleTimeString()}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ParkingLotCard;
