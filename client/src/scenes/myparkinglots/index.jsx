import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CardActionArea,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import AddParkingLotDialog from "components/AddParkingLotDialog";
import Header from "components/Header";
import placeHolderImage from "assets/parkingLot.png";
import {
  useAddParkingLotMutation,
  useGetAllParkingLotsByUserIdQuery,
  useCreateUserFolderStructureMutation, // Import the hook
  useUploadPhotoMutation,
  useRetriveImageQuery,
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
}) => {
  const theme = useTheme();
  const { userId } = useSelector((state) => state.auth);

  const [retryAttempt, setRetryAttempt] = useState(0);
  const maxRetries = 3; // You can adjust this as needed

  // Fetch the profile image for the parking lot
  const {
    data: imageData,
    error,
    refetch,
  } = useRetriveImageQuery({
    imageName: "profile.png",
    path: `${userId}/myparkinglots/${_id}`,
  });

  // Determine the image to display
  const imageUrl = imageData?.downloadURL || placeHolderImage;

  // Effect to handle retry logic
  useEffect(() => {
    if (error && retryAttempt < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Retrying image retrieval... Attempt ${retryAttempt + 1}`);
        setRetryAttempt((prev) => prev + 1);
        refetch(); // Retry fetching the image
      }, 2000); // Delay of 2 seconds

      return () => clearTimeout(timer); // Clean up the timeout if the component unmounts or retry attempt changes
    }
  }, [error, retryAttempt, refetch]);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Implement edit logic
    handleMenuClose();
  };

  const handleDelete = () => {
    // Implement delete logic
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
          image={imageUrl} // Use the fetched image URL or placeholder
          alt={parkingLotName}
          style={{ objectFit: "contain" }} //
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
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
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

const MyParkingLots = () => {
  const [open, setOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [addParkingLot] = useAddParkingLotMutation();
  const [createUserFolderStructure] = useCreateUserFolderStructureMutation(); // Initialize the mutation hook
  const userId = useSelector((state) => state.auth.userId);
  const { data, isLoading, refetch } =
    useGetAllParkingLotsByUserIdQuery(userId);
  const [uploadImage] = useUploadPhotoMutation(); // Initialize the upload mutation hook
  const isNonMobile = useMediaQuery("(min-width:1000px)");

  // useEffect(() => {
  //   const createUserFolder = async () => {
  //     try {
  //       const response = await createUserFolderStructure({ userId }).unwrap();
  //       console.log("Folder structure created:", response);
  //     } catch (err) {
  //       console.error("Failed to create folder structure:", err);
  //     }
  //   };

  //   createUserFolder(); // Trigger the API call when the component mounts
  // }, [createUserFolderStructure, userId]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExpandClick = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  const handleSubmit = async (parkingLotData) => {
    try {
      // Step 1: Add the parking lot to the database
      const addedParkingLot = await addParkingLot({
        ownerUserId: userId,
        ...parkingLotData,
      }).unwrap();

      const parkingLotId = addedParkingLot.parkingLotId;

      // Step 2: Create the folder structure in Firebase Storage
      await createUserFolderStructure({
        userId: userId,
        context: "parkinglot",
        parkingLotId: parkingLotId,
      }).unwrap();

      // Step 3: Upload the parking lot image to Firebase Storage
      if (parkingLotData.avatar) {
        await uploadImage({
          image: parkingLotData.avatar,
          path: `${userId}/myparkinglots/${parkingLotId}`,
        }).unwrap();

        console.log("Parking lot image uploaded successfully.");
      }

      // Step 4: Retry mechanism for refetching
      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          // Attempt to refetch the data
          await refetch();
          success = true; // If refetch is successful, set success to true
        } catch (err) {
          attempt++;
          if (attempt < maxRetries) {
            console.log(`Retrying refetch... Attempt ${attempt}`);
            // Wait for 2 seconds before trying again
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            console.error(
              "Failed to refetch parking lots data after several attempts:",
              err
            );
          }
        }
      }

      if (success) {
        handleClose();
      }
    } catch (err) {
      console.error("Failed to add parking lot:", err);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MY PARKING LOTS"
        subtitle="See your list of Parking Lots."
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Parking Lot
        </Button>
      </Box>
      <AddParkingLotDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
      {data && Array.isArray(data) && data.length > 0 ? (
        <Box
          mx="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(
            ({
              _id,
              parkingLotName,
              address,
              hourlyParkingCost,
              operationHours,
              numberOfParkingSlot,
              sumCurrOcupiedSlots,
              monthlyEstimatedRevenue,
            }) => (
              <ParkingLotCard
                key={_id}
                _id={_id}
                parkingLotName={parkingLotName}
                address={address}
                hourlyParkingCost={hourlyParkingCost}
                operationHours={operationHours}
                numberOfParkingSlot={numberOfParkingSlot}
                sumCurrOcupiedSlots={sumCurrOcupiedSlots}
                monthlyEstimatedRevenue={monthlyEstimatedRevenue}
                isExpanded={expandedCardId === _id}
                handleExpandClick={handleExpandClick}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default MyParkingLots;
