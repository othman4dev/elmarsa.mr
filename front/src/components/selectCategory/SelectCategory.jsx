import { useEffect, useState } from "react";
import SelectCategoryItem from "../selectCategoryItem/SelectCategoryItem";
import "./SelectCategory.scss";
import { getAllCategory } from "../../redux/apiCalls.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import { FaHome, FaCar, FaBriefcase , FaBuilding  } from "react-icons/fa";

const SelectCategory = ({ onSelectCategory }) => {
    const [category, setCategory] = useState("");
  
  const categories = [
    {
      _id: '67a0e03e4acfceae5427b7dd',
      title: "Immobilier",
      icon: <FaHome className="w-8 h-8 mb-2" />,
      description: "Real Estate",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      _id:'67a0e04d4acfceae5427b7df' ,
      title: "Véhicules",
      icon: <FaCar className="w-8 h-8 mb-2" />,
      description: "Vehicles",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      _id: '67a0e0824acfceae5427b7e1',
      title: "Entreprises",
      icon: <FaBriefcase className="w-8 h-8 mb-2" />,
      description: "Businesses",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    },
    {
      _id: 4,
      title: "Market",
      icon: <FaBuilding className="w-8 h-8 mb-2" />,
      description: "Market",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500"
    }
  ];


  const { t, i18n } = useTranslation();

  const [categoriesData, setCategoriesData] = useState([]);

  // const categories = useSelector((stat) => stat.category.categories);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {

      setCategoriesData(categories);
    };
    fetchCategories();
  }, []);
  return (
    <div className="container mx-auto px-4 mb-4 max-w-7xl bg-gray-100">
      <div className="flex flex-col md:flex-row justify-center items-center gap-11">
        {categories.map((category) => (
          <button
          onClick={() => setCategory(category._id)}
            key={category._id}
            className={`w-full md:w-[200px] h-[150px] rounded-xl shadow-md hover:shadow-xl
              transition-all duration-300 ease-in-out transform hover:scale-105
              flex flex-col justify-center items-center p-4 cursor-pointer
              hover:bg-gradient-to-b hover:from-white hover:to-${category.bgColor}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${category.bgColor}`}
            aria-label={`Select ${category.title} category`}
          >
            <div className={`transition-colors duration-300 ${category.iconColor}`}>
              {category.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{category.title}</h3>
            <p className="text-xs text-gray-500">{category.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectCategory;
