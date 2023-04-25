import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

function App() {

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
    console.log(cartItems)
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
      <Typography variant="h4" component="h1">
        รายการสินค้า
      </Typography>
      <Grid container spacing={3} sx={{ paddingLeft: '200px', paddingRight: '200px', paddingTop: '20px' }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={product.imgUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ฿{product.price}
                </Typography>
                <Button
                  sx={{ display: 'block', width: '100%', backgroundColor: '#99378c', color: 'white' }}
                  onClick={() => handleAddToCart(product)}
                >
                  เพิ่มลงตะกร้า
                </Button>              </CardContent>
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          height: '100%',
          paddingRight: '250px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <TextField label="Input field" variant="outlined" sx={{ width: "270px", height: "50px", color: 'white' }} />
            <Button variant="contained" color="primary" sx={{ marginLeft: '10px', width: "100px", height: "50px", backgroundColor: '#99378c' }}>ใช้คูปอง</Button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <Typography>ราคาสินค้า ({cartItems.length})</Typography>
            <Typography>ค่าส่ง</Typography>
            <Typography>ส่วนลดจากคูปอง</Typography>
            <Typography>รวมทั้งหมด</Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
