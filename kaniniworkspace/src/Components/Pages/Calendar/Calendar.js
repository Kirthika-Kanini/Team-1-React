import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@mui/material";
import axios from "axios";
import { Dialog, DialogTitle } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import DeskBookingDialog from "./DeskBookingDialog";
import RoomBookingDialog from "./RoomBookingDialog";

const localizer = momentLocalizer(moment);

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState(null);
  const [spaceType, setSpaceType] = useState("room");
  const [combinedBookings, setCombinedBookings] = useState([]);
  const [user_id, setUser_Id] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUser_Id(userId);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .get("https://localhost:7243/roombooking/GetAllRoomBookings")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (booking) => booking.users.userId === parseInt(userId)
        );
        const formattedEvents = filteredEvents.map((booking) => ({
          id: booking.roomBookingId,
          title: booking.roomMeetingDesc,
          start: new Date(
            booking.roomBookingDate + " " + booking.roomBookingStartTime
          ),
          end: new Date(
            booking.roomBookingDate + " " + booking.roomBookingEndTime
          ),
        }));

        setCombinedBookings((prevCombinedBookings) => [
          ...prevCombinedBookings,
          ...formattedEvents,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching room bookings:", error);
      });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    axios
      .get("https://localhost:7243/deskbooking/GetAllDeskBookings")
      .then((response) => {
        const filteredEvents = response.data.filter(
          (booking) => booking.users.userId === parseInt(userId)
        );
        const formattedEvents = filteredEvents.map((booking) => ({
          id: booking.deskBookingId,
          title: "Desk Booked",
          start: new Date(booking.deskBookingDate),
          end: new Date(booking.deskBookingDate),
        }));

        setCombinedBookings((prevCombinedBookings) => [
          ...prevCombinedBookings,
          ...formattedEvents,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching desk bookings:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7243/event/GetAllEventAndDescs")
      .then((response) => {
        const lastTwoEvents = response.data.slice(-2);
        setEvents(lastTwoEvents);
      })
      .catch((error) => {
        console.error("Error fetching Events:", error);
      });
  }, []);

  const isCurrentDate = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    return formattedDate.replace(/\//g, '-');
  };

  const handleSlotSelect = ({ start, end }) => {
    const formattedDate = formatDate(start);
    localStorage.setItem('SelectedDate', formattedDate)
    setClickedDate(start);
    openDialog();
  };

  return (
    <Box sx={{ m: "1%", marginLeft: "6%", marginRight: "6%", marginTop: "2%" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        <Grid item xs={12} sm={3}>
          <span style={{ fontWeight: 450, fontSize: "25px", color: "#333" }}>
            Calendar
          </span>
          <Box
            sx={{
              border: "2px solid #EAE9EA",
              borderRadius: "5px",
              padding: "3%",
              marginTop: "4%",
            }}
          >
            <Box sx={{ paddingLeft: "7%", paddingRight: "7%" }}>
              <Box
                sx={{
                  borderBottom: "2px solid #EAE9EA",
                  paddingBottom: "6%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Calendar
                  className="calendar"
                  calendarType="US"
                  tileClassName={({ date }) =>
                    isCurrentDate(date) ? "current" : null
                  }
                />
              </Box>
            </Box>
            <Box
              sx={{
                marginLeft: "7%",
                marginRight: "7%",
                paddingTop: "5%",
                width: "100%",
              }}
            >
              <Box style={{ fontWeight: 600, fontSize: "20px", color: "#333" }}>
                Events
              </Box>
              <Box
                style={{
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "grey",
                  paddingTop: "2px",
                }}
              >
                Today, {currentDate}
              </Box>
            </Box>
            <Box>
              {events.map((event) => (
                <Box
                  key={event.eventId}
                  sx={{
                    marginRight: "7%",
                    marginLeft: "7%",
                    padding: "5%",
                    marginTop: "7%",
                    borderRadius: "7px",
                    border: "2px solid #C5D3EE",
                    backgroundColor: "#F2F5FF",
                  }}
                >
                  <Box
                    style={{ fontWeight: 600, fontSize: "15px", color: "#333" }}
                  >
                    {event.eventName}
                  </Box>
                  <Box
                    style={{
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "grey",
                      marginTop: "2px",
                    }}
                  >
                    {new Date(event.eventStartTime).toLocaleTimeString()} -{" "}
                    {new Date(event.eventEndTime).toLocaleTimeString()}
                  </Box>
                  <Button
                    style={{
                      marginTop: "7%",
                      borderRadius: "7px",
                      border: "2px solid #EAE9EA",
                      textTransform: "capitalize",
                      fontWeight: "400",
                      fontSize: "10px",
                      color: "blue",
                      width: "40%",
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box sx={{ padding: "2%", height: "500px", marginTop: "3%" }}>
            <Box sx={{ height: "100%", width: "100%" }}>
              <BigCalendar
                localizer={localizer}
                events={combinedBookings}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "139%" }}
                selectable
                onSelectSlot={handleSlotSelect}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <style>{`
        /* Styles for the react-calendar */
        .calendar .react-calendar__navigation,
        .calendar .react-calendar__tile {
          border: none;
        }

        .react-calendar__tile--active:enabled:focus {
          background-color: #ccc;
          outline: none;
        }

        .calendar .react-calendar__tile--active {
          background-color: #ccc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: bold;
        }

        .react-calendar,
        .react-calendar *,
        .react-calendar *:before,
        .react-calendar *:after {
          border: none;
          margin-bottom: '5%'
        }

        .calendar .react-calendar__tile--hasActive {
          background-color: #eee;
        }

        .calendar .current {
          background-color: #007bff;
          color: #fff;
          border-radius: 50%;
        }

        .react-calendar button:enabled:hover {
          cursor: pointer;
          background-color: #eee;
          color: #333;
        }

        .calendar-grid-square {
          height: 100%;
          width: 100%;
          grid-template-columns: repeat(7, 1fr);
          border-collapse: collapse;
        }

        .calendar-grid-square .react-calendar_month-view .react-calendarmonth-viewdays .react-calendar_tile,
        .calendar-grid-square .react-calendar_year-view .react-calendaryear-viewmonths .react-calendar_tile,
        .calendar-grid-square .react-calendar_decade-view .react-calendardecade-viewyears .react-calendar_tile,
        .calendar-grid-square .react-calendar_century-view .react-calendarcentury-viewdecades .react-calendar_tile {
          padding: 0;
          height: 90px;
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #EAE9EA;
        }

        .rbc-toolbar{
          border: 2px solid #EAE9EA;
          padding: 10px;
          border-radius: 5px;
        }

        .css-1jhdk57-MuiGrid-root>.MuiGrid-item{
          padding-left: 0px;
          padding-right: 0px;
        }

        .rbc-toolbar button:active:hover, 
        .rbc-toolbar button:active:focus, 
        .rbc-toolbar button.rbc-active:hover, 
        .rbc-toolbar button.rbc-active:focus{
          background-color: #5162F6;
          color: white;
        }

        .rbc-toolbar button{
          border-radius: 5px;
          border: 1px solid #BDC0C3;
        }

      `}</style>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "800px",
            },
          },
        }}
      >
        <DialogTitle>Book Room</DialogTitle>
        <Box sx={{ marginLeft: "2%" }}>
          <Button onClick={() => setSpaceType("room")}>Room</Button>
          <Button onClick={() => setSpaceType("desk")}>Desk</Button>
        </Box>
        {spaceType === "room" && <RoomBookingDialog />}
        {spaceType === "desk" && <DeskBookingDialog />}
      </Dialog>

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

export default CalendarComponent;
