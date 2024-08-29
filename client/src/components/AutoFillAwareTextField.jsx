import React, { useState, useCallback, useEffect } from "react";
import { TextField, useTheme } from "@mui/material";

const AutoFillAwareTextField = ({
  isLogin = false,
  onChange,
  value,
  inputProps,
  InputLabelProps,
  ...rest
}) => {
  const [fieldHasValue, setFieldHasValue] = useState(value !== "");
  const theme = useTheme();

  useEffect(() => {
    setFieldHasValue(value !== "");
  }, [value]);

  const makeAnimationStartHandler = (stateSetter) => (e) => {
    const autofilled = !!e.target?.matches("*:-webkit-autofill");
    if (
      e.animationName === "mui-auto-fill" ||
      e.animationName === "mui-auto-fill-cancel"
    ) {
      stateSetter(autofilled || e.target.value !== "");
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
      value={value}
      {...rest}
      sx={{
        "& .MuiInputLabel-root": {
          fontWeight: "bold",
          fontSize: "0.9rem",
          color: isLogin
            ? theme.palette.primary[600]
            : theme.palette.secondary[100],
          opacity: 0.6,
          "&.Mui-focused": {
            fontSize: "0.8rem",
            opacity: 1,
            color: theme.palette.secondary[600],
          },
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.primary[300],
          },
          "&:hover fieldset": {
            borderColor: theme.palette.secondary[300],
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary[600],
          },
        },
        "& .MuiInputBase-input": {
          // backgroundColor: "white !important",
          color: theme.palette.secondary[600],
          caretColor: "#000000 !important",
          "&::placeholder": {
            color: theme.palette.secondary[600],
            opacity: 1,
          },
          "&::selection": {
            backgroundColor: "#4d547d !important",
            color: "#21295c !important",
          },
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset !important",
            WebkitTextFillColor: "#000000 !important",
          },
        },
      }}
    />
  );
};

export default AutoFillAwareTextField;
