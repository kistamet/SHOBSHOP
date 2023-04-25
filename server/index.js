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

app.listen('3001' , () => {
    console.log('server is running on port 3001')
})