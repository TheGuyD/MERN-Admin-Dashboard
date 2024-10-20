import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Collapse,
  TextField, // Added for date picker
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
  useRemoveCameraDocsMutation, // Added mutation hook
} from "store/index";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";
import LiveVideoFeed from "components/LiveVideoFeed";
import RemoveRowsDialog from "components/RemoveRowsDialog"; // New component
import ConfirmationDialog from "components/ConfirmationDialog"; // New component

// Date picker import
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

  // State for Remove Rows functionality
  const [removeRowsDialogOpen, setRemoveRowsDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Mutation hook for removing camera documents
  const [removeCameraDocs, { isLoading: isRemovingDocs }] =
    useRemoveCameraDocsMutation();

  const {
    data: camera,
    isLoading: isCameraLoading,
    error: cameraError,
  } = useGetCameraQuery(cameraId);
  const {
    data: documents,
    isLoading: isDocumentsLoading,
    error: documentsError,
    refetch: refetchDocuments, // Added for refetching after deletion
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

  // Handler to open the Remove Rows dialog
  const handleRemoveRows = () => {
    setRemoveRowsDialogOpen(true);
  };

  // Handler to delete documents
  const handleDeleteDocuments = async () => {
    if (!selectedDate) return;
    try {
      await removeCameraDocs({
        cameraId,
        date: selectedDate.toISOString(),
      }).unwrap();
      refetchDocuments(); // Refresh documents after deletion
      setSelectedDate(null); // Reset the selected date
    } catch (error) {
      console.error("Failed to remove documents:", error);
      // Optionally, display an error message to the user
    }
  };

  const filteredRows = documents?.documents.filter((doc) =>
    doc._id.includes(search)
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
        ) : typeof content === "object" && content !== null ? (
          Object.entries(content).map(([subKey, subValue]) => (
            <Box key={subKey} ml={2}>
              {renderBlueprintSection(subKey, subValue)}
            </Box>
          ))
        ) : (
          <Typography variant="body2" ml={2}>
            {String(content)}
          </Typography>
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

      {/* Include the Remove Rows and Confirmation dialogs */}
      <RemoveRowsDialog
        open={removeRowsDialogOpen}
        onClose={() => setRemoveRowsDialogOpen(false)}
        onConfirm={() => {
          setConfirmationDialogOpen(true);
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={async () => {
          setConfirmationDialogOpen(false);
          await handleDeleteDocuments();
        }}
        isLoading={isRemovingDocs}
      />

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
              {/* Set a fixed height */}
              <DataGrid
                sx={{
                  height: "100%",
                  "& .MuiDataGrid-root": {
                    border: "none",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.secondary[200]}`,
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
                rows={filteredRows || []}
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
                    handleRemoveRows, // Pass the handler to show the Remove Rows button
                  },
                }}
                onRowClick={handleRowClick}
                getRowHeight={() => "auto"}
                rowHeight={undefined}
                density="compact"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CameraInfo;
