// components/AutoFillAwareTextField.jsx
import React, { useState, useCallback } from "react";
import { TextField } from "@mui/material";

const AutoFillAwareTextField = ({
  onChange,
  inputProps,
  InputLabelProps,
  ...rest
}) => {
  const [fieldHasValue, setFieldHasValue] = useState(false);

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
          fontWeight: "bold",
          fontSize: "1.1rem",
          color: "primary.main",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(0, 0, 0, 0.87)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
        "& .MuiInputBase-input": {
          backgroundColor: "white !important",
          color: "#21295c !important",
          caretColor: "#21295c !important",
          "&::selection": {
            backgroundColor: "#4d547d !important",
            color: "#21295c !important",
          },
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset !important",
            "-webkit-text-fill-color": "#21295c !important",
          },
        },
      }}
    />
  );
};

export default AutoFillAwareTextField;
