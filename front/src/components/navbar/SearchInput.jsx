import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const SearchInput = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  let queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("categoryId");
  const subCategoryId = queryParams.get("subCategoryId");
  const villes = queryParams.getAll("ville") || [];
  const minPrice = queryParams.get("minPrice") || "0";
  const maxPrice = queryParams.get("maxPrice") || "10000";
  const searchQuery = queryParams.get("searchQuery") || "";

  queryParams = [
    categoryId ? `categoryId=${categoryId}` : "",
    subCategoryId ? `subCategoryId=${subCategoryId}` : "",
    villes,
    `minPrice=${minPrice}`,
    `maxPrice=${maxPrice}`,
    searchTerm ? `searchQuery=${searchTerm}` : searchQuery,
  ].join("&");
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?${queryParams}`);
  };

  useEffect(() => {
    console.log("Search Term:", searchTerm);
  }, [searchTerm]);
  return (
    <form className="max-w-lg mx-auto " onSubmit={handleSearch}>
      <div className="hidden lg:flex">
        <label for="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Your Email
        </label>
        <div className="relative w-full">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-dropdown"
            className="lg:w-96 w-56 h-11 rounded-lg block p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder={t("search_on_elmarssa")}
          />
          <button
            // onClick={() => navigate(`/products?categoryId=&minPrice=0&maxPrice=100000&subCategoryId=&villeParams=&searchQuery=${searchTerm}`)}
            onClick={() => navigate(`/products?${queryParams}`)}
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border     "
          >
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
      <div className="lg:hidden">
        <div className="relative w-full">
          <input
            style={{
              marginRight: isRTL ? "-60px" : "0",
              marginLeft: isRTL ? "0" : "-60px",
            }}
            className="w-52 h-9 rounded-lg block p-2.5 z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="search-dropdown"
            placeholder={t("search_products")}
          />
          <button onClick={() => navigate(`/products?${queryParams}`)} type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
    // <div>
    //    <div className="relative">
    //     <input
    //       type="text"
    //       value={searchTerm}
    //       onChange={(e) => setSearchTerm(e.target.value)}
    //       placeholder="Search items..."
    //       className="lg:w-96 w-56 h-11 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
    //       aria-label="Search input"
    //     />
    //     {searchTerm && (
    //       <button
    //         onClick={() => setSearchTerm("")}
    //         className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    //         aria-label="Clear search"
    //       >
    //         <FaTimes />
    //       </button>
    //     )}
    //     <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
    //   </div>

    // {isLoading ? (
    //     <div className="mt-4 text-center text-gray-600">Loading...</div>
    //   ) : results.length > 0 ? (
    //     <div className="mt-4 border rounded-lg overflow-hidden">
    //       {results.map((item) => (
    //         <div
    //           key={item.id}
    //           onClick={() => handleItemClick(item.id)}
    //           className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center gap-4"
    //         >
    //           <img
    //             src={item.image}
    //             alt={item.name}
    //             className="w-12 h-12 object-cover rounded"
    //             loading="lazy"
    //           />
    //           <div>
    //             <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
    //             <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ) : searchTerm && (
    //     <div className="mt-4 text-center text-gray-600">
    //       <p>No results found</p>
    //     </div>
    //   )}
    // </div>
  );
};

export default SearchInput;
