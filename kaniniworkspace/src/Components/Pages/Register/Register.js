import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import kaninilogo from '../../..//Assets/Register/kaninilogo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Grid, Box, Button, Typography, TextField, IconButton, InputAdornment } from '@mui/material';
import mainLogoImage from '../../../Assets/Register/mainlogo.jpg';
import mainLogoText from '../../../Assets/Register/mainlogotext.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import emailjs from "emailjs-com";


const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    UserFirstName: '',
    UserLastName: '',
    UserLocation: '',
    UserDepartment: '',
    UserTitle: '',
    UserEmail: '',
    UserPhoneNumber: '',
    UserPassword: '',
    EmployeeId: '',
    UserImagePath: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if ((name === 'UserFirstName' || name === 'UserLastName') && /\d/.test(value)) {
      return;
    }
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setUser({ ...user, UserImagePath: imageFile });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !user.UserFirstName ||
      !user.UserLastName ||
      !user.UserLocation ||
      !user.UserDepartment ||
      !user.UserTitle ||
      !user.UserEmail ||
      !user.UserPhoneNumber ||
      !user.UserPassword ||
      !user.UserImagePath ||
      !user.EmployeeId
    ) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!user.UserEmail.match(/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!/^\d{10}$/.test(user.UserPhoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const validatePassword = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      return regex.test(password);
    };
    
    if (!validatePassword(user.UserPassword)) {
      toast.error('Password must contain "One Uppercase Letter, One Lowercase Letter, One Number, One Special Character, and be at least 6 characters long"');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('UserFirstName', user.UserFirstName);
      formData.append('UserLastName', user.UserLastName);
      formData.append('UserLocation', user.UserLocation);
      formData.append('UserDepartment', user.UserDepartment);
      formData.append('UserTitle', user.UserTitle);
      formData.append('UserEmail', user.UserEmail);
      formData.append('UserPhoneNumber', user.UserPhoneNumber);
      formData.append('UserPassword', user.UserPassword);
      formData.append('EmployeeId', user.EmployeeId);
      formData.append('imageFile', user.UserImagePath);

      const response = await axios.post('https://localhost:7243/userprofile/PostUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const d = response.data
      sendEmail(d, user.UserEmail)
      toast.success("Registered Successfully");

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast.error("Failed to Register");
    }
  };

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = () => {
    navigate('/login');
  };

  function sendEmail(d, UserEmail) {

    localStorage.setItem('forgotpassword', 1)

    const template = {
      to_name: user.UserFirstName,
      from_name: 'Kanini Team',
      EmployeeId: user.EmployeeId,
      UserLocation: user.UserLocation,
      UserDepartment: user.UserDepartment,
      UserTitle: user.UserTitle,
      UserEmail: user.UserEmail,
      UserPhoneNumber: user.UserPhoneNumber,
      UserPassword:user.UserPassword,
      to_email: UserEmail
    };

    emailjs
      .send('service_5ikxxii', 'template_bx73xrj', template, 'IZyAVvof5uXyuWVp6')
      .then((response) => {
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ height: '102vh' }}>
        <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${mainLogoImage})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <img src={mainLogoText} width={'80%'} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ marginLeft: '5%', marginRight: '5%', marginBottom: '5%' }}>
            <Box sx={{ width: '100%' }}>
              <img src={kaninilogo} alt="Kanini Logo" />
            </Box>
            <Box sx={{ width: '100%', marginTop: '10%' }}>
              <h1 style={{ textAlign: 'left' }}>Register</h1>
              <p style={{ paddingBottom: '2%' }}>Create an account! Please enter the Fields</p>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="firstName"
                    name="UserFirstName"
                    value={user.UserFirstName}
                    onChange={handleInputChange}
                    label="First Name"
                    placeholder="John"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    type="text"
                    id="lastName"
                    name="UserLastName"
                    value={user.UserLastName}
                    onChange={handleInputChange}
                    label="Last Name"
                    placeholder="Doe"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    type="text"
                    id="email"
                    name="UserEmail"
                    value={user.UserEmail}
                    onChange={handleInputChange}
                    label="Email"
                    placeholder="name@kanini.com"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <div style={{ position: 'relative' }}>
                    <TextField
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="UserPassword"
                      value={user.UserPassword}
                      onChange={handleInputChange}
                      label="Password"
                      placeholder="*********"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={togglePassword}>
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="location"
                    name="UserLocation"
                    value={user.UserLocation}
                    onChange={handleInputChange}
                    label="Location"
                    placeholder="Location"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    type="text"
                    id="department"
                    name="UserDepartment"
                    value={user.UserDepartment}
                    onChange={handleInputChange}
                    label="Department"
                    placeholder="Department"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    type="text"
                    id="title"
                    name="UserTitle"
                    value={user.UserTitle}
                    onChange={handleInputChange}
                    label="Title"
                    placeholder="Title"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    type="text"
                    id="phoneNumber"
                    name="UserPhoneNumber"
                    value={user.UserPhoneNumber}
                    onChange={handleInputChange}
                    label="Phone Number"
                    placeholder="Phone Number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="text"
                    id="employeeId"
                    name="EmployeeId"
                    value={user.EmployeeId}
                    onChange={handleInputChange}
                    label="Employee ID"
                    placeholder="Employee ID"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} mt={2}>
                  <input
                    type="file"
                    id="imagePath"
                    name="UserImagePath"
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imagePath">
                    <Button component="span" variant="outlined" color="primary">
                      Upload Image
                    </Button>
                  </label>
                  {user.UserImagePath && (
                    <div>
                      <Typography variant="body1" gutterBottom>
                        {user.UserImagePath.name}
                      </Typography>
                    </div>
                  )}
                </Grid>

              </Grid>

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
              </Button>
            </Box>
            <Box textAlign="center" mt={2}>
              <span>Already have an account?</span>
              <Button type="button" variant="text" onClick={handleRegister}>
                 Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Register;