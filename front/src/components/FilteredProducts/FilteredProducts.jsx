import React, { useEffect, useState } from "react";
import LoaderComponent from "../Loader/LoaderComponent";
import ProductContainer from "../ProductContainer/ProductContainer";
import { Link, useLocation } from "react-router-dom";
import {
  filterdProducts,
  getAllUsers,
  getSubCategory,
} from "../../redux/apiCalls";
import { format } from "date-fns";
import FilterSection from "../FilterSection/FilterSection";
import PopularSubCategories from "../PopularSubCategories/PopularSubCategories";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const FilteredProducts = () => {
  const {t, i18n} = useTranslation(); // Hooks must be used inside the component body
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [category, setCategory] = useState(null);

  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [productsLength, setProductsLength] = useState(null);

  const categoryId = queryParams.get("categoryId");
  const subCategoryId = queryParams.get("subCategoryId");
  const villes = queryParams.getAll("ville") || [];
  const minPrice = queryParams.get("minPrice") || "0";
  const maxPrice = queryParams.get("maxPrice") || "10000";
  const searchQuery = queryParams.get("searchQuery") || "";
  const withPrice = queryParams.get("withPrice") || false;
  const withImage = queryParams.get("withImage") || false;
  const withPro = queryParams.get("withPro") || false;

  console.log("subCategoryId ID:", subCategoryId);
  console.log("Villes:", villes);
  console.log("Min Price:", minPrice);
  console.log("Max Price:", maxPrice);
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    const fetchedCategory = categories.find((category) => category._id === categoryId);
    setCategory(fetchedCategory);
  }, [categoryId])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Fetch products based on query params
        const fetchedProducts = await filterdProducts(
          categoryId || "",
          subCategoryId || "",
          villes || [],
          minPrice || "",
          maxPrice || "",
          searchQuery || "",
          withPrice || false,
          withImage || false,
          withPro || false
        );
        console.log("params : ", categoryId)
        console.log("Fetched products : ", fetchedProducts);
        const countProducts = fetchedProducts.length;
        // setProductsLength(countProducts);
        // console.log("Products : " , fetchedProducts);
        // console.log("Products length : " , fetchedProducts.length);
        setProductsLength(fetchedProducts.length);
        console.log("Products length : ", productsLength);
        // Format createdAt for each product
        fetchedProducts?.forEach((r) => {
          r.createdAt = r?.createdAt
            ? format(new Date(r.createdAt), "MMM dd, yyyy")
            : "Date not available";
        });

        // Fetch users and link to products
        const fetchedUsers = await getAllUsers();
        const productsWithSellers = fetchedProducts.map((product) => {
          const seller = fetchedUsers.find(
            (user) => user._id === product.sellerId
          );
          return { ...product, seller };
        });

        // Set the state only once when the products are fetched
        setProducts(productsWithSellers);
        console.log("Products : ", products);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSubCategory = async () => {
      try {
        const subCategory = await getSubCategory(subCategoryId);
        console.log("SubCategory:", subCategory);
        setCurrentCategory(subCategory);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchSubCategory();
    fetchProducts();
  }, [subCategoryId, villes.join(","), minPrice, maxPrice, searchQuery, withPrice, withImage, withPro]); // Correct dependencies

  return (
    <div>
      <FilterSection productsLength={productsLength} loadingD={loading} category={category} selectedSubCategory={selectedSubCategory} cities={villes} subCategory={currentCategory} isCategoryModal={isCategoryModal} setIsCategoryModal={setIsCategoryModal} searchQuery={searchQuery} />
      {categoryId && (
        <PopularSubCategories
          isCategoryModal={isCategoryModal}
          setIsCategoryModal={setIsCategoryModal}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />
      )}
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoaderComponent />
        </div>
      ) : (
        productsLength === 0 ? (
          <div className="flex items-center justify-center h-screen p-6">
            <div className="text-center">
              <img
                src="noItemsFound.avif" // Replace with this link
                alt="No products"
                className="mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('no_ann_found')}</h2>
              <p className="text-gray-500 mb-4">{t('sorry')}</p>
              <Link
                to="/"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                {t('try_again')}
              </Link>
            </div>
          </div>
        ) : (
          <ProductContainer products={products} link={"viewProduct"} />
        )

      )}
    </div>
  );
};

export default FilteredProducts;
