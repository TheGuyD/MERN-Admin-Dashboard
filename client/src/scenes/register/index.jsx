import { useRef, useState, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import {
  USER_REGEX,
  EMAIL_REGEX,
  PWD_REGEX,
  PHONE_REGEX,
} from "helpers/validations";
import { useSignupMutation } from "state/authApi";
import ImageWithTransparentBG from "assets/parkerai.png";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const theme = useTheme();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signup] = useSignupMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_REGEX.test(phoneNumber)); // Assuming you have a regex for phone validation
  }, [phoneNumber]);

  useEffect(() => {
    setErrMsg("");
  }, [
    userName,
    pwd,
    matchPwd,
    email,
    firstName,
    lastName,
    companyName,
    address,
    phoneNumber,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PHONE_REGEX.test(phoneNumber);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      await signup({
        username: userName,
        password: pwd,
        email,
        firstName,
        lastName,
        companyName,
        address,
        phoneNumber,
      }).unwrap();
      setSuccess(true);
      setUserName("");
      setPwd("");
      setMatchPwd("");
      setFirstName("");
      setLastName("");
      setCompanyName("");
      setAddress("");
      setPhoneNumber("");
    } catch (err) {
      if (!err?.status) {
        setErrMsg("No Server Response");
      } else if (err.data?.errors) {
        setErrMsg(err.data.errors);
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <Container>
          <Typography variant="h4">Success!</Typography>
          <Typography variant="body1">
            <Navigate to="/login">Sign In</Navigate>
          </Typography>
        </Container>
      ) : (
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={25}
            sx={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 4,
              paddingLeft: 4,
              borderRadius: 3,
              backgroundColor: "white",
              width: "70%", // Keep the width as before
              marginTop: "auto",
              marginBottom: "auto",
              "&:hover": {
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)", // More pronounced and farther shadow effect on hover
                transform: "translateY(-10px)", // More noticeable upward movement
                backgroundColor: "#f0f0f0", // Optional: slightly different background on hover
              },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2, // Set gap to add some space between each TextField
                width: "70%",
              }}
            >
              <Typography
                variant="h3" // Smaller variant to reduce height
                color={theme.palette.secondary[600]}
                marginTop={1} // Smaller top margin
                marginBottom={1} // Smaller bottom margin
              >
                Register
              </Typography>
              <Typography
                variant="body2"
                ref={errRef}
                color="error"
                sx={{ display: errMsg ? "block" : "none" }}
              >
                {errMsg}
              </Typography>

              <AutoFillAwareTextField
                label="Username"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                inputRef={userRef}
                autoComplete="off"
                onChange={(value) => setUserName(value)}
                value={userName}
                required
                error={!validUserName && userName}
                helperText={
                  userNameFocus &&
                  userName &&
                  !validUserName && (
                    <span>
                      4 to 24 characters. Must begin with a letter. Letters,
                      numbers, underscores, hyphens allowed.
                    </span>
                  )
                }
                onFocus={() => setUserNameFocus(true)}
                onBlur={() => setUserNameFocus(false)}
              />

              <AutoFillAwareTextField
                label="Email"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setEmail(value)}
                value={email}
                required
                error={!validEmail && email}
                helperText={
                  emailFocus &&
                  email &&
                  !validEmail && <span>Not a valid Email.</span>
                }
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />

              <AutoFillAwareTextField
                label="Password"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                type={showPassword ? "text" : "password"}
                onChange={(value) => setPwd(value)}
                value={pwd}
                required
                error={!validPwd && pwd}
                helperText={
                  pwdFocus &&
                  pwd &&
                  !validPwd && (
                    <span>
                      8 to 24 characters. Must include uppercase and lowercase
                      letters, a number, and a special character.
                    </span>
                  )
                }
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                          color: "primary.main",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    "&.Mui-focused .MuiIconButton-root": {
                      color: theme.palette.secondary[600], // Change the IconButton color when TextField is focused
                    },
                  },
                }}
              />

              <AutoFillAwareTextField
                label="Confirm Password"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                type={showConfirmPassword ? "text" : "password"}
                onChange={(value) => setMatchPwd(value)}
                value={matchPwd}
                required
                error={!validMatch && matchPwd}
                helperText={
                  matchFocus &&
                  !validMatch && (
                    <span>Must match the first password input field.</span>
                  )
                }
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />

              <AutoFillAwareTextField
                label="First Name"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setFirstName(value)}
                value={firstName}
                required
              />

              <AutoFillAwareTextField
                label="Last Name"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setLastName(value)}
                value={lastName}
                required
              />

              <AutoFillAwareTextField
                label="Company Name"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setCompanyName(value)}
                value={companyName}
              />

              <AutoFillAwareTextField
                label="Address"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setAddress(value)}
                value={address}
              />

              <AutoFillAwareTextField
                label="Phone Number"
                variant="outlined"
                size="small" // Reduce size to make the text field smaller
                onChange={(value) => setPhoneNumber(value)}
                value={phoneNumber}
                required
                error={!validPhoneNumber && phoneNumber}
                helperText={
                  phoneFocus &&
                  phoneNumber &&
                  !validPhoneNumber && <span>Not a valid Phone Number.</span>
                }
                onFocus={() => setPhoneFocus(true)}
                onBlur={() => setPhoneFocus(false)}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  !validUserName ||
                  !validPwd ||
                  !validMatch ||
                  !validEmail ||
                  !validPhoneNumber ||
                  loading
                }
                startIcon={loading && <CircularProgress size={24} />}
              >
                Sign Up
              </Button>
              <Box marginBottom={2}>
                {" "}
                {/* Reduce bottom margin */}
                <Typography variant="body2" sx={{ mt: 1 }} color="primary">
                  Already registered?
                  <Link to="/login"> Sign In</Link>
                </Typography>
              </Box>
            </Box>

            {/* Image on the right side but moved to the bottom */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end", // Move the image to the bottom
                width: "30%",
              }}
            >
              <img
                src={ImageWithTransparentBG}
                alt="Register illustration"
                style={{ maxWidth: "100%", height: "auto", marginBottom: 0 }}
              />
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Register;
