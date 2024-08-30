import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import AppBarUser from "../components/AppbarUser";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserId(decodedToken.user_id);
    } else {
      console.error("No token found");
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8080/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    getProducts();
  }, []);

  function handleAddToCart(productId, quantity) {
    const accessToken = localStorage.getItem("access_token");

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    fetch("http://localhost:8080/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        productId: productId,
        quantity: quantity,
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        console.log("Response from server:", text);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }

  return (
    <div>
      <AppBarUser />
      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Grid container spacing={4} style={{ marginTop: "2rem" }}>
          {products.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.productImage}
                  alt={product.productName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.productDescription}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Price: ${product.productPrice}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleAddToCart(product.productId, 1)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
