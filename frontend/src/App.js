import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import "../src/App.css";

function App() {

  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const handleAddToCart = (product) => {
    const newItem = {
      id: product.id,
      quantity: 1,
    };
    const newItems = [...items, newItem];
    console.log(newItems);
    setItems(newItems);
    Axios.post('http://localhost:3001/cart-summary', { items: newItems, couponCode: null })
      .then((response) => {
        setSubtotal(response.data.subtotal);
        setTotalShippingFee(response.data.totalShippingFee);
        setTotalDiscount(response.data.totalDiscount);
        setGrandTotal(response.data.grandTotal);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getProducts = () => {
    Axios.get('http://localhost:3001/products').then((response) => {
      setProducts(response.data)
    });
  }

  useEffect(() => {
    getProducts();
  }, []);



  console.log(products)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <Typography className="Heading">
        รายการสินค้า
      </Typography>
      <Grid container spacing={3} className="container">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card className="card">
              <CardMedia
                component="img"
                height="140"
                image={product.imgUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography className="title">
                  {product.name}
                </Typography>
                <Typography className="price">
                  ฿{product.price.toLocaleString()}
                </Typography>
                <Button
                  className="button"
                  onClick={() => handleAddToCart(product)}
                >
                  เพิ่มลงตะกร้า
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography
        sx={{
          width: "320px",
          height: "250px",
        }}
      ></Typography>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "200px",
          backgroundColor: "#e1d1e9",
          padding: "16px",
        }}
      >
        <div className="containerfooter">
          <Box className="box">
            <TextField label="Input field" variant="outlined" className="input-field" />
            <Button variant="contained" color="primary" className="buttoninput">
              ใช้คูปอง
            </Button>
          </Box>
          <Box className="box" marginTop="20px">
            <Typography className="items">ราคาสินค้า ({items.length}) </Typography>
            <Typography className="price">฿{subtotal.toLocaleString()}</Typography>
          </Box>
          <Box className="box">
            <Typography className="shipping">ค่าส่ง</Typography>
            <Typography className="price">฿{totalShippingFee.toLocaleString()}</Typography>
          </Box>
          <Box className="box">
            <Typography className="discount">ส่วนลดจากคูปอง</Typography>
            <Typography className="price">฿{totalDiscount.toLocaleString()}</Typography>
          </Box>
          <Box className="box">
            <Typography className="total">รวมทั้งหมด</Typography>
            <Typography className="total">฿{grandTotal.toLocaleString()}</Typography>
          </Box>
        </div>
      </Card>
    </div>
  );
}

export default App;
