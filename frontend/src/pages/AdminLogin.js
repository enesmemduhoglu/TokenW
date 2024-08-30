import React, { useState } from "react";
import AppBarUna from "../components/AppbarUnA";
import { Container, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useAuth } from "../AuthContext";

const paperStyle = {
  padding: "50px 20px",
  width: 600,
  margin: "20px auto",
};

function AdminLog() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    const infos = { username, password };

    fetch("http://localhost:8080/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infos),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response data:", data);
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          login({ username: username, role: "ADMIN" });
          navigate("/adminPage");
        } else {
          setError("Login failed. Please try again.");
        }
      })
      .catch((error) => {
        setError("An error occurred. Please try again.");
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <AppBarUna />
      <Container>
        <Paper elevation={3} style={paperStyle}>
          <h1 style={{ color: "#1976d2" }}>Admin Login</h1>
          {error && <p style={{ color: "red" }}>{error}</p>} {}
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
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
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleClick}>
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminLog;
