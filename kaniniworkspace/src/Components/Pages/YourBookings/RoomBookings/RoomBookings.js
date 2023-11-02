import React, { useEffect, useState } from 'react';
import Logo from '../../../../Assets/YourBookings/Logo.svg';
import Calendar from '../../../../Assets/YourBookings/calendarLogo.svg';
import Messagebox from '../../../../Assets/YourBookings/messageBox.svg';
import Location from '../../../../Assets/YourBookings/locationLogo.svg';
import Person from '../../../../Assets/YourBookings/personLogo.svg';
import Clock from '../../../../Assets/YourBookings/clockLogo.svg';
import Roomlogo from '../../../../Assets/YourBookings/Roomlogo.svg';
import { Variable } from '../../../../Variable';
import { Link } from 'react-router-dom';


const RoomBookings = () => {
    const [allRoomBookings, setAllRoomBookings] = useState([]);
    const [fbooking, setfbooking] = useState([]);



    function formatDate(dateString) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }

    const getAllRoomBookings = () => {
        const usrId = localStorage.getItem('userId');
        console.log(usrId);
        fetch(Variable.ROOM_BOOKING_URL)
          .then((res) => res.json())
          .then((data) => {
            const filteredAndSortedData = data
              .filter(
                (dt) =>
                  dt.users.userId === parseInt(usrId) &&
                  new Date(dt.roomBookingDate).getDate() >= new Date().getDate()
              )
              .sort((a, b) => new Date(b.roomBookingDate) - new Date(a.roomBookingDate));
      
            setAllRoomBookings(filteredAndSortedData);
            console.log(allRoomBookings);
            setfbooking(
              filteredAndSortedData.filter(
                (dt) =>
                  parseInt(dt.roomBookingStartTime.split(':')[0]) <=
                  new Date().getHours()
              )
            );
            console.log(fbooking);
            console.log(parseInt('10:00 AM'.split(':')[0]) <= new Date().getHours());
          })
          .catch((error) => {
            console.log('Error fetching Booking Rooms:', error);
          });
      };

    const bookingType = {
        position: 'absolute',
        backgroundColor: 'white',
        left: '2.1rem',
        top: '2rem',
        padding: '0.1rem',
        borderRadius: '0.3rem',
        alignItems: 'center',
        display: 'flex',
    };
    const cardName = {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '24px',
        color: '#1f2131',
    };
    const idNameStyle = {
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        color: '#626d8a',
        marginRight: '0.3rem',
    };
    const idStyle = {
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: '27px',
        letterSpacing: '0.05em',
        color: '#1f2131',
    };
    const logoBgStyle = {
        width: '24px',
        height: '24px',
        backgroundColor: '#dddede',
        borderRadius: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginRight: '0.3rem',
    };

    const spanStyle = {
        fontFamily: 'Manrope',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '19px',
        marginLeft: '0.2rem',
        color: '#1f2131',
    };

    useEffect(() => {
        getAllRoomBookings();
    }, []);

    return (
        <section>
            <div className="row">
                {
                    allRoomBookings.map(booking => (
                        <div className={`col-sm-12 col-md-12 col-lg-12 mt-3`} key={booking.roomBookingId}>
                            <div className={` card  shadow`} style={{ padding: '1%' }}>
                                <div className="row g-0">
                                    <div className="col-sm-2 col-md-2 col-lg-2">
                                        <img
                                            className={`card-img`} style={{
                                                height: '170px',
                                                borderRadius: '15px',
                                                objectFit: 'cover'
                                            }}
                                            src={`https://localhost:7243/uploads/room/${booking.rooms.roomImagePath}`}
                                            alt={booking.roomImagePath}
                                        />
                                        <span style={bookingType}>
                                            <img src={Roomlogo} alt="" style={{ marginRight: '.2rem' }} />
                                            <p style={{ margin: '0%', padding: '.2rem .3rem' }}>Room</p>
                                        </span>
                                    </div>
                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <h4 className={`card-title`} style={cardName}>{booking.rooms.roomName}</h4>
                                            <div style={{ display: 'flex', alignItems: "baseline" }}>
                                                <div style={logoBgStyle}>
                                                    <img
                                                        src={Logo}
                                                        alt="BgImage"
                                                        style={{ height: '13px', width: '13px' }}
                                                    />
                                                </div>
                                                <p className={`card-text`} style={idNameStyle}>Booking id</p>
                                                <div style={idStyle}>#R{booking.roomBookingId}</div>
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <Link to={`/updateroombooking/${booking.roomBookingId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <button
                                                            style={{
                                                                marginLeft: 'auto',
                                                                backgroundColor: '#5162f6',
                                                                borderRadius: '0.2rem',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '.5rem 1rem'
                                                            }}
                                                        >
                                                            View and Modify Booking
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '2.5%', display: 'flex', alignContent: 'baseline', justifyContent: 'last baseline' }}>
                                                {

                                                    <div style={{ marginRight: '1.5rem' }}>
                                                        <img src={Messagebox} alt="" />
                                                        <span style={spanStyle}>{booking.roomMeetingDesc}</span>
                                                    </div>

                                                }
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Location} alt="" />
                                                    <span style={spanStyle}>{booking.location.locationCity}</span>
                                                </div>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Person} alt="" />
                                                    <span style={spanStyle}>{booking.roomBookingEmployeeCount} people</span>
                                                </div>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Calendar} alt="" />
                                                    <span style={spanStyle}>{formatDate(booking.roomBookingDate)}</span>
                                                </div>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Clock} alt="" />
                                                    <span style={spanStyle}>{booking.roomBookingStartTime} - {booking.roomBookingEndTime}  </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default RoomBookings