// DESK

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Slider, Button, MenuItem, TextField, Box, Typography, IconButton, Grid, FormControl, Select, InputLabel, Chip } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import plus from "../../../Assets/Desk/plus.svg";
import side from "../../../Assets/Desk/side.png";
import location from "../../../Assets/Desk/location.png";
import BookingConfirmation from "./bookingConfirmation";
import AddColleagues from "./addColleague";
import emailjs from "emailjs-com";

const Desk_Page = "https://localhost:7243/desk";
const Desk_Booking_Page = "https://localhost:7243/deskbooking";
const USER_BASE_URL = "https://localhost:7243/userprofile";

export default function Desk() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [desks, setDesks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeRange, setTimeRange] = useState([12, 18]);
  const [selectedColleagues, setSelectedColleagues] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [availableDesksPerLocation, setAvailableDesksPerLocation] = useState({});
  const [modelColleague, setSelectedColleague] = useState(null);
  const [showColleague, setShowColleague] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const navigate = useNavigate();

  const handleAddSelectedColleague = () => {
    if (modelColleague) {
      const name = `${modelColleague.userFirstName} ${modelColleague.userLastName}`;
      if (!selectedColleagues.includes(name)) {
        setSelectedColleagues([...selectedColleagues, name]);
      }
      setSelectedColleague(null);
    }
  };

  const closeModal = () => {
    setShowColleague(false);
    setShowBook(false);
  };

  const handleContinue = () => {
    navigate("/yourbooking");
  };

  const handleDateChange = (event) => {
    const newSelectedDate = event.target.value;
    setSelectedDate(newSelectedDate);
    const firstMarkValue = marks[0].value;
    const lastMarkValue = marks[marks.length - 1].value;
    setTimeRange([firstMarkValue, lastMarkValue]);
  };

  const handleRemoveColleague = (indexToRemove, colleagueName) => {
    const updatedColleagues = selectedColleagues.filter(
      (_, index) => index !== indexToRemove
    );
    setSelectedColleagues(updatedColleagues);
    setSelectedColleagues((prevColleagues) =>
      prevColleagues.filter((name) => name !== colleagueName)
    );
  };

  const handleColleague = () => {
    setShowColleague(true);
  };

  const handleLocationChange = (newValue) => {
    if (newValue) {
      setSelectedLocation(newValue);
      const selectedLocationObj = locations.find(
        (location) => location.locationCity === newValue
      );
      if (selectedLocationObj) {
        setSelectedLocationId(selectedLocationObj.locationId);
      }
    }
  };

  const token = localStorage.getItem("token");
  let userEmail = "";
  let userName = "";
  if (token) {
    const payload = token.split(".")[1];
    try {
      const decodedTokenPayload = atob(payload);
      const tokenPayloadObject = JSON.parse(decodedTokenPayload);
      userEmail = tokenPayloadObject.UserEmail;
      userName = tokenPayloadObject.UserFirstName;
    } catch (error) {
      console.error("Error decoding JWT payload:", error);
    }
  }

  const sendEmailConfirmation = (userFirstName, userLastName) => {
    const serviceId = "service_hnqpjbs";
    const templateId = "template_emblk6a";
    const userId = "KN9eOAunFcLPvVz7f";
    const emailContent = {
      to_email: userEmail,
      to_name: `${userFirstName} ${userLastName}`,
      subject: "Desk Booking Confirmation",
      message: `Your desk booking has been confirmed.`,
      location: ` ${selectedLocation}`,
      date: `${selectedDate}`,
      time: ` ${formatTime(timeRange[0])} - ${formatTime(timeRange[1])}`,
      colleagues: `${selectedColleagues.join(", ")}`,
    };
    emailjs
      .send(serviceId, templateId, emailContent, userId)
      .then((response) => {})
      .catch((error) => {
        console.error("Email error:", error);
      });
  };

  const handleSubmitBooking = (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const randomDesk = Math.floor(Math.random() * desks.length) + 1;
    const newDeskBooking = {
      deskBookingDate: selectedDate,
      deskBookingColleague: selectedColleagues.join(", "),
      desks: { deskId: randomDesk },
      location: { locationId: selectedLocationId },
      users: { userId: parseInt(userId) },
    };
    axios
      .post(`${Desk_Booking_Page}/PostDeskBooking`, newDeskBooking)
      .then((response) => {
        setBookingId(response.data.deskBookingId);
        setShowBook(true);
        axios
          .get(`${USER_BASE_URL}/GetUserById/${userId}`)
          .then((response) => {
            const userFirstName = response.data.userFirstName;
            const userLastName = response.data.userLastName;
            sendEmailConfirmation(userFirstName, userLastName);
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
          });
      })
      .catch((error) => {
        console.error("Error creating desk booking:", error);
      });
    closeModal();
  };

  function formatTime(value) {
    const meridiem = value >= 12 ? "pm" : "am";
    let hours = Math.floor(value % 12);
    if (hours === 0) hours = 12;
    const minutes = String(Math.floor((value % 1) * 60)).padStart(2, "0");
    const formattedTime = `${hours}:${minutes} ${meridiem}`;
    return formattedTime;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsResponse, usersResponse, desksResponse] =
          await Promise.all([
            axios.get(`https://localhost:7243/location/GetAllLocations`),
            axios.get(`${USER_BASE_URL}/GetAllUsers`),
            axios.get(`${Desk_Page}/GetAllDesks`),
          ]);
        setLocations(locationsResponse.data);
        setFilteredUsers(usersResponse.data);
        setDesks(desksResponse.data);
        if (selectedLocationId) {
          const [bookingResponse, desksForSelectedLocationResponse] =
            await Promise.all([
              axios.get(`${Desk_Booking_Page}/GetAllDeskBookings`),
              axios.get(`${Desk_Page}/GetAllDesks`),
            ]);
          const desksForSelectedLocation =
            desksForSelectedLocationResponse.data.filter(
              (desk) => desk.location.locationId === selectedLocationId
            );
          setDesks(desksForSelectedLocation);
          const totalCount = desksForSelectedLocation.length;
          setAvailableDesksPerLocation((prevState) => ({
            ...prevState,
            [selectedLocation]: totalCount,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedLocationId, selectedLocation, selectedDate]);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 15);

  const marks = [
    { value: 7, label: "7 am" },
    { value: 8, label: "8 am" },
    { value: 9, label: "9 am" },
    { value: 10, label: "10 am" },
    { value: 11, label: "11 am" },
    { value: 12, label: "12 pm" },
    { value: 13, label: "1 pm" },
    { value: 14, label: "2 pm" },
    { value: 15, label: "3 pm" },
    { value: 16, label: "4 pm" },
    { value: 17, label: "5 pm" },
    { value: 18, label: "6 pm" },
    { value: 19, label: "7 pm" },
    { value: 20, label: "8 pm" },
    { value: 21, label: "9 pm" },
    { value: 22, label: "10 pm" },
  ];

  return (
    <Box
      style={{ fontFamily: "Manrope, sans-serif" }}
      sx={{ marginRight: "5%", marginLeft: "5%", marginTop: "2%" }}
    >
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7.5}>
            <Box>
              <Typography variant="h3" sx={{ fontSize: "28px" }}>
                Book a desk
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  marginTop: "15px",
                  color: "var(--secondary-gray, #626D8A)",
                  fontSize: "20px",
                }}
              >
                Book a desk for the day to use in the common area of any kanini
                location
              </Typography>
              <br />
              <Box sx={{ paddingTop: "2%", marginBottom: "1.5rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Location</InputLabel>
                      <Select
                        value={selectedLocation}
                        onChange={(event) =>
                          handleLocationChange(event.target.value)
                        }
                        label="Location"
                        sx={{ height: "40px" }}
                        startAdornment={
                          <InputAdornment position="start">
                            <img src={location} alt="Location" />
                          </InputAdornment>
                        }
                      >
                        {locations.map((location) => (
                          <MenuItem
                            key={location.locationId}
                            value={location.locationCity}
                          >
                            {location.locationCity}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

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
                        max: currentDate.toISOString().split("T")[0],
                      }}
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sm={10}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        paddingTop: "2%",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "black",
                          fontSize: "15px",
                          fontFamily: "Manrope, sans-serif",
                        }}
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
                        min={7}
                        max={22.5}
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
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Grid item xs={12} sm={12}>
                <table>
                  <tbody>
                    {selectedColleagues.map((colleague, index) => {
                      const [firstName, lastName] = colleague.split(" ");
                      const user = filteredUsers.find(
                        (user) =>
                          `${user.userFirstName} ${user.userLastName}` ===
                          colleague
                      );
                      return (
                        <tr key={index}>
                          <td>
                            <Chip
                              avatar={
                                <img
                                  src={`https://localhost:7243/uploads/user/${user.userImagePath}`}
                                  alt="Profile"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                  }}
                                />
                              }
                              label={`${firstName} ${lastName}`}
                              onDelete={() => handleRemoveColleague(index)}
                              sx={{
                                backgroundColor: "#B6D0E2",
                                borderRadius: "8px",
                                marginRight: "8px",
                                marginBottom: "8px",
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    <Grid container alignItems="center">
                      <Grid item xs={true} sm={true}>
                        <IconButton
                          onClick={handleColleague}
                          sx={{
                            cursor: "pointer",
                            padding: "4px",
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <img src={plus} alt="plus" />
                        </IconButton>
                        {selectedColleagues.length === 0 && (
                          <Button
                            onClick={handleColleague}
                            sx={{
                              cursor: "pointer",
                              fontSize: "17px",
                              color: "var(--primary-black, #1F2131)",
                              "&:hover": {
                                backgroundColor: "transparent",
                              },
                              marginLeft: "8px",
                            }}
                          >
                            Add Colleagues
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </tbody>
                </table>
              </Grid>

              <Button
                onClick={handleSubmitBooking}
                style={{
                  backgroundColor: "#4169E1",
                  width: "133px",
                  fontSize: "16px",
                  padding: "5px",
                  color: "white",
                  borderRadius: "4px",
                  marginTop: "3rem",
                  textTransform: "capitalize",
                }}
              >
                Book a desk
              </Button>
              <Typography sx={{ marginTop: "0.5rem" }}>
                {desks.length !== undefined
                  ? `${desks.length} desks available`
                  : "No desks available"}
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4.5}
            sx={{ "@media (max-width: 955px)": { display: "none" } }}
          >
            <Box>
              <img src={side} style={{ maxWidth: "30rem" }} alt="side" />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <AddColleagues
        open={showColleague}
        onClose={closeModal}
        selectedColleague={modelColleague}
        setSelectedColleague={setSelectedColleague}
        filteredUsers={filteredUsers}
        selectedColleagues={selectedColleagues}
        handleAddSelectedColleague={handleAddSelectedColleague}
        handleRemoveColleague={handleRemoveColleague}
      />

      <BookingConfirmation
        open={showBook}
        onClose={closeModal}
        bookingId={bookingId}
        selectedLocation={selectedLocation}
        selectedColleagues={selectedColleagues}
        selectedDate={selectedDate}
        timeRange={timeRange}
        handleContinue={handleContinue}
      />
    </Box>
  );
}