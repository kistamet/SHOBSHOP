import Axios from 'axios'
import React, { useEffect, useState } from 'react';
import "../src/App.css";

function App() {

  const [products, setProducts] = useState([]); //สินค้า

  const [items, setItems] = useState([]); //ตระกร้าสินค้า
  const [subtotal, setSubtotal] = useState(0); //ราคาทั้งหมด
  const [totalShippingFee, setTotalShippingFee] = useState(0); //ราคาส่งทั้งหมด
  const [totalDiscount, setTotalDiscount] = useState(0); //ราคาลดทั้งหมด
  const [grandTotal, setGrandTotal] = useState(0); //ราคารวม ค่าจัดส่ง ส่วนลด
  const [couponCode, setCouponCode] = useState(""); //คูปอง

  const AddToCart = (product) => {
    const AddNewItem = {
      id: product.id,
      quantity: 1,
    };
    
    const newItems = items.map(item => { //ตรวจสอบว่าถ้ามี id อยู่แล้วใน items(ตระกร้าสินค้า) จะทำการ quantity + 1
      if (item.id === AddNewItem.id) {
        return { ...item, quantity: item.quantity + 1 };
      } else {
        return item;
      }
    });
    
    // ตรวจสอบ id ของสินค้าที่พึ่ง Add มาใน newItems ถ้าไม่เจอสินค้าที่มี id เดียวกัน
    // ก็เพิ่มสินค้านั้นเข้าไปใน array newItems
    if (!newItems.some(item => item.id === AddNewItem.id)) {
      newItems.push(AddNewItem);
    } 

    setItems(newItems);
    Axios.post('http://localhost:9876/cart-summary', { items: newItems })
      .then((response) => {
        //เมื่อคำนวณเสร็จ ก็รับค่า response มาจาก /cart-summary
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

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0); //หาจำนวนทั้งหมด

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
            <p className="subtotal">ราคาสินค้า ({totalQuantity} ชิ้น) </p>
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
