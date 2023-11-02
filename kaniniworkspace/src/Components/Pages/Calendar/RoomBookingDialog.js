import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Slider, Button, TextField } from "@mui/material";
import axios from "axios";
import { DialogContent, DialogActions } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import emailjs from "emailjs-com";

function RoomBookingDialog() {
  const [locationValue, setLocationValue] = useState("");
  const [timeRange, setTimeRange] = useState([9, 17]);
  const [roomValue, setRoomValue] = useState(0);
  const [user_id, setUser_Id] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [clickedDate, setClickedDate] = useState(null);

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

  const formatTime = (value) => {
    const hours = String(value + 7).padStart(2, "0");
    return `${hours} hrs`;
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
    fetchAllRooms();
    const userId = localStorage.getItem("userId");
    setUser_Id(userId);
  }, []);

  const fetchAllRooms = async () => {
    try {
      const response = await fetch("https://localhost:7243/room/GetAllRooms");
      const responseBody = await response.json();

      if (response.ok) {
        setAllRooms(responseBody);
      } else {
        const errorMessage = responseBody.errorMessage;
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [existingBookings, setExistingBookings] = useState([]);

  const fetchRoom = async (roomValue) => {
    try {
      const user_id = localStorage.getItem("userId");
      setUser_Id(user_id);

      const responseRoom = await fetch(
        `https://localhost:7243/room/GetRoomById/${roomValue}`
      );
      const roomDetails = await responseRoom.json();
      console.log(roomDetails.location.locationCity)

      setTotalRoomCapacity(roomDetails.roomCapacity);
      const responseBookings = await fetch(
        `https://localhost:7243/roombooking/GetAllRoomBookings?roomId=${roomValue}`
      );
      const existingBookings = await responseBookings.json();

      if (responseRoom.ok) {
        setRooms([roomDetails]);
        setExistingBookings(existingBookings);
      } else {
        alert("Room not found");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRoomSubmit = async () => {
    try {
      const descriptionField = document.querySelector("#outlined-basic");
      const dateField = document.querySelector("#outlined-basic-date");
      const location = locationValue;
      const room = roomValue;
      const employeesField = document.querySelector(
        "#input-with-icon-adornment"
      );
      const user_id = localStorage.getItem("userId");
      const description = descriptionField?.value;
      const date = dateField?.value;
      const employees = employeesField?.value;

      const bookingData = {
        roomMeetingDesc: description,
        roomBookingEmployeeCount: parseInt(employees, 10),
        roomBookingDate: date,
        roomBookingStartTime: formatTimeToStandard(formatTime(timeRange[0])),
        roomBookingEndTime: formatTimeToStandard(formatTime(timeRange[1])),
        location: {
          locationId: parseInt(location),
        },
        users: {
          userId: parseInt(user_id, 10),
        },
        rooms: {
          roomId: parseInt(roomValue, 10),
        },
      };

      const startTime = new Date(
        `${date} ${formatTimeToStandard(formatTime(timeRange[0]))}`
      );
      const endTime = new Date(
        `${date} ${formatTimeToStandard(formatTime(timeRange[1]))}`
      );
      const conflictingBooking = existingBookings.find((existingBooking) => {
        const existingStartTime = new Date(
          `${existingBooking.roomBookingDate} ${existingBooking.roomBookingStartTime}`
        );
        const existingEndTime = new Date(
          `${existingBooking.roomBookingDate} ${existingBooking.roomBookingEndTime}`
        );

        if (existingBooking.rooms.roomId === parseInt(roomValue, 10)) {
          return (
            (startTime >= existingStartTime && startTime < existingEndTime) || // New booking starts within existing booking
            (endTime > existingStartTime && endTime <= existingEndTime) || // New booking ends within existing booking
            (startTime <= existingStartTime && endTime >= existingEndTime) // New booking fully encompasses existing booking
          );
        }
        return false;
      });

      if (conflictingBooking) {
        displaySnackbar("Time slot is already booked", "error");
        return;
      }

      const response = await axios.post(
        "https://localhost:7243/roombooking/PostRoomBooking",
        bookingData
      );
      if (response) {
        displaySnackbar("Booking Successful", "success");
        descriptionField.value = "";
        dateField.value = "";
        employeesField.value = "";
        const contentBody = `Meeting Description:${bookingData.roomMeetingDesc}
         Meeting Date:${bookingData.roomBookingDate}
         Meeting StartTime:${bookingData.roomBookingStartTime}
         Metting EndTime:${bookingData.roomBookingEndTime}
        `;
        sendEmailWithUserEmail(contentBody);
      } else {
        displaySnackbar("Booking Failed please try again", "error");
      }
    } catch (error) {
      displaySnackbar("Booking Failed please try again later", "error");
    }

    function sendEmailWithUserEmail(contentBody) {
      const UserEmail = localStorage.getItem("userEmail");

      if (UserEmail) {
        const templateParams = {
          to_name: "User",
          from_name: "Kirthika",
          message: `Thanks for booking ${contentBody}`,
          to_email: UserEmail,
        };

        emailjs
          .send(
            "hotelmanagament_service",
            "template_agfnema",
            templateParams,
            "y9Jw_fUJNpRrdMxQC"
          )
          .then((response) => {
            displaySnackbar(
              "Check your Inbox for booking information",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      } else {
        console.error("User email not found in storage.");
      }
    }
  };

  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;
    setRoomValue(selectedLocation);
    fetchRoom(selectedLocation);
  };

  useEffect(() => {
    const storedDate = localStorage.getItem('SelectedDate');
    if (storedDate) {
      const dateParts = storedDate.split('-');
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[0], 10);
      const parsedDate = new Date(year, month, day);
      parsedDate.setDate(parsedDate.getDate() + 1);
      setClickedDate(parsedDate);
    }
  }, []);

    const [totalRoomCapacity, setTotalRoomCapacity] = useState(3)
    const [inputValueEmployee, setInputValueEmployee] = useState('');
    const [inputValueDescription, setInputValueDescription] = useState('');
    const [errorTextEmployee, setErrorTextEmployee] = useState('');
    const [errorTextDescription, setErrorTextDescription] = useState('');

    const handleEmployeeInputChange = (event) => {
        const text = event.target.value;
        setInputValueEmployee(text);

        if (text > totalRoomCapacity) {
            setErrorTextEmployee('Room Capacity should not exceed more than ' + totalRoomCapacity);
        } else {
            setErrorTextEmployee('');
        }
    };

    const handleDescriptionInputChange = (event) => {
        const text = event.target.value;
        setInputValueDescription(text);

        if (text.length < 5 || text.length > 50) {
            setErrorTextDescription('Description should be between 5 to 50 characters');
          } else {
            setErrorTextDescription('');
          }
    };

  return (
    <Box>
      <DialogContent>
        <Box sx={{ marginTop: "5%" }}>
          <TextField
            select
            id="location-selector-from-dropdown"
            label="Room"
            variant="outlined"
            value={roomValue}
            onChange={handleLocationChange}
            sx={{ width: "50%", marginBottom: "8px" }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon />
                </InputAdornment>
              ),
            }}
            SelectProps={{ style: { height: "43px" } }}
          >
            {allRooms.map((room) => (
              <MenuItem key={room.roomId} value={room.roomId}>
                {room.roomName}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}>
            <TextField
              id="outlined-basic"
              label="Description"
              onChange={handleDescriptionInputChange}
              variant="outlined"
              sx={{ width: "100%", paddingY: "5px" }}
              inputProps={{ style: { height: "10px" } }}
              error={errorTextDescription.length > 0}
              helperText={errorTextDescription}
            />
          </Box>
        </Box>
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
                id="outlined-basic-date"
                label="Date"
                type="date"
                variant="outlined"
                sx={{ width: "100%", marginBottom: "8px" }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  style: { height: "10px" },
                  min: new Date().toISOString().split("T")[0],
                }}
                value={
                  clickedDate ? clickedDate.toISOString().split("T")[0] : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                id="location-selector"
                label="Location"
                variant="outlined"
                value={locationValue}
                onChange={(event) => {
                  setLocationValue(event.target.value);
                  setRoomValue(event.target.value);
                }}
                sx={{ width: "100%", marginBottom: "8px" }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{ style: { height: "43px" } }}
              >
                <MenuItem value="1">Chennai</MenuItem>
                <MenuItem value="2">Coimbatore</MenuItem>
                <MenuItem value="3">Bangalore</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="input-with-icon-adornment"
                label="Employees"
                variant="outlined"
                onChange={handleEmployeeInputChange}
                sx={{ width: "100%", marginBottom: "8px" }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ style: { height: "10px" } }}
                error={errorTextEmployee.length > 0}
                helperText={errorTextEmployee}
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
          <Button onClick={handleRoomSubmit} color="primary">
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

export default RoomBookingDialog;
