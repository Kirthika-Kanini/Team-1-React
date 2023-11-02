import React, { useEffect, useState } from 'react';
import Logo from '../../../../Assets/YourBookings/Logo.svg';
import Calendar from '../../../../Assets/YourBookings/calendarLogo.svg';
import Location from '../../../../Assets/YourBookings/locationLogo.svg';
import Person from '../../../../Assets/YourBookings/personLogo.svg';
import Desklogo from '../../../../Assets/YourBookings/Desklogo.svg';
import { Variable } from '../../../../Variable';
import CheckoutModule from '../Checkout/CheckoutModule';

const DeskBookings = () => {
    const [allDeskBookings, setAllDeskBookings] = useState([]);

    const getAllDeskBookings = () => {
        const usrId = localStorage.getItem('userId');
        fetch(Variable.DESK_BOOKING_URL)
          .then((res) => res.json())
          .then((data) => {
            const filteredAndSortedData = data
              .filter((dt) => dt.users.userId === parseInt(usrId) && new Date(dt.deskBookingDate).getDate() >= new Date().getDate())
              .sort((a, b) => new Date(b.deskBookingDate) - new Date(a.deskBookingDate));
      
            setAllDeskBookings(filteredAndSortedData);
          })
          .catch((error) => {
            console.log('Error fetching Booking Rooms:', error);
          });
      };

    function formatDate(dateString) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }
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
        getAllDeskBookings();
    }, []);

    function countNames(nameString) {
        const names = nameString.split(', ');
        return names.length + 1;
    }

    return (
        <section>
            <div className="row">
                {
                    allDeskBookings.map(booking => (
                        <div className={`col-sm-12 col-md-12 col-lg-12 mt-3`} key={booking.deskBookingId}>
                            <div className={` card  shadow`} style={{ padding: '1%', height: '200px' }}>
                                <div className="row g-0">
                                    <div className="col-sm-2 col-md-2 col-lg-2">
                                        <img
                                            className={`card-img`}
                                            style={{
                                                height: '170px',
                                                borderRadius: '15px',
                                                objectFit: 'cover'
                                            }}
                                            src={`https://localhost:7243/uploads/desk/${booking.desks.deskImagePath}`}
                                            alt={booking.desks.deskImagePath}
                                        />
                                        <span style={bookingType}>
                                            <img src={Desklogo} alt="" style={{ marginRight: '.2rem' }} />
                                            <p style={{ margin: '0%', padding: '.2rem .3rem' }}>Desk</p>
                                        </span>
                                    </div>
                                    <div className="col-md-10">
                                        <div className="card-body">
                                            <h4 className={`card-title`} style={cardName}>{booking.desks.deskName}</h4>
                                            <div style={{ display: 'flex', alignItems: "baseline" }}>
                                                <div style={logoBgStyle}>
                                                    <img
                                                        src={Logo}
                                                        alt="BgImage"
                                                        style={{ height: '13px', width: '13px' }}
                                                    />
                                                </div>
                                                <p className={`card-text `} style={idNameStyle}>Booking id</p>
                                                <div style={idStyle}>#D{booking.deskBookingId}</div>
                                                <div style={{ marginLeft: 'auto' }}>
                                                    <span style={{ color: '#00D56E', marginRight: '15px', height: '50px' }}>
                                                    {booking.checkinStatus!==0 && <i className="bi bi-check2-circle" style={{ marginRight: '5px', }}></i>}
                                                        {booking.checkinStatus === 0 ? '' : booking.checkinStatus === 1 ? 'Checked-in' : 'Checked-in & Checked-out'}
                                                    </span>
                                                    {
                                                        booking.checkinStatus !== 2 && <button

                                                            style={{
                                                                marginLeft: 'auto',
                                                                backgroundColor: '#5162f6',
                                                                borderRadius: '0.2rem',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '.5rem 1rem'
                                                            }}
                                                        >
                                                            <CheckoutModule location={booking.location.locationCity}
                                                                bookingId={booking.deskBookingId}
                                                                date={formatDate(booking.deskBookingDate)}
                                                                status={booking.checkinStatus}
                                                                getBookings={getAllDeskBookings()}
                                                                time='5.00 pm'
                                                            />
                                                        </button>
                                                    }
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '2.5%', display: 'flex', alignContent: 'baseline', justifyContent: 'last baseline' }}>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Location} alt="" />
                                                    <span style={spanStyle}>{booking.location.locationCity}</span>
                                                </div>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Person} alt="" />
                                                    <span style={spanStyle}>{countNames(booking.deskBookingColleague)} people</span>
                                                </div>
                                                <div style={{ marginRight: '1.5rem' }}>
                                                    <img src={Calendar} alt="" />
                                                    <span style={spanStyle}>{formatDate(booking.deskBookingDate)}</span>
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

export default DeskBookings