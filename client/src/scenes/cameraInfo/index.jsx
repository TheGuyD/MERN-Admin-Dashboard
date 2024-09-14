import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Collapse,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "components/Header";
import StatBox from "components/StatBox";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetCameraQuery,
  useGetCameraDocumentsQuery,
} from "state/dataManagementApi";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import LiveVideoFeed from "components/LiveVideoFeed";

const CameraInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { cameraId } = useParams();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedBlueprintSections, setExpandedBlueprintSections] = useState(
    {}
  );

  const {
    data: camera,
    isLoading: isCameraLoading,
    error: cameraError,
  } = useGetCameraQuery(cameraId);
  const {
    data: documents,
    isLoading: isDocumentsLoading,
    error: documentsError,
  } = useGetCameraDocumentsQuery({
    cameraId,
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sort),
    search,
  });

  const handleRowClick = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBlueprintSectionToggle = (section) => {
    setExpandedBlueprintSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredRows = documents?.documents.filter(
    (doc) => doc._id.includes(search) // Adjust this condition based on your search criteria
  );

  const columns = [
    { field: "_id", headerName: "Doc ID", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        return (
          <Box>
            <Typography variant="body2">{format(date, "PP")}</Typography>
            <Typography variant="body2" color="textSecondary">
              {format(date, "p")}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "slots",
      headerName: "Slots",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleRowClick(params.id)}>
            <ExpandMoreIcon
              sx={{
                transform: expandedRows[params.id]
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
          <Collapse in={expandedRows[params.id]}>
            {params.row.slots && (
              <Grid container spacing={2} mt={1}>
                {params.row.slots.map((slot, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Typography variant="body2" noWrap>
                      {slot.lot_name}: {slot.prediction.class}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            )}
          </Collapse>
        </Box>
      ),
      valueGetter: (params) => {
        if (!params.value || !Array.isArray(params.value)) return "";
        return params.value
          .map((slot) => `${slot.lot_name}: ${slot.prediction.class}`)
          .join(", ");
      },
    },
  ];

  if (isCameraLoading || isDocumentsLoading) {
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

  if (cameraError) {
    console.error("Camera fetch error:", cameraError);
    return (
      <Typography>
        Error loading camera data: {cameraError.status}{" "}
        {cameraError.data?.message || cameraError.error}
      </Typography>
    );
  }

  if (documentsError) {
    return (
      <Typography>Error loading documents: {documentsError.message}</Typography>
    );
  }

  if (!camera) {
    return <Typography>No camera data available</Typography>;
  }

  const renderBlueprintSection = (section, content) => (
    <Box key={section}>
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => handleBlueprintSectionToggle(section)}>
          <ExpandMoreIcon
            sx={{
              transform: expandedBlueprintSections[section]
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </IconButton>
        <Typography variant="subtitle1">{section}</Typography>
      </Box>
      <Collapse in={expandedBlueprintSections[section]}>
        {Array.isArray(content) ? (
          content.map((item, index) => (
            <Box key={index} ml={2}>
              {renderBlueprintSection(`${section}-${index}`, item)}
            </Box>
          ))
        ) : (
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {JSON.stringify(content, null, 2)}
          </pre>
        )}
      </Collapse>
    </Box>
  );

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title={camera.cameraModel || "Camera"}
        subtitle="Camera Information"
      />
      <Typography variant="h6" gutterBottom>
        Camera ID: {camera._id}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Parking Lot ID: {camera.parkingLotId}
      </Typography>
      <Box display="flex" justifyContent="flex-start" mt={2} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <LiveVideoFeed cameraIp={camera.cameraAddr} />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatBox
                title="Camera IP"
                value={
                  <Typography
                    noWrap
                    variant="h5"
                    fontWeight="600"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: theme.palette.secondary[200],
                    }}
                  >
                    {camera.cameraAddr}
                  </Typography>
                }
              />
              <Box mt={2}>
                <StatBox
                  title="Area"
                  value={
                    <Typography
                      noWrap
                      variant="h3"
                      fontWeight="600"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: theme.palette.secondary[200],
                      }}
                    >
                      {camera.area}
                    </Typography>
                  }
                />
              </Box>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" flexDirection="column" flexGrow={1}>
            <StatBox
              title="Current Blueprint"
              value={
                <Box>
                  {Object.entries(camera.blueprint).map(([key, value]) =>
                    renderBlueprintSection(key, value)
                  )}
                </Box>
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={7}>
          <Box display="flex" flexDirection="column" height="100%">
            <Box flexGrow={1} height="calc(100vh - 200px)">
              {" "}
              {/* Set a fixed height */}
              <DataGrid
                sx={{
                  height: "100%", // Make DataGrid fill the container
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.secondary[200]}`, // Use theme divider color
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
                }}
                loading={isDocumentsLoading}
                getRowId={(row) => row._id}
                rows={filteredRows || []} // Use filtered rows
                columns={columns}
                rowCount={documents?.total || 0}
                paginationModel={paginationModel}
                paginationMode="server"
                sortingMode="server"
                pageSizeOptions={[25, 50, 100]}
                onPaginationModelChange={setPaginationModel}
                onSortModelChange={(newSortModel) => {
                  const sort = newSortModel[0];
                  setSort(
                    sort ? JSON.stringify({ [sort.field]: sort.sort }) : {}
                  );
                }}
                slots={{
                  toolbar: DataGridCustomToolbar,
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
                getRowHeight={() => "auto"}
                rowHeight={undefined}
                density="compact" // Add this line
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CameraInfo;
