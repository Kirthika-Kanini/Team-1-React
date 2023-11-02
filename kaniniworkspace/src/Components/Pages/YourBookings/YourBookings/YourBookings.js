import React, { useEffect, useState } from 'react';
import YBstyles from './YourBookings.module.css';
import RoomBookings from '../RoomBookings/RoomBookings';
import DeskBookings from '../DeskBookings/DeskBookings';
import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function YourBookings() {
    const [filterOption, setFilterOption] = useState('All');
    useEffect(() => {
    }, []);

    return (
        <section className={YBstyles.section} style={{marginTop: '2%'}}>
            <header className='mt-2'>
                <h2>Your Bookings</h2>
            </header>
            <div className={YBstyles.filterButton}>
                <button onClick={() => setFilterOption('All')}>All</button>
                <button onClick={() => setFilterOption('Desk')}>Desk</button>
                <button onClick={() => setFilterOption('Room')}>Room</button>
            </div>
            <div>
                <h4>Active Booking</h4>
            </div>
            <main>
                {
                    filterOption === 'Room' ? <RoomBookings /> :
                        filterOption === 'Desk' ? <DeskBookings /> :
                            filterOption === 'All' && (
                                <>
                                    <RoomBookings />
                                    <DeskBookings />
                                </>
                            )
                }
            </main>
        </section>
    );
}