import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { EMAIL_REGEX, PWD_REGEX } from "helpers/validations";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useLoginMutation } from "state/authApi";
import ImageWithTransparentBG from "assets/ParkerAi-login.png";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import { useRetriveImageQuery } from "state/dataManagementApi";
import { useDispatch } from "react-redux";
import { setProfileImage } from "store/index";
const Login = () => {
  const { setAuth } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const userRef = useRef();
  const pwdRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // Track if the image is loaded

  const [login] = useLoginMutation();
  const [queryParams, setQueryParams] = useState(null); // State to hold the query parameters

  const { data: imageData } = useRetriveImageQuery(queryParams, {
    skip: !queryParams, // Skip the query initially until we have the query parameters
  });

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, email]);

  useEffect(() => {
    if (imageData?.downloadURL) {
      console.log("Profile image URL:", imageData.downloadURL);
      dispatch(setProfileImage(imageData.downloadURL));
      setImageLoaded(true); // Indicate that the image has been loaded
    }
  }, [imageData, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = PWD_REGEX.test(pwd);
    const v2 = EMAIL_REGEX.test(email);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      const response = await login({
        email,
        password: pwd,
      }).unwrap();

      if (response && response.userId) {
        setAuth({ ...response });

        setQueryParams({
          imageName: "profile.png",
          path: `${response.userId}/userinformation`,
        });
        // after user and response are ready TODO: FIX ANNOTIATION LATER
        //dispatch(setProfileImage(imageData.downloadURL));
        console.log("Login successful:", response);
      } else {
        console.error("Login response is missing userId");
        setErrMsg("Invalid response from server");
        return;
      }

      setSuccess(true);
      setEmail("");
      setPwd("");
    } catch (err) {
      let errorMsg = "Login Failed";
      if (!err?.status) {
        errorMsg = "No Server Response";
      } else if (err.data?.errors) {
        errorMsg =
          typeof err.data.errors === "string"
            ? err.data.errors
            : JSON.stringify(err.data.errors);
      }
      setErrMsg(errorMsg);
      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success && imageLoaded) {
      navigate("/dashboard"); // Navigate only after the image has been loaded
    }
  }, [success, imageLoaded, navigate]);

  return (
    <>
      {success && imageLoaded ? (
        <Navigate to="/dashboard" />
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
            elevation={24}
            sx={{
              display: "flex",
              paddingTop: 4,
              paddingLeft: 4,
              paddingRight: 4,
              borderRadius: 3,
              backgroundColor: "white",
              width: "100%",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              "&:hover": {
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
                transform: "translateY(-10px)",
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "60%",
              }}
            >
              <Typography variant="h3" color={theme.palette.secondary[600]}>
                Sign In
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
                isLogin={true}
                label="Email"
                variant="outlined"
                inputRef={userRef}
                autoComplete="email"
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
                isLogin={true}
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                inputRef={pwdRef}
                autoComplete="current-password"
                onChange={(value) => setPwd(value)}
                value={pwd}
                required
                error={!validPwd && Boolean(pwd)}
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
                      color: theme.palette.secondary[600],
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!validEmail || !validPwd || loading}
                startIcon={loading && <CircularProgress size={24} />}
              >
                Sign In
              </Button>
              <Box marginTop={20}>
                <Typography variant="body2" sx={{ mt: 2 }} color="primary">
                  Need an Account?
                  <Link to="/register"> Sign Up</Link>
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40%",
              }}
            >
              <img
                src={ImageWithTransparentBG}
                alt="Login illustration"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default Login;
