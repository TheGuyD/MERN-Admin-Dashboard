import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StatBox from "./StatBox";

const LiveVideoFeed = ({ cameraIp }) => {
  const videoUrl = `http://${cameraIp}/video`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden", // Ensure content doesn't overflow
        maxWidth: "100%", // Ensure box doesn't exceed parent width
        maxHeight: "100%", // Ensure box doesn't exceed parent height
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "10px" }}>
        Live Feed
      </Typography>
      <img
        src={videoUrl}
        alt="Live Camera Feed"
        style={{
          width: "100%", // Make the image responsive
          height: "auto", // Maintain aspect ratio
          maxHeight: "400px", // Limit max height
          objectFit: "contain", // Ensure the image fits within the box
          borderRadius: "10px",
        }}
      />
      <IconButton
        sx={{ marginTop: "6px" }}
        onClick={() => window.open(videoUrl, "_blank")}
      >
        <OpenInNewIcon />
      </IconButton>
    </Box>
  );
};

export default LiveVideoFeed;
