import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import navlogo from "../../../Assets/Navbar/navlogo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import profilepic from "../../../Assets/Navbar/profilepic.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useNavbarContext } from "./NavbarContext";
import axios from "axios";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 957px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    axios
      .get(`https://localhost:7243/userprofile/GetUserById/${userId}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [userId]);

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
    setProfileMenuOpen(true);
  };

  const handleProfileLogout = (event) => {
    localStorage.clear();
    setProfileMenuOpen(false);
    navigate("/login");
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
    setProfileMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setDropdownOpen(false);
  };

  const { isNavbarVisible } = useNavbarContext();

  if (!isNavbarVisible) {
    return null;
  }

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Box sx={{ marginLeft: "5%", marginRight: "5%" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {!isMobile && (
            <div sx={{ display: "flex", alignItems: "center" }}>
              <img src={navlogo} alt="Logo" style={{ width: "80%" }} />
            </div>
          )}

          {isMobile ? (
            <div
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMenu}
              >
                <MenuIcon sx={{ color: 'black' }} />
              </IconButton>
              <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
                <img
                  src={navlogo}
                  alt="Logo"
                  style={{ width: "80%", marginLeft: "5%", marginTop: '8%' }}
                />
                <hr></hr>
                <ListItem button onClick={toggleMenu} sx={{ marginTop: "5%" }}>
                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography color="inherit" sx={{ textTransform: "none" }}>
                      Home
                    </Typography>
                  </Link>
                </ListItem>

                <ListItem button>
                  <div
                    style={{
                      textDecoration: "none",
                      color: "black",
                      width: "100%",
                    }}
                  >
                    <Typography
                      color="inherit"
                      sx={{ textTransform: "none" }}
                      onClick={handleDropdownOpen}
                    >
                      Book a space
                      {<ArrowDropDownIcon sx={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />}
                    </Typography>
                  </div>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleDropdownClose}
                  >
                    <MenuItem
                      component={Link}
                      to="/room"
                      onClick={() => {
                        handleDropdownClose();
                        toggleMenu();
                      }}
                    >
                      Book a room
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/desk"
                      onClick={() => {
                        handleDropdownClose();
                        toggleMenu();
                      }}
                    >
                      Book a desk
                    </MenuItem>
                  </Menu>
                </ListItem>

                <ListItem button onClick={toggleMenu}>
                  <Link
                    to="/yourbooking"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography color="inherit" sx={{ textTransform: "none" }}>
                      Your bookings
                    </Typography>
                  </Link>
                </ListItem>
                <ListItem button onClick={toggleMenu}>
                  <Link
                    to="/events"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography color="inherit" sx={{ textTransform: "none" }}>
                      Events
                    </Typography>
                  </Link>
                </ListItem>
                <ListItem button onClick={toggleMenu}>
                  <Link
                    to="/calendar"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography color="inherit" sx={{ textTransform: "none" }}>
                      Calendar
                    </Typography>
                  </Link>
                </ListItem>
              </Drawer>
            </div>
          ) : (
            <div sx={{ display: "flex", alignItems: "center" }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button color="inherit" sx={{ textTransform: "none", color: "black" }}>
                  Home
                </Button>
              </Link>
              <Button
                color="inherit"
                sx={{ textTransform: "none", color: "black" }}
                onClick={handleDropdownOpen}
                endIcon={<ArrowDropDownIcon sx={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />}
              >
                Book a space
              </Button>

              <Menu
                anchorEl={anchorEl}
                sx={{ color: "black" }}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
              >
                <MenuItem
                  component={Link}
                  to="/room"
                  onClick={() => {
                    handleDropdownClose();
                    toggleMenu();
                  }}
                >
                  Book a room
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/desk"
                  onClick={() => {
                    handleDropdownClose();
                    toggleMenu();
                  }}
                >
                  Book a desk
                </MenuItem>
              </Menu>

              <Link to="/yourbooking" style={{ textDecoration: "none" }}>
                <Button color="inherit" sx={{ textTransform: "none", color: "black" }}>
                  Your bookings
                </Button>
              </Link>
              <Link to="/events" style={{ textDecoration: "none" }}>
                <Button color="inherit" sx={{ textTransform: "none", color: "black" }}>
                  Events
                </Button>
              </Link>
              <Link to="/calendar" style={{ textDecoration: "none" }}>
                <Button color="inherit" sx={{ textTransform: "none", color: "black" }}>
                  Calendar
                </Button>
              </Link>
            </div>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/notification" style={{ textDecoration: "none" }}>
              {" "}
              <IconButton color="black" sx={{ mr: 1 }}>
                <NotificationsIcon />
              </IconButton>
            </Link>
            <Avatar
              alt="Profile Picture"
              src={`https://localhost:7243/uploads/user/${users.userImagePath}`}
              sx={{ width: 32, height: 32, mx: 1, cursor: 'pointer' }}
              onClick={handleProfileMenuOpen}
            />
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                display: { xs: "none", md: "block", color: "black" },
                cursor: "pointer",
              }}
              onClick={handleProfileMenuOpen}
              
            >
              {users.userFirstName} {users.userLastName}
              {<ArrowDropDownIcon sx={{ transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />}
            </Typography>
            <Menu
              anchorEl={profileMenuAnchorEl}
              open={profileMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <MenuItem
                component={Link}
                to="/userprofile"
                onClick={handleProfileMenuClose}
              >
                View Profile
              </MenuItem>
              <MenuItem onClick={handleProfileLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;