import React, { useEffect, useState } from 'react'
import topimg from '../../../Assets/HomePage/topimghome.png'
import calendor from '../../../Assets/HomePage/calendor.svg'
import room from '../../../Assets/HomePage/room.svg'
import desk from '../../../Assets/HomePage/desk.svg'
import leftarrow from '../../../Assets/HomePage/left-arrow.svg'
import rightarrow from '../../../Assets/HomePage/right-arrow.svg'
import datecalendar from '../../../Assets/HomePage/datecalendor.svg'
import logo from '../../../Assets/HomePage/logo.svg'
import { Box, positions } from '@mui/system'
import { Grid, Typography } from '@mui/material'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, CardActions } from "@mui/material";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import downarrow from '../../../Assets/HomePage/downarrow.svg'

export default function HomepageNew() {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, []);

  useEffect(() => {
    axios.get(`https://localhost:7243/userprofile/GetUserById/${userId}`)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [userId]);

  const [rooms, setRooms] = useState([]);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const carouselSettings = {
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    swipeToSlide: true,
    prevArrow: <img src={leftarrow} style={{ width: '40px' }} alt="Left Arrow" />,
    nextArrow: <img src={rightarrow} style={{ width: '40px' }} alt="Right Arrow" />,
  };

  const fetchAllRooms = async () => {
    try {
      const response = await axios.get('https://localhost:7243/room/GetAllRooms');
      const responseBody = response.data;

      if (response.status === 200) {
        setRooms(responseBody);
      } else {
        const errorMessage = responseBody.errorMessage;
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  useEffect(() => {
    const updateSlidesToShow = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 1007) {
        setSlidesToShow(1.1);
      } else {
        setSlidesToShow(2.5);
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => {
      window.removeEventListener("resize", updateSlidesToShow);
    };
  }, []);

  const [allEvents, setAllEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const currentDate = new Date().toLocaleDateString();

  const getAllEvents = () => {
    axios.get('https://localhost:7243/event/GetAllEventAndDescs')
      .then(response => {
        setAllEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  };

  const getAllLocations = async () => {
    try {
      const response = await axios.get('https://localhost:7243/room/Location');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    getAllLocations();
    getAllEvents();
  }, []);

  function formatTime(timeString) {
    const date = new Date(timeString);
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthAbbreviation = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${monthAbbreviation} ${day}, ${year}`;
  }

  function EventSlider() {
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
      axios.get('https://localhost:7243/event/GetAllEventAndDescs')
        .then(response => {
          setAllEvents(response.data);
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }, []);
  }

  const formatEventTime = (time) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(time).toLocaleTimeString('en-US', options);
  };

  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:7243/notification/GetAllNotifications')
      .then(response => {
        setNotificationList(response.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const navigate = useNavigate();

  const handleRoomClick = () => {
    navigate('/room');
  };

  const handleDeskClick = () => {
    navigate('/desk');
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };
  const [chosenLocation, setChosenLocation] = useState('Ratta Tek Meadows, Chennai');
  const updateChosenLocation = (location) => {
    setChosenLocation(location);
    handleDropdownToggle();
  };
  const city = chosenLocation.split(', ')[1];
  return (
    <Box sx={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}>
      <Grid>
        <Box>
          <Box sx={{ width: '100%', height: '100%', paddingBottom: '6rem' }}>
            <Box style={{ position: 'relative' }}>
              <Box style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                <img
                  src={topimg}
                  alt="BackgroundImage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                />
              </Box>
              <Box style={{ position: 'absolute', top: '70%', width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box style={{ padding: '30px', width: '80%', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2', padding: '35px', paddingLeft: '10px' }}>
                  <Box style={{ fontSize: '28px', fontStyle: 'normal', fontWeight: 400, lineHeight: '38px', marginBottom: '5px' }}>Hello {users.userFirstName} {users.userLastName}, Welcome to</Box>
                  <Box
                    onClick={handleDropdownToggle}
                    style={{ fontStyle: 'normal', fontWeight: 600, fontSize: '28px', lineHeight: '38px', cursor: 'pointer', alignItems: 'center', display: 'flex', marginTop: '15px' }}
                  >
                    {chosenLocation}
                    <img
                      src={downarrow}
                      width='20'
                      height='15'
                      style={{ paddingLeft: '5px', paddingTop: '5px' }}
                      alt="chevron-down"
                    />
                  </Box>
                  <Box style={{ display: dropdownVisible ? 'block' : 'none', position: 'absolute', backgroundColor: '#f9f9f9', width: '400px', boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.2', zIndex: 1, padding: '10px', borderRadius: '5px' }}>
                    <a href="#" onClick={() => updateChosenLocation('Ratta Tek Meadows, Chennai')} style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: '#626D8A' }}>Ratta Tek Meadows, Chennai</a>
                    <a href="#" onClick={() => updateChosenLocation('Kanini, Bangalore')} style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: '#626D8A' }}>Kanini, Bangalore</a>
                    <a href="#" onClick={() => updateChosenLocation('Futura, Pune')} style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: '#626D8A' }}>Futura, Pune</a>
                    <a href="#" onClick={() => updateChosenLocation('Kanini, Coimbatore')} style={{ display: 'block', padding: '5px 10px', textDecoration: 'none', color: '#626D8A' }}>Kanini, Coimbatore</a>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Box>
        <Box sx={{ marginLeft: '10%', marginRight: '10%', marginTop: '4rem' }}>
          <Grid container>
            <Grid item xs={12} sm={8} sx={{ marginBottom: '7%' }}>
              <Grid container>
                <Grid item xs={12} sm={2}>
                  <Box style={{ background: '#f5f7f9', borderRadius: '8px 0 0 8px', height: '100%', display: 'flex', alignItems: 'start', justifyContent: 'center', paddingTop: '2rem' }} >
                    <img src={calendor} alt='calendor' />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Box style={{ background: '#f5f7f9', height: '100%', borderRadius: '0 8px 8px 0', padding: '4%' }}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>Nothing upcoming!</Typography>
                    <Typography style={{ fontSize: '17px', color: '#626D8A' }}>Any upcoming bookings and guests will appear here.</Typography>
                    <br />
                    <Box>
                      <p>
                        <img src={room} alt='roomImage' onClick={handleRoomClick} style={{ cursor: 'pointer' }} />
                        <span style={{ color: '#5162F6', fontWeight: 500, fontSize: '17px', cursor: 'pointer' }} onClick={handleRoomClick}>Book a room</span> →
                        <img src={desk} alt='deskImage' style={{ paddingLeft: '10%', cursor: 'pointer' }} onClick={handleDeskClick} />
                        <span style={{ color: '#5162F6', fontWeight: 500, fontSize: '17px', cursor: 'pointer' }} onClick={handleDeskClick}>Book a desk</span> →
                      </p>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: '5%' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, }}>Meeting rooms available right now</Typography>
                <Slider {...carouselSettings} style={{ marginTop: '5%' }}>
                  {rooms.map((room) => (
                    <Box key={room.roomId}>
                      <Card sx={{ marginRight: '5%', marginBottom: '2%' }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="140"
                            image={`https://localhost:7243/uploads/room/${room.roomImagePath}`}
                            alt="Conference Room"
                          />
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              Conference Room:
                            </Typography>
                            <Typography gutterBottom sx={{ fontWeight: '600', color: 'black' }} component="div">
                              {room.roomName}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions>
                          <Box sx={{ marginLeft: '3%' }}>
                            <Grid container>
                              <Grid sx={{ border: '2px solid #CFCFCF', borderRadius: '5px', padding: '2px', marginRight: '8px' }}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M11.5757 10.1855C11.2994 9.53101 10.8984 8.93648 10.3951 8.43506C9.89325 7.93219 9.29881 7.53126 8.64457 7.25439C8.63871 7.25146 8.63285 7.25 8.62699 7.24707C9.53959 6.58789 10.1328 5.51416 10.1328 4.30273C10.1328 2.2959 8.50687 0.669922 6.50004 0.669922C4.4932 0.669922 2.86722 2.2959 2.86722 4.30273C2.86722 5.51416 3.46049 6.58789 4.37308 7.24853C4.36722 7.25146 4.36136 7.25293 4.35551 7.25586C3.69926 7.53271 3.11039 7.92969 2.60502 8.43652C2.10215 8.93833 1.70122 9.53277 1.42435 10.187C1.15236 10.8275 1.00567 11.5142 0.992224 12.21C0.991833 12.2256 0.994575 12.2411 1.00029 12.2557C1.006 12.2703 1.01457 12.2835 1.02549 12.2947C1.03642 12.3059 1.04947 12.3148 1.06388 12.3209C1.07829 12.327 1.09377 12.3301 1.10941 12.3301H1.98832C2.05277 12.3301 2.10404 12.2788 2.10551 12.2158C2.1348 11.085 2.5889 10.0259 3.39164 9.22314C4.2222 8.39258 5.32523 7.93555 6.50004 7.93555C7.67484 7.93555 8.77787 8.39258 9.60844 9.22314C10.4112 10.0259 10.8653 11.085 10.8946 12.2158C10.896 12.2803 10.9473 12.3301 11.0118 12.3301H11.8907C11.9063 12.3301 11.9218 12.327 11.9362 12.3209C11.9506 12.3148 11.9637 12.3059 11.9746 12.2947C11.9855 12.2835 11.9941 12.2703 11.9998 12.2557C12.0055 12.2411 12.0082 12.2256 12.0078 12.21C11.9932 11.5098 11.8482 10.8286 11.5757 10.1855ZM6.50004 6.82227C5.82767 6.82227 5.19486 6.56006 4.71879 6.08398C4.24271 5.60791 3.98051 4.9751 3.98051 4.30273C3.98051 3.63037 4.24271 2.99756 4.71879 2.52148C5.19486 2.04541 5.82767 1.7832 6.50004 1.7832C7.1724 1.7832 7.80521 2.04541 8.28129 2.52148C8.75736 2.99756 9.01957 3.63037 9.01957 4.30273C9.01957 4.9751 8.75736 5.60791 8.28129 6.08398C7.80521 6.56006 7.1724 6.82227 6.50004 6.82227Z"
                                    fill="#626D8A" />
                                </svg>
                                <span style={{ color: 'grey' }}>{room.roomCapacity}</span>
                              </Grid>
                              <Grid sx={{ border: '2px solid #CFCFCF', borderRadius: '5px', padding: '2px', marginRight: '8px' }}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M4.625 12.125C4.44792 12.125 4.29958 12.065 4.18 11.945C4.06 11.8254 4 11.6771 4 11.5V10.875H1.5C1.15625 10.875 0.862083 10.7527 0.6175 10.5081C0.3725 10.2631 0.25 9.96875 0.25 9.625V2.125C0.25 1.78125 0.3725 1.48687 0.6175 1.24187C0.862083 0.997292 1.15625 0.875 1.5 0.875H11.5C11.8438 0.875 12.1381 0.997292 12.3831 1.24187C12.6277 1.48687 12.75 1.78125 12.75 2.125V9.625C12.75 9.96875 12.6277 10.2631 12.3831 10.5081C12.1381 10.7527 11.8438 10.875 11.5 10.875H9V11.5C9 11.6771 8.94021 11.8254 8.82063 11.945C8.70063 12.065 8.55208 12.125 8.375 12.125H4.625ZM1.5 9.625H11.5V2.125H1.5V9.625ZM1.5 9.625V2.125V9.625Z"
                                    fill="#626D8A" />
                                </svg>
                                <span style={{ color: 'grey' }}>{room.additional}</span>
                              </Grid>
                              <Grid sx={{ border: '2px solid #CFCFCF', borderRadius: '5px', padding: '2px' }}>
                                <svg width="13" height="13px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                  <path fill="#626D8A"
                                    d="M224,288l0,32l272,0c8.837,0 16,7.163 16,16c0,8.837 -7.163,16 -16,16l-160.584,0l36.744,137.133c2.287,8.535 -2.778,17.309 -11.313,19.596c-8.536,2.287 -17.309,-2.778 -19.596,-11.314l-38.964,   -145.415l-30.287,0l0,96c0,8.837 -7.163,16 -16,16c-8.837,0 -16,-7.163 -16,-16l0,-96l-30.287,0l-38.964,145.415c-2.287,8.536 -11.06,13.601 -19.596,11.314c-8.535,-2.287 -13.6,-11.061 -11.313,-19.596l36.744,-137.133l-160.584,0c-8.884,-0.048 -16,-7.193 -16,-16c0,-8.807 7.116,-15.952 16, -16l80,0l0,-32l128,0Zm-160,0l-32,0l0,-256c0,-17.673 14.327,-32 32,-32l384,0c17.673,0 32,14.327 32,32l0,256l-32,0l0,-256l-384,0l0,256Z" />
                                </svg>
                                <span style={{ color: 'grey' }}>{room.presentation}</span>
                              </Grid>
                            </Grid>
                          </Box>
                        </CardActions>
                      </Card>
                    </Box>
                  ))}
                </Slider>
              </Box>
              <Box sx={{ marginTop: "5%" }}>
                {allEvents.some(event => event.location && event.location.locationCity === city) && (
                  <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Upcoming events at {city}</Typography>
                )}
                <Slider {...carouselSettings} style={{ marginTop: '2%' }}>
                  {allEvents.map((event) => (
                    event.location && event.location.locationCity === city ? (
                      <Box key={event.eventId}>
                        <Link to={`/eventdescription/${event.eventId}`} style={{ textDecoration: 'none' }}>
                          <Card sx={{ marginRight: "5%", marginBottom: "2%" }}>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="140"
                                image={`https://localhost:7243/uploads/event/${event.eventImagePath}`}
                                alt="Event Image"
                              />
                              <CardContent>
                                <Typography gutterBottom sx={{ fontWeight: "600", color: "black" }} component="div">
                                  {event.eventName.length > 15 ? event.eventName.substring(0, 15) + "..." : event.eventName}
                                </Typography>
                                <Typography color="text.secondary" sx={{ fontSize: '13px' }}>
                                  {`${formatDate(event.eventStartTime)}, ${formatTime(event.eventStartTime)} - ${formatTime(event.eventEndTime)}`}
                                </Typography><br />
                                <button className="event-button123" style={{ border: '2px solid #5162F6', backgroundColor: 'white', color: '#5162F6', fontSize: '13px', fontWeight: 400, borderRadius: '10%', width: '100px' }}>View Details</button>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Link>
                      </Box>
                    ) : null
                  ))}
                </Slider>
              </Box>
            </Grid>
            <Grid item xs={12} sm={0.5}></Grid>
            <Grid item xs={12} sm={3.5} >
              <Box> 
                {allEvents.some(event => {
                  const eventDate = new Date(event.eventDate).toLocaleDateString();
                  return event.location && event.location.locationCity === city && eventDate === currentDate;
                }) && (
                    <Box sx={{ border: '2px solid #EDF1F5' }}>
                      <h6 style={{ fontWeight: 600, fontSize: '15px', padding: '1rem' }}>Events happening at {city} today</h6>
                      {allEvents.map((event, index) => {
                        const eventDate = new Date(event.eventDate).toLocaleDateString();
                        if (event.location && event.location.locationCity === city && eventDate === currentDate) {
                          return (
                            <Box key={event.eventId} style={{ marginBottom: '15px', borderBottom: index === allEvents.length - 1 ? 'none' : '2px solid rgb(201 205 208)' }}>
                              <Grid container>
                                <Grid item xs={12} sm={2}>
                                  <Box>
                                    <Box style={{ position: 'relative', textAlign: 'center' }}>
                                      <img src={datecalendar} width={"40px"} alt="Event" style={{ paddingRight: '1rem', width: '4rem', paddingLeft: '12px' }} />
                                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                                        <p style={{ fontSize: '12px', margin: 0, fontWeight: 400 }}>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}</p>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric' })}</p>
                                      </div>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={10}>
                                  <Box style={{ paddingLeft: '1rem', paddingBottom: '15px' }}>
                                    <p style={{ fontSize: '15px' }}>{event.eventName}</p>
                                    <p style={{ color: '#626D8A', fontSize: '12px', fontWeight: 400, marginTop: '-1rem' }}>
                                      {formatEventTime(event.eventStartTime)} - {formatEventTime(event.eventEndTime)}
                                    </p>
                                    <Link to={`/eventdescription/${event.eventId}`} style={{ textDecoration: 'none' }}>
                                      <button style={{ border: '2px solid #ECECEC', backgroundColor: 'white', color: '#5162F6', fontSize: '12px', fontWeight: 400 }}>View Details</button>
                                    </Link>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          );
                        }
                        return null;
                      })}
                    </Box>
                  )}
              </Box>
              <br />
              <Box sx={{ border: '2px solid #EDF1F5', wordWrap: 'break-word' }}>
                <Box>
                  <h6 style={{ fontWeight: 600, fontSize: '16px', padding: '1rem' }}>Notifications</h6>
                  {notificationList.map((notification, index) => (
                    <Box key={notification.notificationId} style={{ marginBottom: '20px' }}>
                      <Grid container>
                        <Grid item xs={12} sm={2}>
                          <Box>
                            <Box>
                              <img src={logo} width={"50rem"} alt="Event" style={{ paddingLeft: '1rem' }} />
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Box style={{ paddingLeft: '1rem' }}>
                            <p style={{ fontSize: '15px' }}>{notification.notificationTitle}</p>
                            <p style={{ color: '#626D8A', fontSize: '13px', fontWeight: 400, marginTop: '-1rem' }}>HR Admin</p>
                            <Link to={`/NotifyDesc/${notification.notificationId}`} style={{ textDecoration: 'none' }}>
                              <button style={{ border: '2px solid #ECECEC', backgroundColor: 'white', color: '#5162F6', fontSize: '12px', fontWeight: 400 }}>View Details</button>
                            </Link>
                          </Box>
                        </Grid>
                      </Grid>
                      {index !== notificationList.length - 1 && (
                        <div style={{ borderTop: '2px solid rgb(201 205 208)', marginTop: '20px' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box >
    </Box >
  )
}