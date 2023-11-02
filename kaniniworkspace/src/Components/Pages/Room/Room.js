import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocationIcon from '@mui/icons-material/LocationOnOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from "react-router-dom";
const buttonStyle = {
  backgroundColor: 'trans',
  color: 'white',
  boxShadow: 'none',
  textTransform: 'none',
  width: '10%'
};
export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');

  useEffect(() => {
    fetchAllRooms();
  }, []);
  const fetchAllRooms = async () => {
    try {
      const response = await fetch('https://localhost:7243/room/GetAllRooms');
      const responseBody = await response.json();

      if (response.ok) {
        setRooms(responseBody);
        console.log(responseBody);
      } else {
        const errorMessage = responseBody.errorMessage;
        alert('Error: ' + errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const filterRooms = async () => {
    try {
      let url = 'https://localhost:7243/room/FilterRooms';

      if (selectedLocation !== '' && selectedCapacity > 0) {
        url += `?locationCity=${selectedLocation}&roomCapacity=${selectedCapacity}`;
      } else if (selectedLocation !== '') {
        url += `?locationCity=${selectedLocation}`;
      } else if (selectedCapacity > 0) {
        url += `?roomCapacity=${selectedCapacity}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        console.error('Failed to fetch filtered rooms');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <Box className="" style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 450, fontSize: '20px' }}>Book a room </span>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1%' }}>
        <span style={{ fontWeight: 450, color: 'grey', fontSize: '18px' }}>Book a conference room at any kanini location</span>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: '3%', flexWrap: 'wrap' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField id="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
              select
              label="Location"
              variant="outlined"
              sx={{ width: '100%', marginBottom: '8px' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                ),
              }}
              SelectProps={{ style: { height: '43px' } }}
            >
              <MenuItem value="Chennai">Kanini, Chennai</MenuItem>
              <MenuItem value="Coimbatore">Kanini, Coimbatore</MenuItem>
              <MenuItem value="Bangalore">Kanini, Bangalore</MenuItem>
              <MenuItem value="Pune">Futura, Pune</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id="outlined-basic-date"
              label="Date"
              type="date"
              variant="outlined"
              sx={{ width: '100%', marginBottom: '8px' }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { height: '10px' }, min: new Date().toISOString().split('T')[0] }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField id="employees" value={selectedCapacity} onChange={(e) => setSelectedCapacity(e.target.value)}
              select
              label="Employee"
              variant="outlined"
              sx={{ width: '100%', marginBottom: '8px' }}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              SelectProps={{ style: { height: '43px' } }}
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="15">15</MenuItem>
              <MenuItem value="20">20</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" sx={buttonStyle} onClick={filterRooms}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: '1%', flexWrap: 'wrap' }}>
        <Grid container spacing={'1%'}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={3} key={room.roomId}>
              <Link to={`/roombooking/${room.roomId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={{ marginRight: '2%', marginBottom: '2%' }}>

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
                        <span style={{ backgroundColor: 'rgba(81, 98, 246, 0.14)', float: 'right', orderRadius: '3px', paddingLeft: '8px', paddingRight: '8px', padding: '2px', color: 'blue', borderRadius: '5px' }}>{room.location.locationCity}</span>
                      </Typography>
                      <Typography gutterBottom sx={{ fontWeight: '600' }} component="div">
                        {room.roomName}
                      </Typography>
                    </CardContent>

                  </CardActionArea>
                  <CardActions>
                    <Box sx={{ marginLeft: '3%' }}>
                      <Grid container>
                        <Grid sx={{ border: '2px solid #ECECEC', borderRadius: '5px', padding: '2px', marginRight: '8px' }}>
                          <Box sx={{ marginLeft: '5px', marginRight: '5px' }}>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M11.5757 10.1855C11.2994 9.53101 10.8984 8.93648 10.3951 8.43506C9.89325 7.93219 9.29881 7.53126 8.64457 7.25439C8.63871 7.25146 8.63285 7.25 8.62699 7.24707C9.53959 6.58789 10.1328 5.51416 10.1328 4.30273C10.1328 2.2959 8.50687 0.669922 6.50004 0.669922C4.4932 0.669922 2.86722 2.2959 2.86722 4.30273C2.86722 5.51416 3.46049 6.58789 4.37308 7.24853C4.36722 7.25146 4.36136 7.25293 4.35551 7.25586C3.69926 7.53271 3.11039 7.92969 2.60502 8.43652C2.10215 8.93833 1.70122 9.53277 1.42435 10.187C1.15236 10.8275 1.00567 11.5142 0.992224 12.21C0.991833 12.2256 0.994575 12.2411 1.00029 12.2557C1.006 12.2703 1.01457 12.2835 1.02549 12.2947C1.03642 12.3059 1.04947 12.3148 1.06388 12.3209C1.07829 12.327 1.09377 12.3301 1.10941 12.3301H1.98832C2.05277 12.3301 2.10404 12.2788 2.10551 12.2158C2.1348 11.085 2.5889 10.0259 3.39164 9.22314C4.2222 8.39258 5.32523 7.93555 6.50004 7.93555C7.67484 7.93555 8.77787 8.39258 9.60844 9.22314C10.4112 10.0259 10.8653 11.085 10.8946 12.2158C10.896 12.2803 10.9473 12.3301 11.0118 12.3301H11.8907C11.9063 12.3301 11.9218 12.327 11.9362 12.3209C11.9506 12.3148 11.9637 12.3059 11.9746 12.2947C11.9855 12.2835 11.9941 12.2703 11.9998 12.2557C12.0055 12.2411 12.0082 12.2256 12.0078 12.21C11.9932 11.5098 11.8482 10.8286 11.5757 10.1855ZM6.50004 6.82227C5.82767 6.82227 5.19486 6.56006 4.71879 6.08398C4.24271 5.60791 3.98051 4.9751 3.98051 4.30273C3.98051 3.63037 4.24271 2.99756 4.71879 2.52148C5.19486 2.04541 5.82767 1.7832 6.50004 1.7832C7.1724 1.7832 7.80521 2.04541 8.28129 2.52148C8.75736 2.99756 9.01957 3.63037 9.01957 4.30273C9.01957 4.9751 8.75736 5.60791 8.28129 6.08398C7.80521 6.56006 7.1724 6.82227 6.50004 6.82227Z"
                                fill="#626D8A" />
                            </svg>
                            <span className="cardtext">{room.roomCapacity}</span>
                          </Box>
                        </Grid>
                        <Grid sx={{ border: '2px solid #ECECEC', borderRadius: '5px', padding: '2px', marginRight: '8px' }}>
                          <Box sx={{ marginLeft: '5px', marginRight: '5px' }}>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M4.625 12.125C4.44792 12.125 4.29958 12.065 4.18 11.945C4.06 11.8254 4 11.6771 4 11.5V10.875H1.5C1.15625 10.875 0.862083 10.7527 0.6175 10.5081C0.3725 10.2631 0.25 9.96875 0.25 9.625V2.125C0.25 1.78125 0.3725 1.48687 0.6175 1.24187C0.862083 0.997292 1.15625 0.875 1.5 0.875H11.5C11.8438 0.875 12.1381 0.997292 12.3831 1.24187C12.6277 1.48687 12.75 1.78125 12.75 2.125V9.625C12.75 9.96875 12.6277 10.2631 12.3831 10.5081C12.1381 10.7527 11.8438 10.875 11.5 10.875H9V11.5C9 11.6771 8.94021 11.8254 8.82063 11.945C8.70063 12.065 8.55208 12.125 8.375 12.125H4.625ZM1.5 9.625H11.5V2.125H1.5V9.625ZM1.5 9.625V2.125V9.625Z"
                                fill="#626D8A" />
                            </svg>
                            <span className="cardtext">{room.presentation}</span>
                          </Box>
                        </Grid>
                        <Grid sx={{ border: '2px solid #ECECEC', borderRadius: '5px', padding: '2px' }}>
                          <Box sx={{ marginLeft: '5px', marginRight: '5px' }}>
                            <svg width="13" height="13px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg">
                              <path fill="#626D8A"
                                d="M224,288l0,32l272,0c8.837,0 16,7.163 16,16c0,8.837 -7.163,16 -16,16l-160.584,0l36.744,137.133c2.287,8.535 -2.778,17.309 -11.313,19.596c-8.536,2.287 -17.309,-2.778 -19.596,-11.314l-38.964,   -145.415l-30.287,0l0,96c0,8.837 -7.163,16 -16,16c-8.837,0 -16,-7.163 -16,-16l0,-96l-30.287,0l-38.964,145.415c-2.287,8.536 -11.06,13.601 -19.596,11.314c-8.535,-2.287 -13.6,-11.061 -11.313,-19.596l36.744,-137.133l-160.584,0c-8.884,-0.048 -16,-7.193 -16,-16c0,-8.807 7.116,-15.952 16, -16l80,0l0,-32l128,0Zm-160,0l-32,0l0,-256c0,-17.673 14.327,-32 32,-32l384,0c17.673,0 32,14.327 32,32l0,256l-32,0l0,-256l-384,0l0,256Z" />
                            </svg>
                            <span className="cardtext">{room.additional}</span>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardActions>
                </Card></Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}