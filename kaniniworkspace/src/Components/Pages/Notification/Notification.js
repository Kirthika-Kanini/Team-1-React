import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../Assets/Notification/logo.svg';
import location from '../../../Assets/Notification/location.svg';
import clock from '../../../Assets/Notification/clock.svg';
import calendor1 from '../../../Assets/Notification/calendor1.svg';

export default function Notify() {

  const cardStyle = {
    border: '1px solid #DDDEDE',
    borderRadius: '8px',
    padding: '15px',
    marginLeft: '5%',
    display: 'flex',
    flexDirection: 'column',
    width: '88%',
    alignItems: 'center',
    height: ''
};

const logoStyle = {
    backgroundColor: 'black',
    borderRadius: '1rem',
    width: '2rem',
    // height: '30px',
    marginRight: '15px',
};

const headStyle = {
    fontSize: '20px',
    fontWeight: 500,
    paddingLeft: '5px',
    lineHeight: '24.2px',
    fontFamily: 'Inter',
};

const contentStyle = {
    paddingLeft: '30px',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '27px',
    color: '#626D8A',
    marginTop: '15px',
    marginLeft: '1rem',
};

const locationStyle = {
    display: 'flex',
    alignItems: 'center',
    marginTop: '0px',
    marginLeft: '2rem',
};

const iconStyle = {
    width: '20px',
    height: '20px',
    marginLeft: '10px'
};

const textStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'black',
    paddingLeft: '5px'
};

const mainbodyStyle = {
  marginTop: '20px',
  marginLeft: '20px',
  marginRight: '20px'
};

const notifyStyle = {
  fontWeight: 500,
  fontSize:'28px',
  fontFamily: 'Manrope',
  lineHeight: '38.25px',
  marginBottom: '10px',
  marginLeft: '5%',
};

const contentWrapperStyle = {
  flex: 1,
};

function truncateText(text, maxWords) {
  const words = text.split(' ');
  const truncatedWords = words.slice(0, maxWords);

  if (words.length > maxWords) {
    return truncatedWords.join(' ') + '...';
  } else {
    return truncatedWords.join(' ');
  }
}
const [notifications, setNotifications] = useState([]);

useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  try {
    const response = await fetch('https://localhost:7243/notification/GetAllNotifications');
    const data = await response.json();
    setNotifications(data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};
  return (
    <div style={{marginTop: '2%'}}>
      <div style={mainbodyStyle}>
        <div style={notifyStyle}>
          Notification
        </div>
        <br />
        {notifications.map(notification => {
          const notificationDate = new Date(notification.notificationDate);
          const formattedDate = notificationDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          const notificationTime = new Date(notification.notificationTime);
          const formattedTime = `${notificationTime.getHours()}:${notificationTime.getMinutes().toString().padStart(2, '0')}`;

          return (
            <Link to={`/NotifyDesc/${notification.notificationId}`} key={notification.notificationId} style={{ textDecoration: 'none' }}>
              <div style={cardStyle}>
                <div>
                  <div style={contentWrapperStyle}>
                    <img src={logo} alt="Logo" style={{backgroundColor: 'black',borderRadius: '1rem',width: '2rem',marginRight: '15px'}} />
                    <a style={{fontSize: '20px',fontWeight: 500,paddingLeft: '5px',lineHeight: '24.2px',fontFamily: 'Inter',textDecoration: 'none',color: "black",}}>
                      {notification.notificationTitle}
                    </a>
                    <div style={{ paddingLeft: '30px', fontFamily: 'Manrope, sans-serif',fontWeight: 400,fontSize: '18px',lineHeight: '27px',color: '#626D8A',marginTop: '15px',marginLeft: '1rem'}}>
                      {truncateText(notification.notificationDesc, 50)}
                    </div>
                  <div style={locationStyle}>
                    <img src={location} alt="Location" style={iconStyle} />
                    <a style={textStyle}>
                      {notification.location && notification.location.locationCity
                        ? notification.location.locationCity
                        : "No location available"}
                    </a>
                    <img src={calendor1} alt="Calendar" style={iconStyle} />
                    <a style={textStyle}>{formattedDate}</a>
                    <img src={clock} alt="Clock" style={iconStyle} />
                    <a style={textStyle}>{formattedTime}</a>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <br/>
            </Link>
          );
        })}
      </div>
    </div>  );
}