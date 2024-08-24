import { useRef, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { EMAIL_REGEX, PWD_REGEX } from "helpers/validations";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { useLoginMutation } from "state/authApi";

const Login = () => {
  const { auth, setAuth } = useAuth(); // Destructure both auth and setAuth
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
    try {
      const response = await login({
        email,
        password: pwd,
      }).unwrap();
      setAuth({ ...response }); // Correctly set the auth state
      setSuccess(true);
      setEmail("");
      setPwd("");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log(err);
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
    }
  };

  return (
    <>
      {success ? (
        <Navigate to="/dashboard" />
      ) : (
        <Container maxWidth="xs">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography variant="h5">Sign In</Typography>
            <Typography
              variant="body2"
              ref={errRef}
              color="error"
              sx={{ display: errMsg ? "block" : "none" }}
            >
              {errMsg}
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              inputRef={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {validEmail ? (
                        <Check color="success" />
                      ) : (
                        <Close color="error" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPwd(e.target.value)}
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
                    <IconButton>
                      {validPwd ? (
                        <Check color="success" />
                      ) : (
                        <Close color="error" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validEmail || !validPwd}
            >
              Sign In
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Need an Account?
            <Link to="/register"> Sign Up</Link>
          </Typography>
        </Container>
      )}
    </>
  );
};

export default Login;
