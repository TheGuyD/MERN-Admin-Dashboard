import React, { useState, useCallback } from "react";
import { TextField, useTheme } from "@mui/material";

const AutoFillAwareTextField = ({
  onChange,
  inputProps,
  InputLabelProps,
  ...rest
}) => {
  const [fieldHasValue, setFieldHasValue] = useState(false);
  const theme = useTheme();

  const makeAnimationStartHandler = (stateSetter) => (e) => {
    const autofilled = !!e.target?.matches("*:-webkit-autofill");
    if (
      e.animationName === "mui-auto-fill" ||
      e.animationName === "mui-auto-fill-cancel"
    ) {
      stateSetter(autofilled);
    }
  };

  const _onChange = useCallback(
    (e) => {
      onChange(e.target.value);
      setFieldHasValue(e.target.value !== "");
    },
    [onChange]
  );

  return (
    <TextField
      inputProps={{
        onAnimationStart: makeAnimationStartHandler(setFieldHasValue),
        ...inputProps,
      }}
      InputLabelProps={{
        shrink: fieldHasValue,
        ...InputLabelProps,
      }}
      onChange={_onChange}
      {...rest}
      sx={{
        "& .MuiInputLabel-root": {
          fontWeight: "normal", // Remove bold font
          fontSize: "0.8rem", // Default hint size
          color: theme.palette.primary[600], // Set placeholder text color
          opacity: 0.6, // Set opacity for the label
          "&.Mui-focused": {
            fontSize: "0.8rem", // Font size when focused/shrinked
            opacity: 1, // Full opacity when focused
            color: theme.palette.secondary[600],
          },
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary[600],
          },
        },
        "& .MuiInputBase-input": {
          backgroundColor: "white !important",
          color: "#000000 !important", // User input text color is black
          caretColor: "#000000 !important", // Caret color is black
          "&::placeholder": {
            color: theme.palette.secondary[600], // Placeholder text color
            opacity: 1, // Ensure the opacity is set
          },
          "&::selection": {
            backgroundColor: "#4d547d !important",
            color: "#21295c !important",
          },
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset !important",
            "-webkit-text-fill-color": "#000000 !important", // Autofill text color is black
          },
        },
      }}
    />
  );
};

export default AutoFillAwareTextField;
