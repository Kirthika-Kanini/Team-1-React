import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { API_URL_EVENTS, Variable } from "../../../Variable";
import axios from "axios";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Button, CardActions } from "@mui/material";

const Events = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("Chennai");
  
    const getAllEvents = async () => {
      try {
        const response = await fetch(API_URL_EVENTS.APIURL);
        const data = await response.json();
        setAllEvents(data);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };
  
    const getAllLocations = async () => {
      try {
        const response = await axios.get(Variable.EVENT_LOCATION_URL);
        const data = response.data;
        setLocations(data);
      } catch (error) {
        console.log("Error fetching locations:", error);
      }
    };
  
    useEffect(() => {
      getAllLocations();
      getAllEvents();
    }, []);
  
    function formatTime(timeString) {
      const date = new Date(timeString);
      const options = { hour: "2-digit", minute: "2-digit" };
      const formattedTime = date.toLocaleTimeString("en-US", options);
      return formattedTime.toLocaleLowerCase();
    }
  
    function formatDate(dateString) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    }
  
    const handleLocationChange = (event) => {
        const newSelectedLocation = event.target.value;
        setSelectedLocation(newSelectedLocation);
      };
    
      const filteredEvents = selectedLocation
        ? allEvents.filter((event) => event.location.locationCity === selectedLocation)
        : allEvents;

  return (
    <section style={{ marginLeft: "5%", marginRight: "5%", marginTop: '2%' }}>
      <h3>Events</h3>
      <select
        style={{
          borderColor: "white",
          color: "gray",
          fontWeight: "500",
          marginTop: "1rem",
        }}
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        {locations.map((loc) => (
          <option key={loc.locationId} value={loc.locationCity}>
            {loc.locationCity}
          </option>
        ))}
      </select>
      <div className="carddiv mt-4">
        <div className="row mt-9" style={{ marginLeft: "-29px" }}>
        {filteredEvents.map((event) => (
                event.location.locationCity === selectedLocation) && (
                <div key={event.eventId} className="col-sm-6 col-md-4 col-lg-3">
                  <Card sx={{ maxWidth: 500, m: 2 }}>
                    <CardMedia
                      component="img"
                      alt="Conference Room"
                      height="140"
                      image={`https://localhost:7243/uploads/event/${event.eventImagePath}`}
                    />
                    <CardContent>
                      <div className="topmela">
                        <div>
                          <Typography
                            component="div"
                            sx={{
                              fontFamily: "Manrope",
                              fontWeight: 800,
                              color: "#1F2131",
                              fontSize: "16.5px",
                              lineHeight: "27px",
                            }}
                          >
                            {event.eventName}
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <Typography
                          sx={{
                            fontWeight: 400,
                            color: "#626D8A",
                            fontSize: "16px",
                            lineHeight: "22px",
                          }}
                        >
                          {formatDate(event.eventDate)},{" "}
                          {formatTime(event.eventStartTime)} -{" "}
                          {formatTime(event.eventEndTime)}
                        </Typography>
                      </div>
                    </CardContent>
                    <CardActions
                      style={{ marginBottom: "8px", marginLeft: "8px" }}
                    >
                      <Link to={`/eventdescription/${event.eventId}`}>
                        <Button variant="outlined">View event details</Button>
                      </Link>
                    </CardActions>
                  </Card>
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;