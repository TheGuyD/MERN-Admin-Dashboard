import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import { AuthProvider } from "context/AuthProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import MyParkingLots from "scenes/myparkinglots";
// import Customers from "scenes/customers";
// import Transactions from "scenes/transactions";
// import Geography from "scenes/geography";
// import Overview from "scenes/overview";
// import Daily from "scenes/daily";
// import Monthly from "scenes/monthly";
// import Breakdown from "scenes/breakdown";
// import Admin from "scenes/admin";
// import Performance from "scenes/performance";
import Register from "scenes/register";
import Login from "scenes/login";
import RequireAuth from "components/RequireAuth";
import UserInformation from "scenes/userInformation";
import ParkingLotInfo from "scenes/parkinglotinfo";
import CameraInfo from "scenes/cameraInfo";
import Users from "scenes/users";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* will be protected routes */}
                <Route element={<RequireAuth />}>
                  <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                      path="/my-parking-lots"
                      element={<MyParkingLots />}
                    />
                    <Route path="/users" element={<Users />} />
                    {/* <Route path="/customers" element={<Customers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/breakdown" element={<Breakdown />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/Performance" element={<Performance />} /> */}
                    <Route
                      path="/user-information"
                      element={<UserInformation />}
                    />
                    <Route path="/myparkinglots" element={<MyParkingLots />} />
                    <Route
                      path="/parkinglot/:parkingLotId"
                      element={<ParkingLotInfo />}
                    />
                    <Route path="/camera/:cameraId" element={<CameraInfo />} />
                  </Route>
                </Route>
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
      ,
    </div>
  );
}

export default App;
