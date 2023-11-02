import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavbarProvider } from './Components/Common/navbarModule/NavbarContext';
import Navbar from './Components/Common/navbarModule/Navbar';
import Homepage from './Components/Pages/Homepage/Homepage';
import Login from './Components/Pages/Login/Login';
import Desk from './Components/Pages/Desk/desk';
import Register from './Components/Pages/Register/Register';
import Notify from './Components/Pages/Notification/Notification';
import Room from './Components/Pages/Room/Room';
import CalendarComponent from './Components/Pages/Calendar/Calendar';
import RoomBooking from './Components/Pages/RoomBooking/RoomBooking';
import UserProfileForm from './Components/Pages/UserProfile/UserProfile';
import Events from './Components/Pages/Events/Events';
import EventDescription from './Components/Pages/EventDescription/EventDescription';
import YourBookings from './Components/Pages/YourBookings/YourBookings/YourBookings';
import UpdateBookings from './Components/Pages/YourBookings/UpdateYourBookings/UpdateBookings';
import NotifyDesc from './Components/Pages/NotificationDescription/notifyDesc';


function App() {
  return (
    <div>
      <BrowserRouter>
        <NavbarProvider>
            <Routes>
              <Route path="/" element={<Navbar />} />
              <Route path="/desk" element={<Navbar />} />
              <Route path="/yourbooking" element={<Navbar />} />
              <Route path="/notification" element={<Navbar />} />
              <Route path="/room" element={<Navbar />} />
              <Route path="/calendar" element={<Navbar />} />
              <Route path="/roombooking/:roomId" element={<Navbar />} />
              <Route path="/userprofile" element={<Navbar />} />
              <Route path="/events" element={<Navbar />} />
              <Route path="/eventdescription/:id" element={<Navbar />} />
              <Route path="/NotifyDesc/:notificationId" element={<Navbar />} />
              <Route path="/updateroombooking/:roomId" element={<Navbar />} />
              <Route path="/roombooking/:roomId" element={<Navbar />} />
            </Routes>
          <div>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/desk" element={<Desk />} />
              <Route path="/yourbooking" element={<YourBookings />} />
              <Route path="/register" element={<Register />} />
              <Route path="/notification" element={<Notify />} />
              <Route path="/room" element={<Room />} />
              <Route path="/calendar" element={<CalendarComponent />} />
              <Route path="/roombooking/:roomId" element={<RoomBooking />} />
              <Route path="/updateroombooking/:roomId" element={<UpdateBookings />} />
              <Route path="/userprofile" element={<UserProfileForm />} />
              <Route path="/events" element={<Events />} />
              <Route path="/eventdescription/:id" element={<EventDescription />} />
              <Route path="/NotifyDesc/:notificationId" element={<NotifyDesc />} />
            </Routes>
          </div>
        </NavbarProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
