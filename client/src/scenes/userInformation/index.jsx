import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  InputAdornment,
  CircularProgress,
  useTheme,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import {
  USER_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
} from "helpers/validations"; // Adjust import paths as necessary

const UserInformation = () => {
  const location = useLocation();
  const user = location.state?.user; // Access the user object passed via state
  const theme = useTheme();
  const navigate = useNavigate();

  // State hooks for form fields
  const [userName, setUserName] = useState(user?.username || "");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState(user?.lastName || "");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [validCompanyName, setValidCompanyName] = useState(false);
  const [companyNameFocus, setCompanyNameFocus] = useState(false);

  const [address, setAddress] = useState(user?.address || "");

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_REGEX.test(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setValidCompanyName(NAME_REGEX.test(companyName));
  }, [companyName]);

  useEffect(() => {
    setErrMsg("");
  }, [userName, email, firstName, lastName, companyName, address, phoneNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = NAME_REGEX.test(firstName);
    const v4 = NAME_REGEX.test(lastName);
    const v5 = NAME_REGEX.test(companyName);
    const v6 = PHONE_REGEX.test(phoneNumber);

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      // Make your API call to update user information
      // Example: await updateUserInformation({ username, email, firstName, lastName, companyName, address, phoneNumber });
      console.log("User information updated");
      navigate("/dashboard"); // Redirect to another page after successful update
    } catch (err) {
      console.error("Failed to update user information", err);
      setErrMsg("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2, // Set gap to add some space between each TextField
          width: "100%",
        }}
      >
        <Typography variant="h4" color={theme.palette.secondary[600]}>
          User Information
        </Typography>
        <Typography
          variant="body2"
          color="error"
          sx={{ display: errMsg ? "block" : "none" }}
        >
          {errMsg}
        </Typography>

        <AutoFillAwareTextField
          label="Username"
          variant="outlined"
          size="small"
          autoComplete="off"
          onChange={(value) => setUserName(value)}
          value={userName}
          required
          error={!validUserName && Boolean(userName)}
          helperText={
            userNameFocus &&
            userName &&
            !validUserName && (
              <span>
                4 to 24 characters. Must begin with a letter. Letters, numbers,
                underscores, hyphens allowed.
              </span>
            )
          }
          onFocus={() => setUserNameFocus(true)}
          onBlur={() => setUserNameFocus(false)}
        />

        <AutoFillAwareTextField
          label="Email"
          variant="outlined"
          size="small"
          onChange={(value) => setEmail(value)}
          value={email}
          required
          error={!validEmail && Boolean(email)}
          helperText={
            emailFocus &&
            email &&
            !validEmail && <span>Not a valid Email.</span>
          }
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />

        <AutoFillAwareTextField
          label="First Name"
          variant="outlined"
          size="small"
          onChange={(value) => setFirstName(value)}
          value={firstName}
          required
          error={!validFirstName && Boolean(firstName)}
          helperText={
            firstNameFocus &&
            firstName &&
            !validFirstName && (
              <span>First Name must be at least 2 letters long.</span>
            )
          }
          onFocus={() => setFirstNameFocus(true)}
          onBlur={() => setFirstNameFocus(false)}
        />

        <AutoFillAwareTextField
          label="Last Name"
          variant="outlined"
          size="small"
          onChange={(value) => setLastName(value)}
          value={lastName}
          required
          error={!validLastName && Boolean(lastName)}
          helperText={
            lastNameFocus &&
            lastName &&
            !validLastName && (
              <span>Last Name must be at least 2 letters long.</span>
            )
          }
          onFocus={() => setLastNameFocus(true)}
          onBlur={() => setLastNameFocus(false)}
        />

        <AutoFillAwareTextField
          label="Company Name"
          variant="outlined"
          size="small"
          onChange={(value) => setCompanyName(value)}
          value={companyName}
          required
          error={!validCompanyName && Boolean(companyName)}
          helperText={
            companyNameFocus &&
            companyName &&
            !validCompanyName && (
              <span>Company Name must be at least 2 letters long.</span>
            )
          }
          onFocus={() => setCompanyNameFocus(true)}
          onBlur={() => setCompanyNameFocus(false)}
        />

        <AutoFillAwareTextField
          label="Address"
          variant="outlined"
          size="small"
          onChange={(value) => setAddress(value)}
          value={address}
          required
        />

        <AutoFillAwareTextField
          label="Phone Number"
          variant="outlined"
          size="small"
          onChange={(value) => setPhoneNumber(value)}
          value={phoneNumber}
          error={!validPhoneNumber && Boolean(phoneNumber)}
          helperText={
            phoneFocus &&
            phoneNumber &&
            !validPhoneNumber && <span>Not a valid Phone Number.</span>
          }
          onFocus={() => setPhoneFocus(true)}
          onBlur={() => setPhoneFocus(false)}
        />

        <TextField
          label="Occupation"
          placeholder="Please insert occupation"
          variant="outlined"
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} />}
          >
            Update Information
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/delete-account")}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserInformation;
