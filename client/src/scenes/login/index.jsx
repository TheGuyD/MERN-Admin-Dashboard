// pages/Login.js
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { EMAIL_REGEX, PWD_REGEX } from "helpers/validations";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useLoginMutation } from "state/authApi";
import ImageWithTransparentBG from "assets/parkerai.png";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
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

  const [login] = useLoginMutation();

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
      setAuth({ ...response });
      setSuccess(true);
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
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

  return (
    <>
      {success ? (
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
              <Typography variant="h3" color="primary">
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
                label="Email"
                variant="outlined"
                inputRef={userRef}
                autoComplete="email"
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
                inputRef={pwdRef} // Added reference to the password field
                autoComplete="current-password"
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!validEmail || !validPwd || loading}
                startIcon={loading && <CircularProgress size={24} />}
              >
                Sign In
              </Button>
              <Box marginTop={10} >
                <Typography variant="body2" sx={{ mt: 2 }} color="primary">
                  Need an Account?
                  <Link to="/register"> Sign Up</Link>
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
