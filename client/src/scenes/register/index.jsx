import { useRef, useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment } from "@mui/material";
import { Check, Close, Info } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import { USER_REGEX, EMAIL_REGEX, PWD_REGEX } from "helpers/validations";
import { useSignupMutation } from "state/authApi"; 

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

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
        <Container maxWidth="xs">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Typography variant="h5">Register</Typography>
            <Typography
              variant="body2"
              ref={errRef}
              color="error"
              sx={{ display: errMsg ? 'block' : 'none' }}
            >
              {errMsg}
            </Typography>
            
            <TextField
              label="Username"
              variant="outlined"
              inputRef={userRef}
              autoComplete="off"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
              error={!validUserName && userName}
              helperText={
                userNameFocus && userName && !validUserName && (
                  <span>
                    4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                  </span>
                )
              }
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {validUserName ? <Check color="success" /> : <Close color="error" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              error={!validEmail && email}
              helperText={
                emailFocus && email && !validEmail && (
                  <span>Not a valid Email.</span>
                )
              }
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {validEmail ? <Check color="success" /> : <Close color="error" />}
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
                pwdFocus && !validPwd && (
                  <span>
                    8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character.
                  </span>
                )
              }
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {validPwd ? <Check color="success" /> : <Close color="error" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              error={!validMatch && matchPwd}
              helperText={
                matchFocus && !validMatch && (
                  <span>Must match the first password input field.</span>
                )
              }
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      {validMatch && matchPwd ? <Check color="success" /> : <Close color="error" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!validUserName || !validPwd || !validMatch}
            >
              Sign Up
            </Button>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already registered?
            <Link to="/login"> Sign In</Link>
          </Typography>
        </Container>
      )}
    </>
  );
};

export default Register;
