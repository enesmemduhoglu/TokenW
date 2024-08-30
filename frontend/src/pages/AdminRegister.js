import React, { useState } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import AppBarAdmin from "../components/Appbar";

const paperStyle = {
  padding: "50px 20px",
  width: 600,
  margin: "20px auto",
};

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const role = "ADMIN";

  const handleClick = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !password) {
      setError("Please fill out all fields.");
      return;
    }

    const infos = { firstName, lastName, username, password, role };

    fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infos),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          return response.json().then((data) => {
            setError(data.message || "Registration failed. Please try again.");
          });
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      <AppBarAdmin />
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: "#1976d2" }}>Admin Register</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="first-name"
            label="First Name"
            variant="outlined"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            id="last-name"
            label="Last Name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            id="username"
            label="User Name"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleClick}>
            Register
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
