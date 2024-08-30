import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import AppBarAdmin from "../components/Appbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const newProduct = {
      productName,
      productDescription,
      productPrice: parseFloat(productPrice),
      productImage,
    };

    try {
      const response = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prevProducts) => [...prevProducts, addedProduct]);
        console.log("Product added successfully");

        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductImage("");
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleProductUpdate = async (product) => {
    const updatedProduct = {
      productName: prompt("Enter new product name", product.productName),
      productDescription: prompt(
        "Enter new product description",
        product.productDescription
      ),
      productPrice: prompt("Enter new product price", product.productPrice),
      productImage: prompt("Enter new product image URL", product.productImage),
    };

    try {
      const response = await fetch(
        `http://localhost:8080/products/${product.productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.productId === product.productId ? { ...p, ...updatedProduct } : p
          )
        );
        console.log("Product updated successfully");
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleProductDelete = async (product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${product.productName}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/products/${product.productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.productId !== product.productId)
        );
        console.log("Product deleted successfully");
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <AppBarAdmin />
      <Box mt={4} mx={10}>
        <Paper elevation={3} style={{ padding: "20px", marginBottom: "2rem" }}>
          <form onSubmit={handleAddProduct}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Product Description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Product Price"
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Product Image URL"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px", float: "right" }}
                >
                  Add Product
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Divider style={{ margin: "2rem 0" }} />

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.productId} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
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
                    color="primary"
                    onClick={() => handleProductUpdate(product)}
                    style={{ marginRight: "10px", marginTop: "10px" }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleProductDelete(product)}
                    style={{ marginTop: "10px" }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
