import React from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import Header from "components/Header";
import { useGetAllParkingLotsByUserIdQuery } from "state/dataManagementApi";
import { useSelector } from "react-redux";

const ParkingLotInfo = () => {
  const { parkingLotId } = useParams();
  const theme = useTheme();
  const userId = useSelector((state) => state.auth.userId);
  const { data: parkingLots } = useGetAllParkingLotsByUserIdQuery(userId);

  const parkingLot = parkingLots?.find((lot) => lot._id === parkingLotId);

  if (!parkingLot) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title={parkingLot.parkingLotName}
        subtitle="Parking Lot Information"
      />
      <Box mt="40px">
        <Typography variant="h6" color={theme.palette.secondary[300]}>
          Address: {parkingLot.address}
        </Typography>
        <Typography variant="h6" color={theme.palette.secondary[300]}>
          Hourly Rate: ${parkingLot.hourlyParkingCost}
        </Typography>
        <Typography variant="h6" color={theme.palette.secondary[300]}>
          Total Slots: {parkingLot.numberOfParkingSlot}
        </Typography>
        <Typography variant="h6" color={theme.palette.secondary[300]}>
          Operation Hours:{" "}
          {new Date(parkingLot.operationHours.startingAt).toLocaleTimeString()}{" "}
          - {new Date(parkingLot.operationHours.endingAt).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ParkingLotInfo;
