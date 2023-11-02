import React, { useEffect, useState } from 'react'
import Backlogo from '../../../Assets/YourBookings/backIcon.svg'
import Calendar from '../../../Assets/YourBookings/calendarLogo.svg'
import Location from '../../../Assets/YourBookings/locationLogo.svg'
import Clock from '../../../Assets/YourBookings/clockLogo.svg'
import EDstyles from './EventDescription.module.css'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { API_URL_EVENTS } from '../../../Variable'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export default function EventDescription() {
    const [Events, setEvents] = useState({
        location:{
            locationCity:''
        }
    })
    const [peopleCount, setPeopleCount] = useState();
    const { id } = useParams();

    const handleEventJoin = async () => {
        try {
            const response = await axios.post("https://localhost:7243/eventJoin/CreateEventJoin", {
                users: { userId: localStorage.getItem('userId') },
                eventAndDescs: { eventId: id }
            });
            getTotalJoinee(id);
            console.log('Response:', response.data);
        } catch (error) {
            toast.error("You have already joined this event")
        }
    }
    
    const [isYesButtonDisabled, setYesButtonDisabled] = useState(false);
    const [isNoButtonDisabled, setNoButtonDisabled] = useState(false);
    const [isMaybeButtonDisabled, setMaybeButtonDisabled] = useState(false);

    const getTotalJoinee = async () => {
        try {
            const response = await axios.get("https://localhost:7243/eventJoin/GetJoineesCount/Count/" + id);
            setPeopleCount(response.data.totalEventJoin)
        } catch (error) {
            console.error(error);
        }
    }

    const getEvent = async (id) => {
        await axios.get(`https://localhost:7243/event/GetEventAndDesc/${id}`)
            .then(response => {
                const data = response.data;
                setEvents(data);
                console.log(data);
            })
            .catch(error => {
                console.log('Error fetching events:', error);
            });
    }


    const DeleteEventJoin = async (id) => {
        try {
            const response = await axios.delete("https://localhost:7243/eventJoin/DeleteEventJoin/" + localStorage.getItem('userId'));
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
      
        getTotalJoinee(id);
    }

    useEffect(() => {
        getTotalJoinee(id)
        getEvent(id);

    }, [id])

    function formatTime(timeString) {
        const date = new Date(timeString);
        const options = { hour: "2-digit", minute: "2-digit" };
        const formattedTime = date.toLocaleTimeString("en-US", options);
        return formattedTime.toLocaleLowerCase();
    }

    function formatDate(dateString) {
        const options = { day: "numeric", month: "long", year: "numeric" };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate;
    }
    
    return (
        <section className={EDstyles.section} style={{marginTop: '2%'}}>
            <ToastContainer/>
            <header className={EDstyles.header}>

            </header>
            <main className={EDstyles.mainContainer}>

                <div className={EDstyles.main} style={{ marginLeft: '100px', marginRight: '100px', marginTop: '2rem' }} id="main">
                    <div>
                        <Link to={{
                            pathname: '/Event',
                        }} ><img src={Backlogo} alt='k' height={'15%'} style={{ cursor: 'pointer' }} /></Link>

                    </div>

                    <img className={`${EDstyles.imgBanner} mt-3`} src={`https://localhost:7243/uploads/event/${Events.eventImagePath}`} alt="Card"
                        style={{ borderRadius: '8px' }} />

                    <br />
                    <br />
                    <p className={EDstyles.eventName}>{Events.eventName}</p>
                    <img src={Location} alt='Location' width="14px" height="0.5%" />&nbsp;<span className={EDstyles.Text}>{Events.location.locationCity}</span>&nbsp;&nbsp;
                    <img src={Calendar} alt='Calendar' width="14px" height="0.5%" />&nbsp;<span className={EDstyles.Text}>{formatDate(Events.eventDate)}</span>&nbsp;&nbsp;
                    <img src={Clock} alt='Clock' width="13.5px" height="0.8%" />&nbsp;<span className={EDstyles.Text}>{formatTime(Events.eventStartTime)} - {formatTime(Events.eventEndTime)}</span>&nbsp;&nbsp;

                    <aside style={{ float: 'right' }}>
                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                            <Button onClick={()=>{handleEventJoin();setYesButtonDisabled(true); setNoButtonDisabled(false);setMaybeButtonDisabled(false)}} disabled={isYesButtonDisabled}>Yes</Button>
                            <Button onClick={() => {DeleteEventJoin(id); setNoButtonDisabled(true);setYesButtonDisabled(false);setMaybeButtonDisabled(false)}} disabled={isNoButtonDisabled}>No</Button>
                            <Button disabled={isMaybeButtonDisabled} onClick={()=>{setMaybeButtonDisabled(true); setNoButtonDisabled(false);setYesButtonDisabled(false)}}>Maybe</Button>
                        </ButtonGroup>
                        <div id="available">{peopleCount} people joning this event</div>
                    </aside>
                    <br /> <br />
                    <hr className={EDstyles.hr} />
                    <div className={EDstyles.about}>About</div>
                    <div className={EDstyles.exp1}>
                    <p >{Events.eventDescription}</p> 
                    </div>
                </div>

            </main>
        </section>
    )
}