import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserInformationQuery, useRetriveImageQuery } from "state/dataManagementApi";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Get userId from authSlice
  const userId = useSelector((state) => state.auth.userId);

  // Fetch user information
  const { data: userData } = useGetUserInformationQuery(userId);

  // Fetch the profile image using retrieveImageQuery
  const { data: imageData } = useRetriveImageQuery({
    imageName: "profile.png",
    path: `${userId}/userinformation`,
  });

  // Use the retrieved image URL or fallback to a default
  const profileImageUrl = imageData ? imageData.downloadURL : null;

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={userData || {}}
        profileImageUrl={profileImageUrl}
        isNonMobile={isNonMobile}
        drawerWidth="260px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          user={userData || {}}
          profileImageUrl={profileImageUrl}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
