import React, { useState, useEffect, useCallback } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const ImagePicker = ({ onImageChange, imageUrl }) => {
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    // Update imageSrc if the imageUrl prop changes
    if (imageUrl) {
      setImageSrc(imageUrl);
    }
  }, [imageUrl]);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result); // Convert the file to a data URL and set it as the image source
          onImageChange(file); // Pass the file to the parent component
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result); // Convert the file to a data URL and set it as the image source
          onImageChange(file); // Pass the file to the parent component
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: 200,
        height: 200,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px dashed #ccc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        "&:hover": {
          borderColor: "#999",
        },
      }}
      onClick={() => document.getElementById("image-input").click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {imageSrc ? (
        <Avatar
          src={typeof imageSrc === "string" ? imageSrc : undefined} // Ensure only string URLs are passed
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <>
          <CloudUploadIcon sx={{ fontSize: 40, color: "#999" }} />
          <Typography variant="caption" sx={{ mt: 1, color: "#999" }}>
            Upload Image
          </Typography>
        </>
      )}
      <input
        id="image-input"
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageChange}
      />
    </Box>
  );
};

export default ImagePicker;
