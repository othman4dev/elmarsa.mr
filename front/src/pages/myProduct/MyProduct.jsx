import ProductItem from "../../components/productItem/ProductItem";
import "./MyProduct.scss";
import { useEffect, useState } from "react";
import { publicRequest } from "../../axios.js";
import { useSelector } from "react-redux";
import EmptyProduct from "../../components/emptyProduct/EmptyProduct.jsx";

const MyProduct = () => {
  const [products, setProduct] = useState([]);
 
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await publicRequest.get("/api/products/seller" , {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setProduct(res);
    };
    fetchData();
  },[]);
  return (
    <div className="myProduct">
      <div className="wrapper">
        {products.length === 0 ? (
          <EmptyProduct />
        ) : (
          products.map((item) => {
            return <ProductItem item={item} />;
          })
        )}
      </div>
    </div>
  );
};

export default MyProduct;
