import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBarUna from "../components/AppbarUnA";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Paper, Button } from "@mui/material";
import { useAuth } from "../AuthContext";

const paperStyle = {
  padding: "50px 20px",
  width: 600,
  margin: "20px auto",
};

export default function TextFields() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill out all fields.");
      return;
    }

    const infos = { username, password };

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(infos),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            console.error(
              "Error from backend:",
              data.message || "Unknown error"
            );
            setError(data.message || "Login failed. Please try again.");
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          login({ username: username, role: "USER" });
          navigate("/home");
        }
      })
      .catch((error) => {
        setError("A network error occurred. Please try again.");
        console.error("Network or other error:", error);
      });
  };

  return (
    <div>
      <AppBarUna />
      <Container>
        <Paper elevation={3} style={paperStyle}>
          <h1 style={{ color: "#1976d2" }}>Login</h1>
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
