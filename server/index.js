const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "products",
})

app.get('/products', (req, res) => {
    db.query("SELECT * FROM products", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    })
})

// let scores = [82 , 75 , 48 ,64 ,36];
// let sumScores = scores.reduce((sum , score) => {
//     console.log(sum)
//     console.log(score)
//     console.log( "sumScores"+" "+sum + score)
//     return sum + score;
// },0)

// console.log(sumScores)


app.post('/cart-summary', (req, res) => {
    const { items, couponCode } = req.body;
    
    // Retrieve products from the database
    const query = 'SELECT * FROM products WHERE id IN (?)';
    const ids = items.map(item => item.id); //แยกเอาแค่ id
    db.query(query, [ids], (err, results) => { // query ตัวที่ตาม id
        if (err) {
            console.log(err)
        }

        // Calculate subtotal
        let subtotal = items.reduce((total, item) => {
            const { id, quantity } = item; // แยก id กับ quantity ออกจากัน
            const product = results.find(p => p.id === id); //เปรียบเทียบ id ที่ได้กับข้อมูลใน DB
            return total + (product.price * quantity); // คิดราคารวม ราคา * จำนวน
        }, 0);

        // Calculate total shipping fee
        const uniqueIds = [...new Set(items.map(item => item.id))]; //แยก id ที่ซ้ำกันออกโดยใช้ set แล้วแปลงเป็น array
        let totalShippingFee = uniqueIds.reduce((total, id) => {
            const product = results.find(p => p.id === id);
            const shippingFee = product.shippingFee ;
            return total + shippingFee;
        }, 0);

        // Calculate grand total
        let grandTotal = subtotal + totalShippingFee;

        // Calculate discount
        let totalDiscount = 0;
        if (couponCode) {
            if (couponCode === "FREESHIPPING" && subtotal >= 500) {
                totalDiscount = totalShippingFee
                grandTotal = subtotal;
                totalShippingFee = 0
            }
            if (couponCode === "SHOBSHOP20" ) {
                const maxDiscount = 50; //ค่าที่เราตั้งไว้ให้ไม่เกิน
                const discountPercentage = 0.2; // 20%
                const discountAmount = Math.min(subtotal * discountPercentage, maxDiscount); // นำค่าส่วนลด(subtotal * 0.2) มาเทียบกับค่าสูงสุดที่จะไม่เกิน(maxDiscount) แล้วเอาตัวที่น้อยที่สุด
                totalDiscount = discountAmount;
                grandTotal = subtotal + totalShippingFee - totalDiscount ;
            }
            if (couponCode === "SHIPPING20" ) {
                totalShippingFee = totalShippingFee - 20
                totalDiscount = 20
                grandTotal = subtotal + totalShippingFee ;
            }
        }
        res.send({
            subtotal, //ราคาทั้งหมด
            totalShippingFee, //ราคาส่งทั้งหมด
            totalDiscount, //ราคาลดทั้งหมด
            grandTotal // ราคารวม ค่าจัดส่ง ส่วนลด
        });
    });
});

app.listen('9876', () => {
    console.log('server is running on port 9876')
})