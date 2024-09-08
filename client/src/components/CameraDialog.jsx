import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useAddCameraMutation,
  useUpdateCameraMutation,
} from "state/dataManagementApi";
import { useSelector } from "react-redux";

const CameraDialog = ({ open, handleClose, parkingLotId, cameraToEdit }) => {
  const theme = useTheme();
  const [model, setModel] = useState("");
  const [area, setArea] = useState("");
  const [cameraAddr, setCameraAddr] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [blueprintStatus, setBlueprintStatus] = useState(null);
  const [addCamera] = useAddCameraMutation();
  const [updateCamera] = useUpdateCameraMutation();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    if (cameraToEdit) {
      setModel(cameraToEdit.model);
      setArea(cameraToEdit.area);
      setCameraAddr(cameraToEdit.cameraAddr);
      setBlueprint(cameraToEdit.blueprint);
    } else {
      resetForm();
    }
  }, [cameraToEdit]);

  const resetForm = () => {
    setModel("");
    setArea("");
    setCameraAddr("");
    setBlueprint(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setBlueprint(json);
          setBlueprintStatus("success");
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setBlueprintStatus("error");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const cameraData = {
        model,
        area,
        cameraAddr,
        blueprint,
        parkingLotId,
        userId,
      };

      if (cameraToEdit) {
        await updateCamera({ id: cameraToEdit._id, ...cameraData }).unwrap();
      } else {
        await addCamera(cameraData).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error("Failed to submit camera:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>
        {cameraToEdit ? "Edit Camera" : "Add New Camera"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Camera Model"
              type="text"
              fullWidth
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Area"
              type="text"
              fullWidth
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Camera Address"
              type="text"
              fullWidth
              value={cameraAddr}
              onChange={(e) => setCameraAddr(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept=".json"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                {blueprint ? "Change Blueprint JSON" : "Upload Blueprint JSON"}
              </Button>
            </label>
            {blueprintStatus === "success" && (
              <Typography color="success.main" sx={{ mt: 1 }}>
                Blueprint uploaded successfully
              </Typography>
            )}
            {blueprintStatus === "error" && (
              <Typography color="error.main" sx={{ mt: 1 }}>
                Error uploading blueprint
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.text.primary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!model || !area || !cameraAddr || !blueprint}
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.primary.dark, // Changed to primary.dark for better visibility in light mode
            "&:disabled": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[500]
                  : theme.palette.grey[400],
            },
          }}
        >
          {cameraToEdit ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CameraDialog;
