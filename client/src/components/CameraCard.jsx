import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  useTheme,
  CardActionArea,
  CardMedia,
  Box,
} from "@mui/material";
import securityCameraSvg from "assets/securityCamera.svg";

const CameraCard = ({ camera, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        maxWidth: 300, // Increased from 250 to 300
        width: "100%",
        backgroundColor: theme.palette.background.alt,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 160, // Increased from 140 to 160
          }}
        >
          <CardMedia
            component="img"
            image={securityCameraSvg}
            alt="Security Camera"
            sx={{
              width: "auto",
              maxWidth: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, padding: 2 }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            noWrap
            title={camera.model}
          >
            {camera.model}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Area: {camera.area}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            IP: {camera.cameraAddr}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Slots: {camera.blueprint.length}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        <Button
          size="small"
          onClick={() => onEdit(camera)}
          sx={{
            padding: "0rem 1rem",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.common.white
                : theme.palette.text.primary,
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(camera._id)}
          sx={{
            padding: "0rem 1rem",
            color: theme.palette.error.main,
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default CameraCard;
