import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Groups2Outlined,
  // ReceiptLongOutlined,
  // PublicOutlined,
  // PointOfSaleOutlined,
  // TodayOutlined,
  // AdminPanelSettingsOutlined,
  // TrendingUpOutlined,
  // PieChartOutlined,
  // CalendarMonthOutlined,
} from "@mui/icons-material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "assets/profile.png";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    text: "My Parking Lots",
    icon: <LocalParkingIcon />,
  },
  {
    text: "Users",
    icon: <Groups2Outlined />,
  },
  // {
  //   text: "Customers",
  //   icon: <Groups2Outlined />,
  // },
  // {
  //   text: "Transactions",
  //   icon: <ReceiptLongOutlined />,
  // },
  // {
  //   text: "Geography",
  //   icon: <PublicOutlined />,
  // },
  // {
  //   text: "Sales",
  //   icon: null,
  // },
  // {
  //   text: "Overview",
  //   icon: <PointOfSaleOutlined />,
  // },
  // {
  //   text: "Daily",
  //   icon: <TodayOutlined />,
  // },
  // {
  //   text: "Monthly",
  //   icon: <CalendarMonthOutlined />,
  // },
  // {
  //   text: "Breakdown",
  //   icon: <PieChartOutlined />,
  // },
  // {
  //   text: "Management",
  //   icon: null,
  // },
  // {
  //   text: "Admin",
  //   icon: <AdminPanelSettingsOutlined />,
  // },
  // {
  //   text: "Performance",
  //   icon: <TrendingUpOutlined />,
  // },
];

const Sidebar = ({
  user,
  profileImageUrl,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const formattedPathname = pathname
      .substring(1)
      .toLowerCase()
      .replace(/ /g, "-");
    setActive(formattedPathname);
  }, [pathname]);
  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }} //boxSizing insted of sixing
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography varint="h4" fontWeight="bold">
                    Parker AI
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        const formattedText = lcText.replace(/ /g, "-"); // Replace spaces with hyphens if your path uses hyphens
                        navigate(`/${formattedText}`);
                        setActive(formattedText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText.replace(/ /g, "-") // Compare the formatted value
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText.replace(/ /g, "-")
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText.replace(/ /g, "-")
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText.replace(/ /g, "-") && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box mt="auto">
            <Divider />
            <FlexBetween
              textTransform="none"
              gap="1rem"
              m="1.5rem 2rem 1.5rem 3rem"
            >
              <Box
                component="img"
                alt="profile"
                src={profileImageUrl || profileImage}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.firstName + " " + user.lastName}
                </Typography>
                {/* <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.email}
                </Typography> */}
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
