import React, { useEffect, useState } from "react";
import LoaderComponent from "../Loader/LoaderComponent";
import ProductContainer from "../ProductContainer/ProductContainer";
import { useParams } from "react-router-dom";
import {
  filterdProducts,
  getAllUsers,
  getSubCategoriesByCategory,
} from "../../redux/apiCalls";
import { format } from "date-fns";
import FilterSection from "../FilterSection/FilterSection";
import PopularSubCategories from "../PopularSubCategories/PopularSubCategories";
import PriceRangeFilter from "../PriceRangeFilter/PriceRangeFilter";
const ProductsByFilter = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const { categoryId } = useParams();
  const [subCategpries, setSubCategories] = useState([]);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const queryParams = new URLSearchParams(location.search);

  const searchQuery = queryParams.get("searchQuery") || "";

  useEffect(() => {
    console.log("isCategoryModal :", isCategoryModal);
  }, [isCategoryModal]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchProducts = await filterdProducts(categoryId || "");
        fetchProducts.forEach((r) => {
          r.createdAt = r?.createdAt
            ? format(new Date(r.createdAt), "MMM dd, yyyy")
            : "Date not available";
        });
        const fetchedUsers = await getAllUsers();
        const productsWithSellers = fetchProducts.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return { ...product, seller };
        });

        setProducts(productsWithSellers);
        setUsers(fetchedUsers);
        console.log("products by category : ", products);
      } catch (error) {
        console.error("Error : ", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSubCategories = async () => {
      try {
        const fetchedSubCategories = await getSubCategoriesByCategory(
          categoryId
        );
        setSubCategories(fetchedSubCategories?.data.data);
        console.log("subCategories : ", subCategpries);
      } catch (error) {
        console.error("Error : ", error);
      }
    };
    fetchSubCategories();
    fetchProducts();
  }, [categoryId]);

  return (
    <div>
      <FilterSection isCategoryModal={isCategoryModal} setIsCategoryModal={setIsCategoryModal} searchQuery={searchQuery} />
      
      <PopularSubCategories
        isCategoryModal={isCategoryModal}
        setIsCategoryModal={setIsCategoryModal}
      />
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

export default ProductsByFilter;
