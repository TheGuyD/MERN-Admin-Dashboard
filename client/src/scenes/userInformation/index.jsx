import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AutoFillAwareTextField from "components/AutoFillAwareTextField";
import {
  USER_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  NAME_REGEX,
} from "helpers/validations";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRetriveImageQuery,
  useUploadPhotoMutation,
} from "state/dataManagementApi";
import Header from "components/Header";
import ImagePicker from "components/ImagePicker";
import { setProfileImage } from "state/authSlice";

const UserInformation = () => {
  const location = useLocation();
  const user = location.state?.user;
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State hooks for form fields
  const [userName, setUserName] = useState(user?.username || "");
  const [validUserName, setValidUserName] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [validEmail, setValidEmail] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [validFirstName, setValidFirstName] = useState(false);
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [validLastName, setValidLastName] = useState(false);
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [validCompanyName, setValidCompanyName] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [validPhoneNumber, setValidPhoneNumber] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // For uploading the file

  // Retrieve the user's current profile image
  const { data: imageData } = useRetriveImageQuery({
    imageName: "profile.png",
    path: `${user._id}/userinformation`,
  });
  const [updateUserInformation] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [uploadImage] = useUploadPhotoMutation();

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
    setSuccessMsg("");
  }, [userName, email, firstName, lastName, companyName, address, phoneNumber]);

  // Set the fetched profile image in the ImagePicker
  useEffect(() => {
    if (imageData && imageData.downloadURL) {
      setAvatar(imageData.downloadURL);
    }
  }, [imageData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validUserName ||
      !validEmail ||
      !validFirstName ||
      !validLastName ||
      !validCompanyName ||
      !validPhoneNumber
    ) {
      setErrMsg("Invalid Entry");
      return;
    }

    setLoading(true);

    try {
      // Update user information
      const response = await updateUserInformation({
        userId: user._id,
        username: userName,
        email,
        firstName,
        lastName,
        companyName,
        phoneNumber,
      }).unwrap();

      setSuccessMsg(response.message);

      // If a new avatar is selected, upload it
      if (selectedFile) {
        const uploadResponse = await uploadImage({
          image: selectedFile,
          path: `${user._id}/userinformation`,
        });
        
        // Update the global state with the new profile image URL
        if (uploadResponse?.data.downloadURL) {
          console.log("🚀 ~ handleSubmit ~ uploadResponse?.data.downloadURL:", uploadResponse?.data.downloadURL)
          dispatch(setProfileImage(uploadResponse?.data.downloadURL));
        }
      }
    } catch (err) {
      console.error("Failed to update user information", err);
      setErrMsg("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const response = await deleteUser(user._id).unwrap();
      setSuccessMsg(response.message);
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete user", err);
      setErrMsg("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file) => {
    const newFileName = `profile.${file.name.split(".").pop()}`; // This will keep the original file extension
    const renamedFile = new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });

    // Create a FileReader to read the file and convert it to a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result); // Set the data URL as the avatar image for immediate display
    };
    reader.readAsDataURL(renamedFile);

    // Store the file for later upload
    setSelectedFile(renamedFile);
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
          gap: 2,
          width: "100%",
        }}
      >
        <Box mb="175px">
          <Header
            title="User Information"
            subtitle="Your Personal information"
          />
        </Box>

        {/* Centered Image Picker */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImagePicker
            onImageChange={handleImageChange}
            imageUrl={avatar} // Pass the current or newly selected avatar
          />
        </Box>

        <Typography
          variant="body2"
          color="error"
          sx={{ display: errMsg ? "block" : "none" }}
        >
          {errMsg}
        </Typography>

        <Typography
          variant="body2"
          color="success.main"
          sx={{ display: successMsg ? "block" : "none" }}
        >
          {successMsg}
        </Typography>

        <AutoFillAwareTextField
          label="Username"
          variant="outlined"
          size="small"
          autoComplete="off"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
          required
          error={!validUserName && Boolean(userName)}
          helperText={
            userName &&
            !validUserName && (
              <span>
                4 to 24 characters. Must begin with a letter. Letters, numbers,
                underscores, hyphens allowed.
              </span>
            )
          }
        />

        <AutoFillAwareTextField
          label="Email"
          variant="outlined"
          size="small"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
          error={!validEmail && Boolean(email)}
          helperText={email && !validEmail && <span>Not a valid Email.</span>}
        />

        <AutoFillAwareTextField
          label="First Name"
          variant="outlined"
          size="small"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          required
          error={!validFirstName && Boolean(firstName)}
          helperText={
            firstName &&
            !validFirstName && (
              <span>First Name must be at least 2 letters long.</span>
            )
          }
        />

        <AutoFillAwareTextField
          label="Last Name"
          variant="outlined"
          size="small"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          required
          error={!validLastName && Boolean(lastName)}
          helperText={
            lastName &&
            !validLastName && (
              <span>Last Name must be at least 2 letters long.</span>
            )
          }
        />

        <AutoFillAwareTextField
          label="Company Name"
          variant="outlined"
          size="small"
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
          required
          error={!validCompanyName && Boolean(companyName)}
          helperText={
            companyName &&
            !validCompanyName && (
              <span>Company Name must be at least 2 letters long.</span>
            )
          }
        />

        <AutoFillAwareTextField
          label="Address"
          variant="outlined"
          size="small"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
          required
        />

        <AutoFillAwareTextField
          label="Phone Number"
          variant="outlined"
          size="small"
          onChange={(e) => setPhoneNumber(e.target.value)}
          value={phoneNumber}
          error={!validPhoneNumber && Boolean(phoneNumber)}
          helperText={
            phoneNumber &&
            !validPhoneNumber && <span>Not a valid Phone Number.</span>
          }
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            Update Information
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserInformation;
