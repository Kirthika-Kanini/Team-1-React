import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Slider, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import capacityicon from "../../../../Assets/RoomBooking/capacityicon.png";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import emailjs from "emailjs-com";
import MuiAlert from "@mui/material/Alert";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const buttonStyle = {
  backgroundColor: "#5162F6",
  color: "#ffffff",
  fontWeight: "normal",
  textTransform: "none",
  width: "15%",
};

const buttonStyleCancel = {
  backgroundColor: "transparent",
  color: "black",
  boxShadow: "none",
  textTransform: "none",
  width: "10%",
};

const UpdateBookings = () => {
  const { roomId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [booking, setbooking] = useState({});
  const [timeRange, setTimeRange] = useState([9, 17]);
  const [user_id, setUser_id] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const navigate= useNavigate()
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

  useEffect(() => {
    fetchBooking();
  }, []);

  const formatTimeToStandard = (value) => {
    const timeParts = value.split(" "); // Split "15 hrs" into parts
    const hours = parseInt(timeParts[0], 10);
    const isPM = hours >= 12;
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    console.log(timeParts[0]);
    let minutes = "00";

    // Check if the hours part contains ".5"
    if (timeParts[0].includes(".5")) {
      minutes = "30";
    }
    const period = isPM ? "PM" : "AM";

    return `${formattedHours}:${minutes} ${period}`;
  };

  const [totalRoomCapacity, setTotalRoomCapacity] = useState(3)

  const handleBooking = async () => {
    try {
      // Gather form values
      const description = document.querySelector("#outlined-basic")?.value;
      const date = document.querySelector("#outlined-basic-date")?.value;
      const employees = document.querySelector(
        "#input-with-icon-adornment"
      )?.value;

      const bookingData = {
        roomBookingId: roomId,
        roomMeetingDesc: description,
        roomBookingEmployeeCount: parseInt(employees, 10),
        roomBookingDate: date,
        roomBookingStartTime: formatTimeToStandard(formatTime(timeRange[0])),
        roomBookingEndTime: formatTimeToStandard(formatTime(timeRange[1])),
      };

      console.log("Booking Data:", bookingData);
      const existingBookingsResponse = await axios.get(
        `https://localhost:7243/roombooking/GetAllRoomBookings?roomId=${roomId}`
      );
      const existingBookings = existingBookingsResponse.data;

      const conflictingBooking = existingBookings.find((existingBooking) => {
        const existingStartTime = new Date(
          `${existingBooking.roomBookingDate} ${existingBooking.roomBookingStartTime}`
        );
        const existingEndTime = new Date(
          `${existingBooking.roomBookingDate} ${existingBooking.roomBookingEndTime}`
        );
        const selectedStartTime = new Date(
          `${date} ${formatTimeToStandard(formatTime(timeRange[0]))}`
        );
        const selectedEndTime = new Date(
          `${date} ${formatTimeToStandard(formatTime(timeRange[1]))}`
        );

        return (
          existingBooking.roomBookingDate === date &&
          ((selectedStartTime >= existingStartTime &&
            selectedStartTime < existingEndTime) ||
            (selectedEndTime > existingStartTime &&
              selectedEndTime <= existingEndTime))
        );
      });

      if (conflictingBooking) {
        displaySnackbar(
          "Booking Conflict: Room already booked for the selected time.",
          "error"
        );
        return;
      }
      const response = axios.put(
        "https://localhost:7243/roombooking/PutRoomBooking/" + roomId,
        bookingData
      );
      if (response) {
        displaySnackbar("Updated Successfully", "success");
        const contentBody = `Meeting Description:${bookingData.roomMeetingDesc}
             Meeting Date:${bookingData.roomBookingDate}
             Meeting StartTime:${bookingData.roomBookingStartTime}
             Metting EndTime:${bookingData.roomBookingEndTime}
            `;
        console.log("Updated Successfully");
        sendEmailWithUserEmail(contentBody);
        setTimeout(() => {
            navigate('/yourbooking');
        }, 2000);
        
      } else {
        displaySnackbar("Booking Failed please try again", "error");
        console.error("Booking Failed:", response.data);
      }
    } catch (error) {
      displaySnackbar("Booking Failed please try again later", "error");
      console.error("Error:", error);
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

        //console.log(templateParams);

        emailjs
          .send(
            "hotelmanagament_service",
            "template_agfnema",
            templateParams,
            "y9Jw_fUJNpRrdMxQC"
          )
          .then((response) => {
            console.log("Email sent successfully:", response);
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      } else {
        console.error("User email not found in storage.");
      }
    }
  };

  const fetchBooking = async () => {
    try {
      const user_id = localStorage.getItem("userId");
      setUser_id(user_id);
      const response = await fetch(
        "https://localhost:7243/roombooking/GetAllRoomBookings"
      );
      const responseBody = await response.json();
      if (response.ok) {
        // Filter the rooms based on the roomId
        const filteredRooms = responseBody.filter(
          (room) => room.roomBookingId === parseInt(roomId, 10)
        );

        if (filteredRooms.length > 0) {
          // Set the rooms using the filtered data
          setRooms(filteredRooms);
          setbooking(responseBody);
          setTotalRoomCapacity(filteredRooms[0].rooms.roomCapacity)
        } else {
          alert("Booking not found"); // Display an alert if the room with roomId is not found
        }
      } else {
        const errorMessage = responseBody.errorMessage;
        alert("Error: " + errorMessage); // Display the errorMessage value in the alert
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [inputValueEmployee, setInputValueEmployee] = useState('');
    const [inputValueDescription, setInputValueDescription] = useState('');
    const [errorTextEmployee, setErrorTextEmployee] = useState('');
    const [errorTextDescription, setErrorTextDescription] = useState('');

    const handleEmployeeInputChange = (event) => {
        const text = event.target.value;
        setInputValueEmployee(text);

        if (text > totalRoomCapacity) {
            setErrorTextEmployee('Room Capacity Exceeded');
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
    <Box sx={{ m: "1%", marginLeft: "6%", marginRight: "6%" }}>
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
      {rooms.map((room) => (
        <Grid container spacing={5} key={room.roomId}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span
                style={{ fontWeight: 450, color: "grey", fontSize: "20px" }}
              >
                Conference Room:{" "}
              </span>
              <span style={{ fontWeight: 450, fontSize: "20px" }}>
                &nbsp;{room.roomName}
              </span>
            </Box>
            <Box
              sx={{
                marginTop: "1rem",
                width: "80%",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ borderRight: "1px solid #ccc", padding: "1%" }}
                >
                  <Item sx={{ boxShadow: "none" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={capacityicon}
                        style={{ width: "14%", marginRight: "0.5rem" }}
                        alt="Capacity Icon"
                      />
                      <div>
                        <span style={{ fontSize: "10px", color: "grey" }}>
                          Capacity:
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "black",
                            fontWeight: "600",
                            display: "block",
                          }}
                        >
                          {room.rooms.roomCapacity} People
                        </span>
                      </div>
                    </div>
                  </Item>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{ borderRight: "1px solid #ccc", padding: "1%" }}
                >
                  <Item sx={{ boxShadow: "none" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={capacityicon}
                        style={{ width: "14%", marginRight: "0.5rem" }}
                        alt="Capacity Icon"
                      />
                      <div>
                        <span style={{ fontSize: "10px", color: "grey" }}>
                          Presentation:
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "black",
                            fontWeight: "600",
                            display: "block",
                          }}
                        >
                          32 inch {room.rooms.presentation}
                        </span>
                      </div>
                    </div>
                  </Item>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ padding: "1%" }}>
                  <Item sx={{ boxShadow: "none" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={capacityicon}
                        style={{ width: "14%", marginRight: "0.5rem" }}
                        alt="Capacity Icon"
                      />
                      <div>
                        <span style={{ fontSize: "10px", color: "grey" }}>
                          Additional:
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "black",
                            fontWeight: "600",
                            display: "block",
                          }}
                        >
                          {room.rooms.additional}
                        </span>
                      </div>
                    </div>
                  </Item>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}
            >
              <span
                style={{ fontWeight: 600, color: "black", fontSize: "15px" }}
              >
                Meeting Name{" "}
              </span>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}
            >
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                onChange={handleDescriptionInputChange}
                defaultValue={room.roomMeetingDesc}
                sx={{ width: "100%", paddingY: "5px" }}
                inputProps={{ style: { height: "10px" } }}
                error={errorTextDescription.length > 0}
                helperText={errorTextDescription}
              />
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}
            >
              <span
                style={{ fontWeight: 600, color: "black", fontSize: "15px" }}
              >
                Book Slot{" "}
              </span>
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
                    defaultValue={room.roomBookingDate}
                    variant="outlined"
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
                    id="location-selector"
                    label="Location"
                    disabled
                    variant="outlined"
                    defaultValue={room.location.locationId}
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
                    onChange={handleEmployeeInputChange}
                    name="roomBookingEmployeeCount"
                    defaultValue={room.roomBookingEmployeeCount}
                    variant="outlined"
                    sx={{ width: "100%", marginBottom: "8px" }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ style: { height: '10px' } }}
                    error={errorTextEmployee.length > 0}
                    helperText={errorTextEmployee}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}
            >
              <span
                style={{ fontWeight: 600, color: "black", fontSize: "15px" }}
              >
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
              <Slider
                value={timeRange}
                onChange={(_, newValue) => setTimeRange(newValue)}
                valueLabelDisplay="auto"
                valueLabelFormat={formatTime}
                step={0.5}
                marks={marks}
                min={0}
                max={15.5}
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
                    "&::before": {
                      content: "''",
                      display: "block",
                      position: "absolute",
                      left: "50%",
                      bottom: "0",
                      transform: "translateX(2600%)",
                      width: "1px",
                      height: "20px",
                      backgroundColor: "#ccc",
                    },
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-3%",
                  paddingBottom: "3%",
                }}
              >
                <span
                  style={{ fontWeight: 300, color: "black", fontSize: "13px" }}
                >
                  Time -{" "}
                  <strong>
                    {formatTimeToStandard(formatTime(timeRange[0]))} -{" "}
                    {formatTimeToStandard(formatTime(timeRange[1]))}
                  </strong>
                </span>
              </Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", paddingTop: "2%" }}
            >
              <Button
                variant="contained"
                style={buttonStyle}
                onClick={handleBooking}
              >
                Update
              </Button>
              <Link to={"/yourbooking"}>
                <Button variant="contained" style={buttonStyleCancel}>
                  Cancel
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ padding: "2%", width: "100%" }}>
              <img
                src={`https://localhost:7243/uploads/room/${room.rooms.roomImagePath}`}
                alt="Room Image3"
                style={{
                  height: "600px",
                  width: "400px",
                  borderRadius: "15px",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default UpdateBookings;