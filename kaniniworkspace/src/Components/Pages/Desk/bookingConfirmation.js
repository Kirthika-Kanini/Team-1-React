import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import closeicon from "../../../Assets/Desk/closeicon.svg";
import success from "../../../Assets/Desk/sucess.gif";
import logo from "../../../Assets/Desk/logo.png";
import location from "../../../Assets/Desk/location.png";
import calendar from "../../../Assets/Desk/calander.png";
import people from "../../../Assets/Desk/people.png";
import clock from "../../../Assets/Desk/clock.png";

function formatTime(value) {
  const meridiem = value >= 12 ? "pm" : "am";
  let hours = Math.floor(value % 12);
  if (hours === 0) hours = 12;
  const minutes = String(Math.floor((value % 1) * 60)).padStart(2, "0");
  const formattedTime = `${hours}:${minutes} ${meridiem}`;
  return formattedTime;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
}

function BookingConfirmation({
  open,
  onClose,
  bookingId,
  selectedLocation,
  selectedColleagues,
  selectedDate,
  timeRange,
  handleContinue,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 4,
        }}
      >
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <img src={closeicon} alt="Close" />
        </IconButton>
        <Box>
          <img
            src={success}
            style={{ width: "120px", height: "90px", marginLeft: "32%" }}
            alt="Success"
          ></img>
          <Typography
            variant="h5"
            style={{
              marginTop: "1rem",
              fontSize: "24px",
              fontWeight: "strong",
              display: "flex",
              justifyContent: "center",
            }}
          >
            You’ve successfully booked a desk
          </Typography>
          <Box
            style={{
              marginTop: "1rem",
              display: "flex",
              marginLeft: "28%",
              gap: "8px",
            }}
          >
            <img src={logo} alt="Logo" />
            <Typography style={{ marginTop: "4px" }}>Booking id</Typography>
            <Typography style={{ fontWeight: "700", marginTop: "4px" }}>
              {bookingId}
            </Typography>
          </Box>
          <Box
            style={{
              display: "grid",
              marginTop: "1rem",
              gridTemplateColumns: "repeat(8, auto)",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <img
              src={location}
              alt="Location"
              style={{ marginRight: "15px" }}
            />
            <Typography sx={{ fontSize: "12px", marginLeft: "-20px" }}>
              {selectedLocation}
            </Typography>
            <img src={people} alt="People" style={{ marginRight: "15px" }} />
            <Typography sx={{ fontSize: "12px", marginLeft: "-20px" }}>
              {selectedColleagues.length + 1}{" "}
              {selectedColleagues.length === 0 ? "person" : "people"}
            </Typography>
            <img
              src={calendar}
              alt="Calendar"
              style={{ marginRight: "15px" }}
            />
            <Typography sx={{ fontSize: "12px", marginLeft: "-20px" }}>
              {formatDate(selectedDate)}
            </Typography>
            <img src={clock} alt="Clock" style={{ marginRight: "15px" }} />
            <Typography sx={{ fontSize: "12px", marginLeft: "-20px" }}>
              {formatTime(timeRange[0])} - {formatTime(timeRange[1])}
            </Typography>
          </Box>
          <form>
            <Button
              onClick={handleContinue}
              type="submit"
              style={{
                width: "170px",
                cursor: "pointer",
                height: "30px",
                marginTop: "10%",
                marginLeft: "27%",
                color: "white",
                backgroundColor: "#5162F6",
                border: "1px solid transparent",
                borderRadius: "4px",
              }}
            >
              Continue
            </Button>
          </form>
        </Box>
      </Box>
    </Modal>
  );
}

export default BookingConfirmation;