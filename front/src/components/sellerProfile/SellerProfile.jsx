import React, { useEffect, useState } from "react";
import { getSellerDetails, getProductsOfSeller } from "../../redux/apiCalls.js";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { User, Mail, Phone, Store } from "lucide-react"; // Importing Lucid icons
import { FaWhatsapp } from "react-icons/fa";

import "../../locales/i18.js"; // Import the i18n config
import LoaderComponent from "../Loader/LoaderComponent.jsx";
import ProductContainer from "../ProductContainer/ProductContainer.jsx";
const SellerProfile = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // Number of products to show per page
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getSellerDetails(id);

      setUser(fetchedUser);
      //console.log("seller: ", fetchedUser);
    };
    const fetchProducts = async () => {
      const fetchedProducts = await getProductsOfSeller(id);
      //console.log("Fetched products for this seller : ", fetchedProducts);

      setProducts(fetchedProducts);
    };
    fetchUser();
    fetchProducts();
  }, [id]); // Dependency on `id` ensures it runs only when `id` changes

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(products)
    ? products.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const totalPages = Math.ceil((products?.length || 0) / productsPerPage);
  const getMonthAndYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Get month (1-based)
    const year = date.getFullYear(); // Get year
    return `${month}/${year}`; // Example: 1/2025 for January 2025
  };
  const phoneNumber = user.phone ? user.phone : ""; // Check if phone exists

  const handleClick = () => {
    if (phoneNumber) {
      window.location.href = `https://wa.me/+212${phoneNumber}`;
    } else {
      alert("Phone number is unavailable");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center my-10">
      {/* <div className="relative">
                <button
                    className="z-20 text-white flex flex-col shrink-0 grow-0 justify-around 
                  fixed bottom-0 right-0 right-5 rounded-lg
                  mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10"
                    onClick={handleClick}
                    title={t('contact_seller')} // Tooltip on hover
                >
                    <div className="p-3 rounded-full border-4 border-white bg-green-600">
                        <FaWhatsapp
                            className="w-10 h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
                            color="white"
                        />
                    </div>
                </button>
            </div> */}
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This is some information about the user.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="mr-2 text-gray-400" />
                {t("name")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.username || "Loading..."}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="mr-2 text-gray-400" />
                {t("email_adress")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email || "Loading..."}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="mr-2 text-gray-400" />
                {t("phone_number")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.phone || "___"}
              </dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="mr-2 text-gray-400" />
                {t("member_from")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getMonthAndYear(user.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      {loading ? (
        <div
          className="flex items-center justify-center h-screen"
          style={{ marginTop: "-227px" }}
        >
          <LoaderComponent />
        </div>
      ) : (
        <div>
          <p className="ml-5 lg:ml-20 my-8 text-xl font-semibold flex items-center gap-2 text-gray-900">
            <Store className="w-4 h-4 text-gray-400 mr-2" />
            {t("products_of")} {user?.username}
            {localStorage.getItem("lang") === "en" ? "'" : ""} {t("store")} (
            {products?.length || 0})
          </p>
          <ProductContainer products={products} link={"viewProduct"} username={user.username} />
        </div>
      )}
      <div className=" lg:mx-14 p-5 sm:p-10 md:p-4"></div>
    </div>
  );
};

export default SellerProfile;
