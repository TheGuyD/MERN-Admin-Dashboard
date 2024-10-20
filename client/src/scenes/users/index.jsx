import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  IconButton,
  Collapse,
} from "@mui/material";
import Header from "components/Header";
import StatBox from "components/StatBox";
import { DataGrid } from "@mui/x-data-grid";
import { useGetUsersQuery } from "store/index";
import { format } from "date-fns";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";

const Users = () => {
  const theme = useTheme();

  // Fetch all users
  const { data: users, isLoading, error } = useGetUsersQuery();

  // Current date details for statistics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Utility function to check if a date is in the current month
  const isThisMonth = (date) => {
    const d = new Date(date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  };

  // Compute statistics using useMemo for optimization
  const { totalAdmins, adminsThisMonth, totalUsers, usersThisMonth } =
    useMemo(() => {
      if (!users)
        return {
          totalAdmins: 0,
          adminsThisMonth: 0,
          totalUsers: 0,
          usersThisMonth: 0,
        };

      let totalAdmins = 0;
      let adminsThisMonth = 0;
      let totalUsers = 0;
      let usersThisMonth = 0;

      users.forEach((user) => {
        if (user.role === "1") {
          // Admin
          totalAdmins += 1;
          if (isThisMonth(user.createdAt)) {
            adminsThisMonth += 1;
          }
        } else if (user.role === "0") {
          // User
          totalUsers += 1;
          if (isThisMonth(user.createdAt)) {
            usersThisMonth += 1;
          }
        }
      });

      return { totalAdmins, adminsThisMonth, totalUsers, usersThisMonth };
    }, [users, currentMonth, currentYear]);

  // State Variables
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState({});

  // Handle row expansion
  const handleRowClick = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Search Filtering Logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    if (!search) return users;

    const lowercasedSearch = search.toLowerCase();

    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowercasedSearch) ||
        user.lastName.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch)
    );
  }, [users, search]);

  // Define columns for DataGrid
  const columns = [
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const roleMap = {
          1: "Admin",
          0: "User",
          2: "Parking Lot Owner",
          3: "Developer",
        };
        return <Typography>{roleMap[params.value] || "Unknown"}</Typography>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 250,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "parkingLots",
      headerName: "Parking Lots",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <Box width="100%">
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleRowClick(params.id);
            }}
            size="small"
          >
            <ExpandMoreIcon
              sx={{
                transform: expandedRows[params.id]
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
          <Collapse in={expandedRows[params.id]} timeout="auto" unmountOnExit>
            <Box mt={1} ml={2}>
              {params.value && params.value.length > 0 ? (
                params.value.map((lotId, index) => (
                  <Typography key={index} variant="body2">
                    {lotId}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">N/A</Typography>
              )}
            </Box>
          </Collapse>
        </Box>
      ),
    },
    {
      field: "_id",
      headerName: "User ID",
      flex: 1.5,
      minWidth: 200,
      hide: true,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      minWidth: 200,
      hide: true,
      renderCell: (params) => {
        const date = new Date(params.value);
        return <Typography>{format(date, "PPpp")}</Typography>;
      },
    },
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error fetching users: {error.status}{" "}
        {error.data?.message || error.error}
      </Typography>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="Manage and view all users" />

      {/* Statistics Section */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox
            title="Total Admins"
            value={totalAdmins}
            description="Number of Admin users"
            icon={<AdminPanelSettingsIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox
            title="Admins Added This Month"
            value={adminsThisMonth}
            description="Admins added in the current month"
            icon={<PersonAddIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox
            title="Total Users"
            value={totalUsers}
            description="Number of regular users"
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox
            title="Users Added This Month"
            value={usersThisMonth}
            description="Users added in the current month"
            icon={<PersonAddIcon />}
          />
        </Grid>
      </Grid>

      {/* DataGrid Section */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.secondary[300]}`,
            maxHeight: "none !important",
            whiteSpace: "normal !important",
            lineHeight: "1.5 !important",
            display: "flex !important",
            alignItems: "center !important",
            paddingTop: "8px !important",
            paddingBottom: "8px !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          "& .MuiDataGrid-row": {
            maxHeight: "none !important",
          },
        }}
      >
        <DataGrid
          slots={{
            toolbar: DataGridCustomToolbar,
          }}
          rows={filteredUsers || []}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
          slotProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch,
              handleExport: () => {},
            },
          }}
          onRowClick={handleRowClick}
          initialState={{
            columns: {
              columnVisibilityModel: {
                _id: false,
                createdAt: false,
              },
            },
          }}
          autoHeight
          disableExtendRowFullWidth
          disableColumnFilter
          disableSelectionOnClick
          getRowHeight={() => "auto"}
        />
      </Box>
    </Box>
  );
};

export default Users;
