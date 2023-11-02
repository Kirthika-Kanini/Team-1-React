import React, { useEffect, useState } from 'react';
import logo from '../../../Assets/NotificationDescription/logo.svg';
import { useParams } from 'react-router-dom';
import location from '../../../Assets/NotificationDescription/location.svg';
import calendor1 from '../../../Assets/NotificationDescription/calendor1.svg';
import clock from '../../../Assets/NotificationDescription/clock.svg';

export default function Click() {
    const cardStyle = {
        padding: '15px',
        marginLeft: '0%',
        width: '88%',
    };

    const logoStyle = {
        backgroundColor: 'black',
        borderRadius: '1rem',
        width: '2rem',
    };

    const headStyle = {
        fontWeight: 600,
        fontSize: '24px',
        fontFamily: 'Manrope',
        lineHeight: '25px',
        color: '#181A1F',
    };

    const infoStyle = {
        color: '#2B2B2B',
        fontFamily: 'Manrope',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '22px',
        marginLeft: '0%',
        marginTop: '30px',
    };

    const adminStyle = {
        fontFamily: 'Manrope, sans-serif',
        fontWeight: 500,
        fontSize: '18px',
        color: '#181A1F',
        textDecoration: 'none',
    };

    const locationSvgStyle = {
        width: '0.72rem',
    };

    const calendorStyle = {
        marginLeft: '0.6rem',
        width: '1rem',
    };

    const clockStyle = {
        marginLeft: '0.6rem',
        width: '0.879rem',
    };

    const pngStyle = {
        fontSize: '11px',
        fontWeight: 500,
        paddingLeft: '5px',
        color: '#626D8A',
        textDecoration: 'none',
    };

    const containerStyle = {
        fontFamily: 'Manrope',
        marginLeft: '6rem'
    };

    const contentStyle = {
      fontWeight: 400,
      fontSize: '18px',
      color: '#626D8A'
    };

    const [notifications, setNotifications] = useState([]);
    const { notificationId } = useParams();

    useEffect(() => {
      fetchNotifications(notificationId);
    }, [notificationId]);

  
    const fetchNotifications = async (id) => {
    try {
      const response = await fetch(`https://localhost:7243/notification/GetNotificationById/${id}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notification:', error);
    }
  };

  const [notificationTitles, setNotificationTitles] = useState([]);

useEffect(() => {
  fetch('https://localhost:7243/event/GetAllEventAndDescs')
    .then(response => response.json())
    .then(data => {
      // Extract notification titles and set in state
      const titles = data.map(notification => notification.notificationTitle);
      setNotificationTitles(titles);
    })
    .catch(error => {
      console.error('Error fetching notifications:', error);
    });
}, []);

  if (!notifications) {
    return <div>Loading...</div>;
  }

    return (
      <div style={{marginTop: '2%'}}>
      <div style={containerStyle}>
        <div style={infoStyle}>
          Notifications / {notifications.notificationTitle?.split(' ').slice(0, 2).join(' ')}...
        </div>
        <br /><br />
        <div style={cardStyle}>
          <div>
            <div>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <td style={{ verticalAlign: 'top', paddingRight: '15px' }}>
                        <img src={logo} style={logoStyle} alt="Logo" />
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <a style={adminStyle}>HR Admin</a>
                        <br />
                        <div>
                          <img src={location} style={locationSvgStyle} alt="Location" />
                          <a style={pngStyle}>
                            {notifications.location && notifications.location.locationCity
                              ? notifications.location.locationCity
                              : "No location available"}
                          </a>
                          <img src={calendor1} style={calendorStyle} alt="Calendar" />
                          <a style={pngStyle}>
                            {new Date(notifications.notificationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </a>
                          <img src={clock} style={clockStyle} alt="Clock" />
                          <a style={pngStyle}>
                            {new Date(notifications.notificationTime).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <div style={headStyle}>
                  {notifications.notificationTitle}
                </div>
                <br />
                {notifications && notifications.notificationDesc && (
                  <div style={contentStyle}>
                    {notifications.notificationDesc.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}