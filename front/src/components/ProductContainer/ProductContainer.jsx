import React from "react";
import { useState } from "react";
import LoaderComponent from "../Loader/LoaderComponent";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import { Link } from "react-router-dom";
import {
  BsImages,
  BsCalendarDate,
  BsSpeedometer,
  BsCarFrontFill,
} from "react-icons/bs";
import { format, formatDistanceToNow } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";

const ProductContainer = ({
  products,
  link,
  selectedSubCategory,
  setSelectedSubCategory,
  username
}) => {
  console.log("subCategory : ", products[0]?.subCategory);
  console.log("Products : ", products);
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16; // Number of products to show per page
  const [loading, setLoading] = useState(false); // Loading state
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const lang = i18n.language || "fr";
 
  const locales = {
    fr: fr,
    ar: ar,
    en: enUS
};

  const timeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: locales[lang] || enUS
    });
};
  const totalPages = Math.ceil(products?.length / productsPerPage);
  return (
    <div className="mx-auto lg:mx-14 sm:p-10 md:p-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-1 gap-10 px-4">
        {currentProducts.map((product, index) => (
          <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
          <div className="p-4">
              <Link
                to={"/sellerProfile/" + product.sellerId}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={product.seller?.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={product?.seller?.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9";
                    }}
                  />
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      {product.seller
                        ? product.seller.username
                        : username || "Unknown"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {timeAgo(product.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <Link
              to={`/${link}/${product._id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="relative">
                <img
                  src={
                    product?.images.length === 0
                      ? "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1732584305.jpg"
                      : product.images[0]
                  }
                  alt={product.title}
                  className="w-[393.75px] h-[221.83px] aspect-video object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1732584305.jpg";
                  }}
                />
                {product.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm flex items-center space-x-1">
                    <BsImages className="w-4 h-4" />
                    <span>+{product.images.length - 1} images</span>
                  </div>
                )}
              </div>
            </Link>
            <div className="p-4">
              {/* <p
                onClick={() => setSelectedSubCategory(product.subCategory)}
                className="text-gray-500 text-xs uppercase tracking-wider mb-1"
              >
                {product.subCategory?.name}
              </p> */}

              <Link
                to={`/${link}/${product._id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <h2 className="text-gray-900 font-bold text-xl mb-2">
                  {product.title}
                </h2>
              </Link>
              <p className="text-gray-700 text-sm mb-4">
                {product?.description.length > 100
                  ? `${product.description.slice(0, 100)}...`
                  : product.description}
              </p>

              {product?.details && (
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <BsCalendarDate className="w-4 h-4 text-gray-500" />
                    <span>
                      {/* {product.details.year} */}
                      2025
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsCarFrontFill className="w-4 h-4 text-gray-500" />
                    <span>
                      {/* {product.details.model} */}
                      2022
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsSpeedometer className="w-4 h-4 text-gray-500" />
                    <span>
                      {/* {product.details.kilometers} */}
                      120 km
                    </span>
                  </div>
                </div>
              )}

              <div className="flex">
                <div className="w-fit ml-auto text-indigo-600 font-bold text-sm sm:text-lg bg-gray-200 px-2 sm:px-4 py-0.5 sm:py-1 rounded-md shadow-sm whitespace-nowrap overflow-hidden">
                  {product.price.toLocaleString()} {t("dh")}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <center>
        <div className="pagination mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 mx-1 bg-gray-300 rounded-md disabled:opacity-50 text-xs sm:px-4 sm:py-2 sm:text-base"
          >
            {t("prev")}
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page + 1)}
              className={`px-2 py-1 mx-1 text-xs sm:px-4 sm:py-2 sm:text-base ${currentPage === page + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
                } rounded-md`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 mx-1 bg-gray-300 rounded-md disabled:opacity-50 text-xs sm:px-4 sm:py-2 sm:text-base"
          >
            {t("next")}
          </button>
        </div>
      </center>
    </div>
  );
};

export default ProductContainer;
