import React from "react";
import { useEffect, useState } from "react";
import SelectCategory from "../../components/selectCategory/SelectCategory";
import "./Category.scss";
import { publicRequest } from "../../axios";
import ProductCard from "../../components/productCard/ProductCard";
import { notifyUser } from "../../components/notifyuser/ToastMessage";
import { Link, useLocation, useParams } from "react-router-dom";
import { set } from "date-fns";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import { format } from "date-fns";
import { getAllUsers } from "../../redux/apiCalls.js";
import { useSelector } from "react-redux";
import LoaderComponent from "../../components/Loader/LoaderComponent.jsx";
import { FaFire } from "react-icons/fa";
import ProductContainer from "../../components/ProductContainer/ProductContainer.jsx";
import CategoriesContainer from "../../components/CategoriesContainer/CategoriesContainer.jsx";
import PopularSubCategories from "../../components/PopularSubCategories/PopularSubCategories.jsx";

const Category = () => {
  const categories = useSelector((state) => state.category.categories);
  console.log("categories : ", categories);

  const [category, setCategory] = useState("");
  const { t, i18n } = useTranslation();
  window.scrollTo({ top: 0, behavior: "auto" });
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("-createdAt");
  const [categoryId, setCategoryId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const location = useLocation();
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  const handleSelectCategory = (categoryId) => {
    setCategoryId(categoryId);
  };

  const { id, search } = useParams();
  //console.log(search);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Start loading
        let query = "/api/product";
        let params = [];

        if (sort) {
          params.push(`sort=${sort}`);
        }
        if (categoryId) {
          params.push(`categoryId=${categoryId}`);
        } else if (id) {
          params.push(`categoryId=${id}`);
        }
        if (params.length > 0) {
          query += "?" + params.join("&");
        }
        //console.log(query);

        const res = await publicRequest.get(query);
        const productsData = Array.isArray(res.data.data.product)
          ? res.data.data.product
          : [];

        // Fetch sellers after fetching the products
        const fetchedUsers = await getAllUsers();

        // Associate each product with its seller
        const productsWithSellers = productsData.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return { ...product, seller };
        });
        const filteredProducts =
          category !== ""
            ? productsWithSellers.filter(
              (product) => product.categoryId === category
            )
            : productsWithSellers;
        setProducts(filteredProducts);
        //console.log("products with sellers: ", productsWithSellers);
      } catch (error) {
        //console.log(error);
        notifyUser("error", "Something went wrong");
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    const searchProduct = async () => {
      try {
        setLoading(true); // Start loading
        let query = `/api/product/search?q=${search}`;
        const res = await publicRequest.get(query);
        const productsData = Array.isArray(res.data.data) ? res.data.data : [];

        // Fetch sellers after searching the products
        const fetchedUsers = await getAllUsers();

        // Associate each product with its seller
        const productsWithSellers = productsData.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return { ...product, seller };
        });

        setProducts(productsWithSellers);
        //console.log("products with sellers after search: ", productsWithSellers);
      } catch (error) {
        //console.log(error);
        notifyUser("error", "Something went wrong");
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    if (search) {
      searchProduct();
    } else {
      fetchProducts();
    }
  }, [sort, categoryId, search, category]);

  const handleCategoryClick = (categoryId) => {
    if (category === categoryId) {
      setCategory(""); // Désélectionner la catégorie si elle est déjà sélectionnée
    } else {
      setCategory(categoryId); // Sélectionner une nouvelle catégorie
    }
  };

  return (
  <div>
      {/* <CategoriesContainer categories={categories} category={category} handleCategoryClick={handleCategoryClick} /> */}
      <PopularSubCategories hidden={true} setSelectedSubCategory={setSelectedSubCategory}/>
      {loading ? (
        <div
          className="flex items-center justify-center h-screen"
          style={{ marginTop: "-227px" }}
        >
          <LoaderComponent />
        </div>
      ) : (
        <ProductContainer
          category={category}
          products={products}
          link={"viewProduct"}
        />
      )}
  </div>
  );
};

export default Category;
