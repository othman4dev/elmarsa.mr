import "./MyFav.scss";
import { useState, useEffect } from "react";
import ProductCard from "../../components/productCard/ProductCard";
import { useTranslation } from "react-i18next";
import { getAllUsers, getFavorites } from "../../redux/apiCalls.js";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import LoaderComponent from "../../components/Loader/LoaderComponent.jsx";
import ProductContainer from "../../components/ProductContainer/ProductContainer.jsx";

const MyFav = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true); // Start loading
        const res = await getFavorites();

        // Formater la date
        const formattedProducts = res.map((r) => ({
          ...r,
          createdAt: r?.createdAt
            ? format(new Date(r.createdAt), "MMM dd, yyyy")
            : "Date not available",
        }));

        //console.log("res:", formattedProducts);

        const fetchedUsers = await getAllUsers();

        // Associer chaque produit à son vendeur
        const productsWithSellers = formattedProducts.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return { ...product, seller };
        });

        setProducts(productsWithSellers);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoaderComponent />
        </div>
      ) : (
        <ProductContainer products={products} link={"viewProduct"} />
      )}
    </div>
  );
};

export default MyFav;
