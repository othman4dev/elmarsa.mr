import { useEffect, useState } from "react";
import "./EmptyProduct.scss";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js";
import { getProductsBySeller, getAllUsers } from "../../redux/apiCalls.js";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import LoaderComponent from "../../components/Loader/LoaderComponent.jsx";
import ProductContainer from "../ProductContainer/ProductContainer.jsx";

const EmptyProduct = () => {
  const { t } = useTranslation();
  const userFromRedux = useSelector((state) => state.user.currentUser);
  const storedUser = JSON.parse(localStorage.getItem("persist:root"))?.user;

  const user = userFromRedux || storedUser;
  const [loading, setLoading] = useState(false); // Loading state

  const [isStore, setIsStore] = useState(false);
  useEffect(() => {
    setIsStore(user?.role === "store");
  }, [user]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [seller, setSeller] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await getProductsBySeller();
        const fetchedUsers = await getAllUsers();

        const productsWithSellers = res.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return {
            ...product,
            createdAt: product.createdAt
              ? format(new Date(product.createdAt), "MMM dd, yyyy")
              : "Date not available",
            seller: seller || null,
          };
        });

        setProducts(productsWithSellers);
        setUsers(fetchedUsers);

        // Set the first product's seller
        if (productsWithSellers.length > 0) {
          setSeller(productsWithSellers[0].seller || null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoaderComponent />
        </div>
      ) : products.length === 0 ? (
        <div className="empty">
          {products.length}
          <img src="/noResultActivate.png" alt="" />
          <p>{t("do_you_have_something_to_sell")}</p>
        </div>
      ) : (
        <ProductContainer products={products} link={'productDetails'}/>
      )}
    </div>
  );
};
export default EmptyProduct;
