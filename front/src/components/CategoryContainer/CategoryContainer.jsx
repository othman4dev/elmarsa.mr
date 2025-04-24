import React from "react";
import { Link } from "react-router-dom";
import i18n from "../../locales/i18";

const CategoryContainer = ({ c, category, handleCategoryClick }) => {
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
   const lang = localStorage.getItem('selectedLanguage') || 'fr';
  return (
    <div>
      <Link
        to={`/products?categoryId=${c._id}&minPrice=0&maxPrice=100000&subCategoryId=&villeParams=""`}
        onClick={() => handleCategoryClick(c._id)}
        key={c._id}
        className={`lg:w-[304.75px] w-[184px] h-[65px]
                    rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out 
                    transform hover:scale-105 flex justify-center items-center p-1 cursor-pointer
                    hover:bg-gradient-to-b hover:from-white hover:to-${
                      c.bgColor
                    }
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${c.bgColor} ${
          category === c._id ? "border-1 border-blue-500" : ""
        }`}
        aria-label={`Select ${c.title} category`}
      >
        <div className={`${isRTL ? "ml-3" : "mr-3"} transition-colors duration-300 ${c.iconColor}`}>
          <img src={c.icon} alt="" className="w-[36px] h-[36px]" />
        </div>
        <h3 className="lg:text-lg text-sm font-bold text-gray-800 mb-1 overflow-hidden text-ellipsis whitespace-normal max-w-[200px]">
          {c["name_" + lang]}
        </h3>

        {/* <p className="text-xs text-gray-500">{c.description}</p> */}
      </Link>
    </div>
  );
};

export default CategoryContainer;
