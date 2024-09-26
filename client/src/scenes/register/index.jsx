import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  NAME_REGEX,
} from "helpers/validations";
import { useSignupMutation } from "state/authApi";
import {
  useCreateUserFolderStructureMutation,
  useUploadPhotoMutation,
} from "state/dataManagementApi";
import ImageWithTransparentBG from "assets/parkerai.png";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import ImagePicker from "components/ImagePicker";
import { setProfileImage } from "store/index";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const theme = useTheme();
  const dispatch = useDispatch();

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
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [validCompanyName, setValidCompanyName] = useState(false);
  const [companyNameFocus, setCompanyNameFocus] = useState(false);

  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState(null);

  const [signup] = useSignupMutation();
  const [createUserFolderStructure] = useCreateUserFolderStructureMutation();
  const [uploadPhoto] = useUploadPhotoMutation();

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
    setValidFirstName(NAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(NAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidPhoneNumber(PHONE_REGEX.test(phoneNumber)); // Assuming you have a regex for phone validation
  }, [phoneNumber]);

  useEffect(() => {
    setValidCompanyName(NAME_REGEX.test(companyName));
  }, [companyName]);

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

  const handleImageChange = (file) => {
    // Specify the new file name
    const newFileName = `profile.${file.name.split(".").pop()}`; // This will keep the original file extension

    // Create a new File object with the desired name
    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    console.log("renamedFile: ", renamedFile);

    // Set the renamed file to the avatar state
    setAvatar(renamedFile);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = PHONE_REGEX.test(phoneNumber);
    const v5 = NAME_REGEX.test(firstName);
    const v6 = NAME_REGEX.test(lastName);
    const v7 = NAME_REGEX.test(companyName);

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6 || !v7) {
      setErrMsg("Invalid Entry");
      return;
    }
    setLoading(true);
    try {
      console.log("username: ", userName);
      console.log("password: ", pwd);
      console.log("email: ", email);
      console.log("firstName: ", firstName);
      console.log("lastName: ", lastName);
      console.log("companyName: ", companyName);
      console.log("address: ", address);
      console.log("phoneNumber: ", phoneNumber);
      console.log("avatar: ", avatar);

      const response = await signup({
        username: userName,
        password: pwd,
        email,
        firstName,
        lastName,
        companyName,
        address,
        phoneNumber,
      }).unwrap();
      await createUserFolderStructure({
        userId: response.userId,
        context: "user",
      }).unwrap();

      if (avatar) {
        try {
          const uploadResponse = await uploadPhoto({
            image: avatar,
            path: `${response.userId}/userinformation`,
          });

          // Update the global state with the new profile image URL
          if (uploadResponse?.data.downloadURL) {
            dispatch(setProfileImage(uploadResponse.data.downloadURL));
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          // Handle the error appropriately
        }
      }

      setSuccess(true);
      setUserName("");
      setPwd("");
      setMatchPwd("");
      setFirstName("");
      setLastName("");
      setCompanyName("");
      setAddress("");
      setPhoneNumber("");
      setAvatar(null);
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
            elevation={24}
            sx={{
              display: "flex",
              flexDirection: "row",
              paddingTop: 4,
              paddingLeft: 4,
              borderRadius: 3,
              backgroundColor: "white",
              width: "70%",
              marginTop: "auto",
              marginBottom: "auto",
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
                width: "70%",
              }}
            >
              <Typography
                variant="h3"
                color={theme.palette.secondary[600]}
                marginTop={1}
                marginBottom={1}
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

              {/* Centered Image Picker */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImagePicker onImageChange={handleImageChange} />
              </Box>

              <AutoFillAwareTextField
                isLogin={true}
                label="Username"
                variant="outlined"
                size="small"
                inputRef={userRef}
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
                      4 to 24 characters. Must begin with a letter. Letters,
                      numbers, underscores, hyphens allowed.
                    </span>
                  )
                }
                onFocus={() => setUserNameFocus(true)}
                onBlur={() => setUserNameFocus(false)}
              />

              <AutoFillAwareTextField
                isLogin={true}
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
                isLogin={true}
                label="Password"
                variant="outlined"
                size="small"
                type={showPassword ? "text" : "password"}
                onChange={(value) => setPwd(value)}
                value={pwd}
                required
                error={!validPwd && Boolean(pwd)}
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
                      color: theme.palette.secondary[600],
                    },
                  },
                }}
              />

              <AutoFillAwareTextField
                isLogin={true}
                label="Confirm Password"
                variant="outlined"
                size="small"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(value) => setMatchPwd(value)}
                value={matchPwd}
                required
                error={!validMatch && Boolean(matchPwd)}
                helperText={
                  matchFocus &&
                  !validMatch && (
                    <span>Must match the first password input field.</span>
                  )
                }
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        sx={{
                          color: "primary.main",
                        }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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

              <AutoFillAwareTextField
                isLogin={true}
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
                isLogin={true}
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
                isLogin={true}
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
                isLogin={true}
                label="Address"
                variant="outlined"
                size="small"
                onChange={(value) => setAddress(value)}
                value={address}
                required
              />

              <AutoFillAwareTextField
                isLogin={true}
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

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={24} />}
              >
                Sign Up
              </Button>
              <Box marginBottom={2}>
                <Typography variant="body2" sx={{ mt: 1 }} color="primary">
                  Already registered?
                  <Link to="/login"> Sign In</Link>
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
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
