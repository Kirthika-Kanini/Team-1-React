import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Slider, Button, TextField, Chip } from "@mui/material";
import axios from "axios";
import { DialogContent, DialogActions } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function DeskBookingDialog() {
  const [clickedDate, setClickedDate] = useState(null);
  const [timeRange, setTimeRange] = useState([9, 17]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocationdesk, setSelectedLocationdesk] = useState("");
  const [selectedColleagues, setSelectedColleagues] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [user_id, setUser_Id] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const formatTime = (value) => {
    const hours = String(value + 7).padStart(2, "0");
    return `${hours} hrs`;
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const marks = [
    { value: 0, label: "7 am" },
    { value: 1, label: "8 am" },
    { value: 2, label: "9 am" },
    { value: 3, label: "10 am" },
    { value: 4, label: "11 am" },
    { value: 5, label: "12 pm" },
    { value: 6, label: "1 pm" },
    { value: 7, label: "2 pm" },
    { value: 8, label: "3 pm" },
    { value: 9, label: "4 pm" },
    { value: 10, label: "5 pm" },
    { value: 11, label: "6 pm" },
    { value: 12, label: "7 pm" },
    { value: 13, label: "8 pm" },
    { value: 14, label: "9 pm" },
    { value: 15, label: "10 pm" },
  ];

  const formatTimeToStandard = (value) => {
    const timeParts = value.split(" ");
    const hours = parseInt(timeParts[0], 10);
    const isPM = hours >= 12;
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    let minutes = "00";

    if (timeParts[0].includes(".5")) {
      minutes = "30";
    }
    const period = isPM ? "PM" : "AM";

    return `${formattedHours}:${minutes} ${period}`;
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser_Id(userId);
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7243/location/GetAllLocations")
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7243/userprofile/GetAllUsers")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleDeskSubmit = () => {
    const colleague = selectedColleagues
      .map(
        (colleague) => `${colleague.userFirstName} ${colleague.userLastName}`
      )
      .join(", ");

    const date = clickedDate ? clickedDate.toISOString().split("T")[0] : "";
    const user_id = localStorage.getItem("userId");
    const newDeskBooking = {
      deskBookingDate: date,
      deskBookingColleague: colleague,
      desks: { deskId: selectedLocationId },
      location: { locationId: selectedLocationId },
      users: { userId: parseInt(user_id, 10) },
    };

    try {
      const response = axios.post(
        "https://localhost:7243/deskbooking/PostDeskBooking",
        newDeskBooking
      );
      displaySnackbar("Desk Booking Successful", "success");
    } catch (error) {
      displaySnackbar("An error occured while booking", "error");
    }
  };

  const handleLocationChange = (newValue) => {
    if (newValue) {
      setSelectedLocation(newValue);
      setSelectedLocationdesk(newValue);
      const selectedLocationObj = locations.find(
        (location) => location.locationCity === newValue
      );
      if (selectedLocationObj) {
        setSelectedLocationId(selectedLocationObj.locationId);
      }
    }
  };

  useEffect(() => {
    const storedDate = localStorage.getItem('SelectedDate');
    if (storedDate) {
      const dateParts = storedDate.split('-');
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
      const day = parseInt(dateParts[0], 10);
      const parsedDate = new Date(year, month, day);
      parsedDate.setDate(parsedDate.getDate() + 1);
      setClickedDate(parsedDate);
    }
  }, []);

  return (
    <Box>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingTop: "2%",
            flexWrap: "wrap",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="outlined-basic-date-desk"
                label="Date"
                type="date"
                variant="outlined"
                value={
                  clickedDate ? clickedDate.toISOString().split("T")[0] : ""
                }
                onChange={(event) =>
                  setClickedDate(new Date(event.target.value))
                }
                sx={{ width: "100%", marginBottom: "8px" }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  style: { height: "10px" },
                  min: new Date().toISOString().split("T")[0],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Location"
                variant="outlined"
                value={selectedLocation}
                onChange={(event) => handleLocationChange(event.target.value)}
                sx={{
                  width: "100%",
                  marginBottom: "8px",
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{ style: { height: "43px", width: "250px" } }}
              >
                {locations.map((location) => (
                  <MenuItem
                    key={location.locationId}
                    value={location.locationCity}
                  >
                    {location.locationCity}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Autocomplete
                multiple
                value={selectedColleagues}
                onChange={(event, newValue) => setSelectedColleagues(newValue)}
                options={filteredUsers}
                getOptionLabel={(user) =>
                  `${user.userFirstName} ${user.userLastName}`
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Colleagues"
                    sx={{
                      width: "100%",
                      marginBottom: "8px",
                      "& input": {
                        padding: "6px",
                        fontSize: "12px",
                        height: '10px'
                      },
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.userFirstName}`}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}>
          <span style={{ fontWeight: 600, color: "black", fontSize: "15px" }}>
            Select Start & End Time{" "}
          </span>
        </Box>
        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            paddingTop: "8%",
            marginTop: "2%",
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          <Box sx={{ paddingTop: "5%" }}>
            <Slider
              value={timeRange}
              onChange={(_, newValue) => setTimeRange(newValue)}
              valueLabelDisplay="auto"
              valueLabelFormat={formatTime}
              marks={marks}
              min={0}
              max={15}
              aria-labelledby="range-slider"
              sx={{
                "& .MuiSlider-rail": {
                  height: "1px",
                  borderRadius: "5px",
                  background: "#ccc",
                },
                "& .MuiSlider-mark": {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "45px",
                  width: "1px",
                  backgroundColor: "#ccc",
                  top: "-7px",
                  marginTop: "-1px",
                },
                "& .MuiSlider-mark:last-child::after": {
                  display: "none",
                },
                "& .MuiSlider-track": {
                  height: "35px",
                  top: "-3px",
                  borderColor: "transparent",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  background: "#00D56E",
                  zIndex: "1",
                },
                "& .MuiSlider-thumb": {
                  width: "5px",
                  height: "15px",
                  borderRadius: "2px",
                  background: "#f2e5e5",
                  marginTop: "-2%",
                  boxShadow: "none",
                  zIndex: "1",
                },
                "& .MuiSlider-thumb:focus": {
                  boxShadow: "none",
                },
                "& .MuiSlider-thumb:hover": {
                  boxShadow: "none",
                },
                "& .MuiSlider-markLabel": {
                  transform: "translateY(-83px) translateX(-10px)",
                  fontSize: "12px",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "-3%",
              paddingBottom: "3%",
            }}
          >
            <span style={{ fontWeight: 300, color: "black", fontSize: "13px" }}>
              Time -{" "}
              <strong>
                {formatTimeToStandard(formatTime(timeRange[0]))} -{" "}
                {formatTimeToStandard(formatTime(timeRange[1]))}
              </strong>
            </span>
          </Box>
        </Box>
        <DialogActions>
          <Button onClick={handleDeskSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default DeskBookingDialog;