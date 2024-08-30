import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import useLogout from "../js/logout";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

export default function AppBarUser() {
  const handleLogout = useLogout();
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spring Boot With React
          </Typography>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={handleHomeClick}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<ShoppingCartIcon />}
            onClick={handleCartClick}
          >
            Cart
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
