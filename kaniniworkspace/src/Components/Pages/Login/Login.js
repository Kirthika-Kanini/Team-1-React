import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import kaninilogo from "../../..//Assets/Login/kaninilogo.svg";
import closeicon from "../../..//Assets/Login/closeicon.svg";
import forgot from "../../..//Assets/Login/forgot.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  Grid,
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import mainLogoImage from "../../../Assets/Login/mainlogo.jpg";
import mainLogoText from "../../../Assets/Login/mainlogotext.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

export default function Login() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loginData, setLoginData] = useState({
    UserEmail: "",
    UserPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const closeModal = () => {
    setShowModal(false);
    setShowOverlay(false);
  };

  const togglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !loginData.UserEmail.match(/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!loginData.UserEmail || !loginData.UserPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    axios
      .post("https://localhost:7243/api/Authorization/login", loginData)
      .then((response) => {
        localStorage.setItem("token", response.data);
        const tokenPayload = response.data.split(".")[1];
        const decodedTokenPayload = atob(tokenPayload);
        const tokenPayloadObject = JSON.parse(decodedTokenPayload);
        const userId = tokenPayloadObject.UserId;
        localStorage.setItem("userId", userId);

        toast.success("LoggedIn Successfully");
        const wheretonav = localStorage.getItem("forgotpassword");
        setTimeout(() => {
          if (wheretonav === "1") {
            navigate("/userprofile");
          } else {
            navigate("/");
          }
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Invalid Email (or) Password. Login Failed");
      });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const imageURL = "./mainlogo.jpg";
  const Background = styled("div")({
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${imageURL})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  });

  const handleForgotPassword = () => {
    setShowModal(true);
    setShowOverlay(true);
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();

    if (!loginData.UserEmail || !validateEmail(loginData.UserEmail)) {
      toast.error("Please Enter a valid Email Address");
      return;
    }

    axios
      .post("https://localhost:7243/Api/ForgotPassword", {
        email: loginData.UserEmail,
      })
      .then((response) => {
        const d = response.data;
        sendEmail(d, loginData.UserEmail);
        toast.success("Password reset instructions sent to your email");
        closeModal();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to send password reset instructions");
      });
  };

  function sendEmail(d, UserEmail) {
    localStorage.setItem("forgotpassword", 1);

    const templateParams = {
      to_name: UserEmail,
      from_name: 'Kanini Team',
      new_password: `${d}`,
      to_email: UserEmail
    };

    emailjs
      .send('service_5ikxxii', 'template_4y41v9m', templateParams, 'IZyAVvof5uXyuWVp6')
      .then((response) => {
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }
  return (
    <Box>
      <Grid container spacing={2} sx={{ height: "102vh" }}>
        <Grid
          item
          xs={12}
          sm={7}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${mainLogoImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <img src={mainLogoText} width={"80%"} />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={5}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ marginLeft: "5%", marginRight: "5%", marginBottom: "5%" }}>
            <Box sx={{ width: "100%" }}>
              <img src={kaninilogo} alt="Kanini Logo" />
            </Box>
            <Box sx={{ width: "100%", marginTop: "10%" }}>
              <h1 style={{ textAlign: "left" }}>Sign In</h1>
              <p style={{ paddingBottom: "1%" }}>
                Welcome back! Please enter email id and password
              </p>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                type="text"
                id="username"
                name="UserEmail"
                label=" User Email "
                value={loginData.UserEmail}
                onChange={handleInputChange}
                placeholder="name@kanini.com"
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                mt={1}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                name="UserPassword"
                value={loginData.UserPassword}
                onChange={handleInputChange}
                placeholder="*********"
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                mt={1}
                style={{ display: "block", marginBottom: "2px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePassword}>
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box textAlign="right" mt={1} mb={2}>
                <Button
                  type="button"
                  variant="text"
                  onClick={handleForgotPassword}
                >
                  Forgot Your Password?
                </Button>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                SIGN IN
              </Button>
              <Box textAlign="center" mt={2}>
                <span> Don't Have an Account?</span>
                <Button type="button" variant="text" onClick={handleRegister}>
                  Sign up
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {showModal && showOverlay && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}

      {showModal && (
        <div
          className="modal show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <form onSubmit={handlePasswordResetSubmit}>
                  <div className="mb-3">
                    <img
                      style={{ float: "right" }}
                      src={closeicon}
                      onClick={closeModal}
                      alt="Close Icon"
                    />
                    <div style={{ textAlign: "center" }}>
                      <img src={forgot} align="center" alt="Forgot Logo" />
                    </div>
                    <div style={{ margin: "auto" }}>
                      <h5
                        className="modal-title"
                        id="exampleModalLabel"
                        style={{ textAlign: "center" }}
                      >
                        Forget Password?
                      </h5>
                      <p style={{ textAlign: "center" }}>
                        No worries, we'll send you reset instructions
                      </p>
                      <label htmlFor="resetEmail" className="form-label">
                        Email address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="resetEmail"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                        value={loginData.UserEmail}
                        onChange={handleInputChange}
                        name="UserEmail"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          marginTop: "30px",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </Box>
  );
}