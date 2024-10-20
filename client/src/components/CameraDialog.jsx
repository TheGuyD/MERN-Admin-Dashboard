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
} from "store/index";
import { useSelector } from "react-redux";

const CameraDialog = ({ open, handleClose, parkingLotId, cameraToEdit }) => {
  const theme = useTheme();
  const [cameraModel, setCameraModel] = useState("");
  const [area, setArea] = useState("");
  const [cameraAddr, setCameraAddr] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [blueprintStatus, setBlueprintStatus] = useState(null);
  const [error, setError] = useState(null);
  const [addCamera] = useAddCameraMutation();
  const [updateCamera] = useUpdateCameraMutation();
  const userId = useSelector((state) => state.auth.userId);

  // State variables to store initial values
  const [initialCameraModel, setInitialCameraModel] = useState("");
  const [initialArea, setInitialArea] = useState("");
  const [initialCameraAddr, setInitialCameraAddr] = useState("");
  const [initialBlueprint, setInitialBlueprint] = useState(null);

  useEffect(() => {
    if (open) {
      if (cameraToEdit) {
        // Editing an existing camera
        setCameraModel(cameraToEdit.cameraModel || "");
        setArea(cameraToEdit.area || "");
        setCameraAddr(cameraToEdit.cameraAddr || "");
        setBlueprint(cameraToEdit.blueprint || null);
        setBlueprintStatus(cameraToEdit.blueprint ? "success" : null);

        // Set initial values
        setInitialCameraModel(cameraToEdit.cameraModel || "");
        setInitialArea(cameraToEdit.area || "");
        setInitialCameraAddr(cameraToEdit.cameraAddr || "");
        setInitialBlueprint(cameraToEdit.blueprint || null);
      } else {
        // Adding a new camera
        resetForm();
      }
    }
  }, [open, cameraToEdit]);

  const resetForm = () => {
    setCameraModel("");
    setArea("");
    setCameraAddr("");
    setBlueprint(null);
    setBlueprintStatus(null);
    setError(null);

    // Reset initial values
    setInitialCameraModel("");
    setInitialArea("");
    setInitialCameraAddr("");
    setInitialBlueprint(null);
  };

  const handleFileUpload = (event) => {
    // Reset status and error messages before handling new upload
    setBlueprintStatus(null);
    setError(null);

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);

          // Validate the blueprint structure
          const blueprintValidation = validateBlueprint(json);
          if (!blueprintValidation.isValid) {
            setError(`Invalid blueprint: ${blueprintValidation.error}`);
            setBlueprintStatus("error");
            return;
          }

          setBlueprint(json);
          setBlueprintStatus("success");
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setError("Error parsing JSON: " + error.message);
          setBlueprintStatus("error");
        }
      };
      reader.readAsText(file);
    }
  };

  // Helper function to validate blueprint
  const validateBlueprint = (blueprint) => {
    if (!blueprint.categories || blueprint.categories.length === 0) {
      return { isValid: false, error: "Categories array is empty" };
    }

    for (let category of blueprint.categories) {
      if (!category.id || !category.name || !("supercategory" in category)) {
        return { isValid: false, error: "Invalid category object structure" };
      }
    }

    if (!blueprint.annotations || blueprint.annotations.length === 0) {
      return { isValid: false, error: "Annotations array is empty" };
    }

    for (let annotation of blueprint.annotations) {
      if (
        !annotation.id ||
        !annotation.image_id ||
        !annotation.category_id ||
        !Array.isArray(annotation.segmentation) ||
        !("area" in annotation) ||
        !Array.isArray(annotation.bbox) ||
        annotation.bbox.length !== 4 ||
        !("iscrowd" in annotation) ||
        !annotation.attributes ||
        !("occluded" in annotation.attributes) ||
        !("rotation" in annotation.attributes)
      ) {
        return { isValid: false, error: "Invalid annotation object structure" };
      }
    }

    return { isValid: true };
  };

  const handleSubmit = async () => {
    try {
      setError(null);

      if (cameraToEdit) {
        // We're updating an existing camera
        const updateData = {};

        if (cameraModel !== initialCameraModel) {
          updateData.cameraModel = cameraModel;
        }
        if (area !== initialArea) {
          updateData.area = area;
        }
        if (cameraAddr !== initialCameraAddr) {
          updateData.cameraAddr = cameraAddr;
        }

        // For blueprint, perform a deep comparison
        if (JSON.stringify(blueprint) !== JSON.stringify(initialBlueprint)) {
          updateData.blueprint = blueprint;
        }

        // Include the camera ID
        updateData.id = cameraToEdit._id;

        // Only proceed if there are changes (excluding 'id')
        if (Object.keys(updateData).length > 1) {
          const result = await updateCamera(updateData).unwrap();

          if (result.error) {
            setError(result.error);
            return;
          }
        } else {
          // No changes detected
          handleClose();
          return;
        }
      } else {
        // We're adding a new camera
        const cameraData = {
          cameraModel,
          area,
          cameraAddr,
          blueprint,
          parkingLotId,
          userId,
        };

        const result = await addCamera(cameraData).unwrap();

        if (result.error) {
          setError(result.error);
          return;
        }
      }

      handleClose();
    } catch (error) {
      console.error("Failed to submit camera:", error);
      setError(
        error.data?.message || "An error occurred while submitting the camera."
      );
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
              value={cameraModel}
              onChange={(e) => setCameraModel(e.target.value)}
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
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
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
          disabled={
            (!cameraModel || !area || !cameraAddr || !blueprint) &&
            !cameraToEdit
          }
          sx={{
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.primary.dark,
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
