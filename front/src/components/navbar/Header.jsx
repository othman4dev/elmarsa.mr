import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

const Header = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  const navigate = useNavigate();
  const subNavItems = [
    {
      name: t('magazine'),
      link: "/"
    },
    {
      name: t('boutiques'),
      link: "/shops"
    },
    {
      name: t('categories'),
      link: "/category"
    },
    {
      name: t('about'),
      link: "/about"
    }
  ];
  return (
    <div className="flex justify-between items-center bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center justify-center space-x-8 h-12 overflow-x-auto scrollbar-hide">
          {subNavItems.map((item, index) => (
            <li key={index}>
              <Link to={`${item.link}`} className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div onClick={()=>navigate('/publishProduct')} className="flex justify-center">
        <button className="hidden lg:flex mr-9 items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300">
          <Plus className="w-3 h-3"
         style={{
          marginLeft: isRTL ? "14px" : "0",
          marginRight: isRTL ? "0" : "14px"
        }}
        
          /> {/* Add icon */}
          {t('publish_ann')}
        </button>
      </div>
    </div>
  );
};

export default Header;
