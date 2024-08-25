// pages/Register.js
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import { USER_REGEX, EMAIL_REGEX, PWD_REGEX } from "helpers/validations";
import { useSignupMutation } from "state/authApi";
import ImageWithTransparentBG from "assets/parkerai.png";
import AutoFillAwareTextField from "components/AutoFillAwareTextField"; // Import the modularized component

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

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
    setErrMsg("");
  }, [userName, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      await signup({ username: userName, password: pwd, email }).unwrap();
      setSuccess(true);
      setUserName("");
      setPwd("");
      setMatchPwd("");
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
          maxWidth="md" // Increased width for image accommodation
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={15}
            sx={{
              display: "flex",
              paddingTop: 4,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: 3,
              backgroundColor: "white",
              width: "100%",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "60%", // Adjust to fit the image
              }}
            >
              <Typography variant="h5" color="primary">
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
                type={showPassword ? "text" : "password"}
                onChange={(value) => setPwd(value)}
                value={pwd}
                required
                error={!validPwd && pwd}
                helperText={
                  pwdFocus &&
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
                        color="primary"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <AutoFillAwareTextField
                label="Confirm Password"
                variant="outlined"
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!validUserName || !validPwd || !validMatch || loading}
                startIcon={loading && <CircularProgress size={24} />}
              >
                Sign Up
              </Button>
              <Box marginTop={10} marginBottom={5}>
                <Typography variant="body2" sx={{ mt: 2 }} color="primary" >
                  Already registered?
                  <Link to="/login"> Sign In</Link>
                </Typography>
              </Box>
            </Box>

            {/* Image on the right side */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40%", // Adjust this as necessary
              }}
              >
              <img
                src={ImageWithTransparentBG}
                alt="Register illustration"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Register;
