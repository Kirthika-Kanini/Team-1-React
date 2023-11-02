import React, { useState } from 'react'
import closeicon from '../../../../Assets/Desk/closeicon.svg';
import logo from '../../../../Assets/Desk/logo.png';
import calander from '../../../../Assets/Desk/calander.png';
import clock from '../../../../Assets/Desk/clock.png';
import { Button, Modal, Box, Typography, IconButton } from '@mui/material';
import axios from 'axios';

const CheckoutModule = ({ location, bookingId, date, time, status,getBookings }) => {
    const [showColleague, setShowColleague] = useState(false);
    const [showBook, setShowBook] = useState(false);

    const closeModal = () => {
        setShowColleague(false);
        setShowBook(false);
    };

    const openModal = () => {
        setShowColleague(true);
        setShowBook(true);
    };

    const handleStatus = async () => {
        await axios.put('   https://localhost:7243/deskbooking/UpdateDeskBookingStatus/' + bookingId, {
            deskBookingId: bookingId,
            checkinStatus: status === 0 ? 1 : status === 1 ? 2 : 0
        })
            .then(response => {
                
                closeModal()
                getBookings()

            })
            .catch(error => {
                console.error('Error updating data:', error);
            });
    }

    return (
        <div>
            <Modal open={showColleague} onClose={openModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2, height: 300 }}>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="h5" style={{ marginTop: '1rem', fontSize: '20px', fontWeight: '700' }}>Check Out Details</Typography>
                        <IconButton sx={{ marginLeft: 'auto' }} >
                            <img sx={{position:'absolute',top:'12px',width:'26px',height:'26px',right:'15px',cursor:'pointer',}} src={closeicon} alt='' onClick={closeModal} />
                        </IconButton>
                    </Box>
                    <hr />
                    <Box sx={{textAlign:'center',height:'275px',paddingTop:'25px'}}>
                        <Box  style={{ display: 'flex' }}>
                            <Typography style={{ marginTop: '4px' }}>{location}</Typography>
                            <img src={logo} alt="Logo" style={{ marginLeft: '15px' }} />
                            <Typography style={{ marginTop: '4px' }}>Booking id</Typography>
                            <Typography style={{ fontWeight: '700', marginTop: '4px' }}>#{bookingId}</Typography>
                        </Box>
                        <Box  style={{ display: 'flex', gap: '5px', marginTop: '1rem', gridTemplateColumns: 'repeat(8, auto)' }}>
                            <img src={calander} alt="Calendar" />
                            <Typography sx={{ fontSize: '12px' }}>{date}</Typography>
                            <img src={clock} alt="Clock" style={{ marginLeft: '15px' }} />
                            <Typography sx={{ fontSize: '12px' }}>{time}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: '15px', marginTop: '12%' }}>
                            <Button onClick={handleStatus} variant="contained" sx={{ backgroundColor: '#5162F6' }}>{status === 0 ? 'Check In' : 'Check Out'}</Button>
                            <Button onClick={closeModal} style={{ marginLeft: '3%', color: '#626D8A', fontSize: '16px' }}>Cancel</Button>

                        </Box>
                    </Box>
                </Box>
            </Modal>
            <p onClick={openModal} style={{ padding: '0%', margin: '0%' }} >{status === 0 ? 'Check In' : status === 1 ? 'Check Out' : 'Other status'}</p>
        </div>
    )
}

export default CheckoutModule