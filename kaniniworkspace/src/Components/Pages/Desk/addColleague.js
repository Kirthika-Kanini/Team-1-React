import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import closeicon from "../../../Assets/Desk/closeicon.svg";
import search from "../../../Assets/Desk/search.svg";
 
const USER_PROFILE = "https://localhost:7243/uploads";

function AddColleagues({ open, onClose, selectedColleague, setSelectedColleague, filteredUsers, handleAddSelectedColleague }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxWidth: "100%",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 4,
        }}
      >
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <img src={closeicon} alt="Close" />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: "20px",
              fontWeight: "549",
              marginTop: "-10px",
              textTransform: "capitalize",
            }}
          >
            Add Colleagues
          </Typography>
          <Box>
            <Autocomplete
              value={selectedColleague}
              onChange={(event, newValue) => setSelectedColleague(newValue)}
              options={filteredUsers}
              getOptionLabel={(user) =>
                `${user.userFirstName} ${user.userLastName}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="user"
                  variant="outlined"
                  type="text"
                  sx={{
                    width: "100%",
                    marginBottom: "8px",
                    border: "none",
                    marginTop: "2%",
                    position: "relative",
                  }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: null,
                  }}
                />
              )}
              renderOption={(props, user) => (
                <li {...props}>
                 <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`${USER_PROFILE}/user/${user.userImagePath}`}
                      alt="Profile"
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                    {`${user.userFirstName} ${user.userLastName}`}
                  </Box>
                </li>
              )}
            />
            <img
              src={search}
              style={{ marginLeft: "89%", zIndex: "1", marginTop: "-23%" }}
              alt="search"
            />
            <Button
              style={{
                width: "70px",
                height: "30px",
                color: "white",
                backgroundColor: "#4169E1",
                textTransform: "capitalize",
                marginTop: "28%",
                float: "left",
              }}
              onClick={handleAddSelectedColleague}
            >
              Add
            </Button>
            <Button
              onClick={onClose}
              style={{
                float: "left",
                marginLeft: "3%",
                marginTop: "27%",
                color: "#626D8A",
                fontSize: "16px",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddColleagues;