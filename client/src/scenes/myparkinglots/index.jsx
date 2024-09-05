import React, { useState, useEffect } from "react";
import { Box, Button, useMediaQuery } from "@mui/material";
import Header from "components/Header";
import ParkingLotDialog from "components/ParkingLotDialog";
import ParkingLotCard from "components/ParkingLotCard";
import {
  useAddParkingLotMutation,
  useGetAllParkingLotsByUserIdQuery,
  useCreateUserFolderStructureMutation,
  useUploadPhotoMutation,
  useUpdateParkingLotMutation,
} from "state/dataManagementApi";
import { useSelector } from "react-redux";

const MyParkingLots = () => {
  const [open, setOpen] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [addParkingLot] = useAddParkingLotMutation();
  const [updateParkingLot] = useUpdateParkingLotMutation();
  const [createUserFolderStructure] = useCreateUserFolderStructureMutation();
  const userId = useSelector((state) => state.auth.userId);
  const { data, refetch } = useGetAllParkingLotsByUserIdQuery(userId);
  const [uploadImage] = useUploadPhotoMutation();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const [parkingLotToEdit, setParkingLotToEdit] = useState(null);
  const [updatedImageId, setUpdatedImageId] = useState(null);

  const handleOpen = (parkingLot = null) => {
    setParkingLotToEdit(parkingLot);
    setOpen(true);
  };

  const handleEdit = (parkingLotId) => {
    const parkingLotToEdit = data.find((lot) => lot._id === parkingLotId);
    handleOpen(parkingLotToEdit);
  };

  const handleClose = () => {
    setOpen(false);
    setParkingLotToEdit(null);
  };

  const handleExpandClick = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  const handleSubmit = async (parkingLotData) => {
    try {
      let response;
      if (parkingLotToEdit) {
        // Update existing parking lot
        response = await updateParkingLot({
          parkingLotId: parkingLotData._id,
          ownerUserId: userId,
          ...parkingLotData,
        }).unwrap();
      } else {
        // Add new parking lot
        response = await addParkingLot({
          ownerUserId: userId,
          ...parkingLotData,
        }).unwrap();

        // Create user folder structure if adding a new parking lot
        await createUserFolderStructure({
          userId: userId,
          context: "parkinglot",
          parkingLotId: response.parkingLotId,
        }).unwrap();
      }

      // Upload image if a new one is selected
      if (parkingLotData.avatar && parkingLotData.avatar instanceof File) {
        await uploadImage({
          image: parkingLotData.avatar,
          path: `${userId}/myparkinglots/${response.parkingLotId}`,
        }).unwrap();

        // Trigger the image refetch for the specific parking lot
        setUpdatedImageId(response.parkingLotId);
      }

      await refetch(); // Refetch the parking lot data to update the UI

      handleClose(); // Close the dialog after successful submission
    } catch (err) {
      console.error("Failed to submit parking lot:", err);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="MY PARKING LOTS"
        subtitle="See your list of Parking Lots."
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add Parking Lot
        </Button>
      </Box>
      <ParkingLotDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        parkingLotToEdit={parkingLotToEdit}
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
          {data.map((parkingLot) => (
            <ParkingLotCard
              key={parkingLot._id}
              {...parkingLot}
              isExpanded={expandedCardId === parkingLot._id}
              handleExpandClick={handleExpandClick}
              handleEdit={handleEdit}
              onImageUpdated={updatedImageId === parkingLot._id} // Pass the refetch trigger
            />
          ))}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default MyParkingLots;
