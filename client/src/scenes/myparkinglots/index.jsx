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
} from "@mui/material";
import AddParkingLotDialog from "components/AddParkingLotDialog";
import Header from "components/Header";
import placeHolderImage from "assets/parkingLot.jpeg";
import {
  useAddParkingLotMutation,
  useGetAllParkingLotsByUserIdQuery,
  useCreateUserFolderStructureMutation, // Import the hook
} from "state/dataManagementApi";
import { useSelector } from "react-redux";

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
          image={placeHolderImage}
          alt="placeHolder"
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
        >
          {isExpanded ? "See Less" : "See More"}
        </Button>
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
  const { data, isLoading } = useGetAllParkingLotsByUserIdQuery(userId);

  const isNonMobile = useMediaQuery("(min-width:1000px)");

  useEffect(() => {
    const createUserFolder = async () => {
      try {
        const response = await createUserFolderStructure({ userId }).unwrap();
        console.log("Folder structure created:", response);
      } catch (err) {
        console.error("Failed to create folder structure:", err);
      }
    };

    createUserFolder(); // Trigger the API call when the component mounts
  }, [createUserFolderStructure, userId]);

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
      await addParkingLot({
        ownerUserId: userId,
        ...parkingLotData,
      }).unwrap();
      handleClose();
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
