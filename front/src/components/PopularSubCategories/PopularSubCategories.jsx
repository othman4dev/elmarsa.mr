import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSubCategoriesByCategory } from "../../redux/apiCalls";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { t } from "i18next";
import { useSelector } from "react-redux";
import i18n from "../../locales/i18";
import { FiMonitor, FiShoppingBag, FiHome, FiActivity, FiBook, FiCpu, FiBox, FiTruck, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PopularSubCategories = ({
  setSelectedSubCategory,
  setIsCategoryModal,
  hidden
}) => {
  const parentCategories = useSelector((state) => state.category.categories);
  const scrollContainerRef = useRef(null);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const categoryId = query.get("categoryId");
  console.log("categoryId : ", categoryId);
  const [categories, setCategories] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  const lang = localStorage.getItem('selectedLanguage') || 'fr';
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const fetchedSubCategories = await getSubCategoriesByCategory(
          categoryId || "0"
        );

        const subCategoriesWithBgColor = fetchedSubCategories?.data?.data.map(
          (subCategory) => {
            const parentCategory = parentCategories.find(
              (category) =>
                category.subCategories.some((sc) => sc._id === subCategory._id) // Check if the subcategory belongs to this category
            );

            console.log("parentCategory : ", parentCategory);

            return {
              ...subCategory,
              bgColor: parentCategory ? parentCategory.bgColor : "#FFFFFF", // Default color if not found
            };
          }
        );

        setCategories(subCategoriesWithBgColor);
        console.log("subCategories : ", subCategoriesWithBgColor);
      } catch (error) {
        console.error("Error : ", error);
      }
    };
    fetchSubCategories();
  }, [categoryId, parentCategories]); // Ensure parentCategories is included in dependencies


  const handleCategoryClick = (category) => {
    setSelectedSubCategory(category)
    console.log(`Selected category: ${category}`);
    // if(hidden){
      navigate(`/products?categoryId=&minPrice=0&maxPrice=100000&subCategoryId=${category._id}&villeParams=`);
    // }
      
  };

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };
  return (
    <div className="w-full px-4 py-8 relative lg:ml-[70px]">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('popular_categories')}</h2>
    
    {showLeftArrow && (
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hidden md:block"
        aria-label="Scroll left"
      >
        <FiChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
    )}

    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex overflow-x-auto space-x-4 p-4 scroll-smooth scrollbar-hide touch-pan-x"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() => handleCategoryClick(category)}
          className={`
            flex-none w-[138px] h-[136px] bg-[rgb(242,242,242)]
            rounded-lg shadow-md cursor-pointer
            hover:scale-105 transition-transform duration-300
            flex flex-col items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isRTL && "mx-4"}
          `}
          role="button"
          tabIndex={0}
          aria-label={`Select ${category["name_" + lang]} category`}
        >
          <img src={category.icon}
            className="w-[52px] h-[52px] text-gray-700 mb-3"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-gray-700">{category["name_" + lang]}</span>
          
        </div>
      ))}
    </div>

    {showRightArrow && (
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hidden md:block"
        aria-label="Scroll right"
      >
        <FiChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    )}
  </div>
  );
};

export default PopularSubCategories;
