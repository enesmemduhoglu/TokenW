import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import AppBarAdmin from "../components/Appbar";

export default function Admin() {
  return (
    <div>
      <AppBarAdmin />
      <Container maxWidth="md">
        <Box mt={4}>
          <Paper elevation={3}>
            <Box p={4}>
              <Typography variant="h4" gutterBottom>
                Admin Panel
              </Typography>
              <Typography variant="body1">
                Welcome to the admin dashboard. Here you can manage users,
                settings, and more. Use the navigation menu to access different
                sections.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
