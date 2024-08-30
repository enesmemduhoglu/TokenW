import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AppBarUser from "../components/AppbarUser";
import { jwtDecode } from "jwt-decode";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.error("Access token is not available");
        return;
      }

      const decodedToken = jwtDecode(accessToken);
      const userId = decodedToken.user_id;

      try {
        const response = await fetch(`http://localhost:8080/cart/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = (productId) => {};

  return (
    <div>
      <AppBarUser />
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Shopping Cart
        </Typography>

        <Divider style={{ marginBottom: "2rem" }} />

        <Grid container spacing={4}>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <Grid item key={`${item.productId}-${index}`} xs={12}>
                <Card>
                  <Grid container>
                    <Grid item xs={4}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.productImage}
                        alt={item.productName}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.productDescription}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          Price: ${item.productPrice * item.quantity}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          Quantity: {item.quantity}
                        </Typography>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" component="p">
              Your cart is empty.
            </Typography>
          )}
        </Grid>
      </Container>
    </div>
  );
}
