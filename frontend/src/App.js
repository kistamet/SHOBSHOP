import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import "../src/App.css";

function App() {

  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalShippingFee, setTotalShippingFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const AddToCart = (product) => {
    const newItem = {
      id: product.id,
      quantity: 1,
    };
    const newItems = [...items, newItem];
    console.log(newItems);
    setItems(newItems);
    Axios.post('http://localhost:9876/cart-summary', { items: newItems })
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

  const use_couponCode = (couponCode) => {
    const payload = {
      items: items.map(item => ({ id: item.id, quantity: item.quantity })),
      couponCode: couponCode
    };
    console.log(payload)
    Axios.post('http://localhost:9876/cart-summary', payload)
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
    Axios.get('http://localhost:9876/products').then((response) => {
      setProducts(response.data)
    });
  }

  useEffect(() => {
    getProducts();
  }, []);

  console.log(products)
  return (
    <div className='layout'>
      <h2 className="Heading">
        รายการสินค้า
      </h2>
      <div class="grid-container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img
              className="card-media"
              src={product.imgUrl}
              alt={product.name}
            />
            <div className="card-content">
              <p className="name-product">{product.name}</p>
              <p className="price-product">
                ฿{product.price.toLocaleString()}
              </p>
              <button className="button" onClick={() => AddToCart(product)}>
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          height: "250px",
        }}
      ></p>
      <div class="footer">
        <div className="containerfooter">
          <p className="box">
            <input
              label="Input field"
              variant="outlined"
              className="input-field"
              placeholder="รหัสคูปอง"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)} />
            <button className="button-couponCode" onClick={() => use_couponCode(couponCode)}>
              ใช้คูปอง
            </button>
          </p>
          <p className="box" marginTop="20px">
            <p className="subtotal">ราคาสินค้า ({items.length} ชิ้น) </p>
            <p className="price">฿{subtotal.toLocaleString()}</p>
          </p>
          <p className="box">
            <p className="shipping">ค่าส่ง</p>
            <p className="price">฿{totalShippingFee.toLocaleString()}</p>
          </p>
          <p className="box">
            <p className="discount">ส่วนลดจากคูปอง</p>
            <p className="price">฿{totalDiscount.toLocaleString()}</p>
          </p>
          <p className="box">
            <p className="total">รวมทั้งหมด</p>
            <p className="total">฿{grandTotal.toLocaleString()}</p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
