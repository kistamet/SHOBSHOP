const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"",
    database:"products",
})

app.get('/products' ,(req, res) => {
    db.query("SELECT * FROM products" , (err , result) => {
        if(err) {
            console.log(err)
        } else{
            res.send(result);
        }
    })
})

app.post('/cart-summary', (req, res) => {
    const { items, couponCode } = req.body;
  
    // Retrieve products from the database
    const query = 'SELECT * FROM products WHERE id IN (?)';
    const ids = items.map(item => item.id);
    db.query(query, [ids], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while retrieving products.');
        return;
      }
  
      // Calculate subtotal
      const subtotal = items.reduce((total, item) => {
        const { id, quantity } = item;
        const product = results.find(p => p.id === id);
        return total + (product.price * quantity);
      }, 0);
  
      // Calculate total shipping fee
      const uniqueIds = [...new Set(items.map(item => item.id))];
      const totalShippingFee = uniqueIds.reduce((total, id) => {
        const item = items.find(item => item.id === id);
        const product = results.find(p => p.id === id);
        const shippingFee = product.shippingFee || 0;
        return total + (shippingFee * item.quantity);
      }, 0);
  
      // Calculate discount
      let totalDiscount = 0;
      if (couponCode) {
        const coupon = coupons.find(c => c.code === couponCode);
        if (coupon) {
          totalDiscount = subtotal * (coupon.discountPercentage / 100);
        }
      }
  
      // Calculate grand total
      const grandTotal = subtotal + totalShippingFee - totalDiscount;
  
      res.send({
        subtotal,
        totalShippingFee,
        totalDiscount,
        grandTotal
      });
    });
  });
  
app.listen('9876' , () => {
    console.log('server is running on port 9876')
})