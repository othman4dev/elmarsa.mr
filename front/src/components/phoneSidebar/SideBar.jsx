import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import "./SideBar.scss";
import { motion } from "motion/react";
import { publicRequest } from "../../axios.js";
import { logOut } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../redux/apiCalls";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import LanguageDropdown from "../LanguageDropdown.jsx";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import UserMenu from "../UserMenu/UserMenu.jsx";

export const SideBar = ({ user, setMenuOpen }) => {
  console.log("user : ", user);
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'fr';

  const categories = useSelector((state) => state.category.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const dispatch = useDispatch();
  // const handleLogout = async () => {
  //   localStorage.removeItem("persist:root");
  //   localStorage.removeItem("token");
  //   const res = await publicRequest.post("/api/logOut");
  //   dispatch(logOut());
  // };
  const handleLogout = async () => {
    // Remove relevant items from localStorage
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    // Optionally, call API for logout if needed (as you are doing)
    try {
      await publicRequest.post("/api/logOut");
    } catch (error) {
      console.error("Logout failed", error);
    }

    // Dispatch logout action to clear user data from Redux store
    dispatch(logOut());

    // Redirect to home page using navigate (no full page reload)
    navigate("/");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getAllCategory();
        setCategory(categoryData);
      } catch (error) {
        //console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <motion.div
      className="mainMenu h-full"
      style={{ left: "0" }}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0, transformOrigin: "left" }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <div className="close" onClick={() => setMenuOpen(false)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#ffffff">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </div>

      <div
        className="item"
        onClick={() => {
          setMenuOpen((prev) => !prev);
          navigate("/");
        }}
      >
        <img src="./logo.png" alt="" />
        <span>Elmarsa</span>
      </div>

      <div className="item ">
	<a href="https://wa.me/22246820209" target="_blank">
        <div className="left">
          <div className="icon">
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21.4736 12.7501H18.4736C18.0758 12.7501 17.6943 12.9081 17.413 13.1894C17.1317 13.4707 16.9736 13.8522 16.9736 14.2501V18.0001C16.9736 18.3979 17.1317 18.7794 17.413 19.0607C17.6943 19.342 18.0758 19.5001 18.4736 19.5001H19.9736C20.3715 19.5001 20.753 19.342 21.0343 19.0607C21.3156 18.7794 21.4736 18.3979 21.4736 18.0001V12.7501ZM21.4736 12.7501C21.4737 11.5618 21.2384 10.3854 20.7814 9.28851C20.3245 8.19166 19.6548 7.19616 18.8111 6.35944C17.9674 5.52273 16.9664 4.86136 15.8658 4.41351C14.7652 3.96565 13.5868 3.74017 12.3986 3.75007C11.2112 3.74141 10.0338 3.96781 8.93433 4.41623C7.83481 4.86464 6.8349 5.5262 5.99221 6.36279C5.14952 7.19938 4.48071 8.19446 4.02432 9.29069C3.56792 10.3869 3.33298 11.5626 3.33301 12.7501V18.0001C3.33301 18.3979 3.49104 18.7794 3.77235 19.0607C4.05365 19.342 4.43518 19.5001 4.83301 19.5001H6.33301C6.73083 19.5001 7.11236 19.342 7.39367 19.0607C7.67497 18.7794 7.83301 18.3979 7.83301 18.0001V14.2501C7.83301 13.8522 7.67497 13.4707 7.39367 13.1894C7.11236 12.9081 6.73083 12.7501 6.33301 12.7501H3.33301"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p>{t("customer_support")}</p>
        </div>
	</a>
        <hr />
        {/* <div className="right">
          <select name="" id="">
            <option value="Eng">{t('eng')}</option>
            <option value="Ar">{t('ar')}</option>
          </select>
        </div> */}
      </div>
      <LanguageDropdown mode="mobile" />
      <button
        onClick={() => {
          navigate("/publishProduct");
          setMenuOpen((prev) => !prev);
        }}
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg 
               hover:bg-blue-700 transition duration-300 text-center"
      >
        {t("publish_ann")}
      </button>

      <UserMenu setMenuOpen={setMenuOpen} handleLogout={handleLogout} user={user} t={t} />
      <div className="left">
        {/* <div className="category">
          <select name="" id="">
            <option value="">{t('all_categories')}</option>
            {category.map((c) => {
              return <option value={c._id}>{c.name}</option>;
            })}
          </select>
        </div> */}
        <p className="flex items-center gap-2 text-lg font-semibold text-gray-800 hover:text-blue-600 transition duration-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          {t("all_categories")}
        </p>

        <div className="space-y-4 text-white w-full">
          {categories.map((category) => (
            <div key={category._id} className="space-y-2">
              <div
                className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedCategory?._id === category._id ? "bg-blue-50 text-black" : "hover:bg-gray-50"}`}
                onClick={() => (selectedCategory === category ? setSelectedCategory(null) : setSelectedCategory(category))}
              >
                <span className="mr-3">
                  <img src={category.icon} alt="" className="w-6 h-6" />
                </span>
                <span>{category.name}</span>
                {selectedCategory?._id === category._id ? <MdKeyboardArrowDown className="ml-auto" /> : <MdKeyboardArrowRight className="ml-auto" />}
              </div>
              {selectedCategory?._id === category._id && (
                <div className="ml-8 space-y-2">
                  {category.subCategories.map((sub) => (
                    <Link to={`/products?categoryId=&minPrice=0&maxPrice=100000&subCategoryId=${sub._id}&villeParams=""`} onClick={() => setMenuOpen((prev) => !prev)}>
                      <div
                        key={sub._id}
                        className={`p-2 flex items-center space-between pr-5 cursor-pointer rounded-lg transition-all duration-200 
                            ${selectedSubcategory?._id === sub._id
                            ? "bg-indigo-100 shadow-md scale-105 text-black" // Fond bleu clair, ombre et légère augmentation de taille
                            : "hover:bg-indigo-100 hover:shadow-sm"
                          }`}
                        onClick={() => (selectedSubcategory === sub ? setSelectedSubcategory("") : setSelectedSubcategory(sub))}
                      >
                        <img src={sub.icon} alt="" className="w-6 h-6 mr-3" />
                        <span>{sub.name}</span>
                        <MdKeyboardArrowRight className="ml-auto" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="location">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 21.75H18.75" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M19.5 9.75C19.5 16.5 12 21.75 12 21.75C12 21.75 4.5 16.5 4.5 9.75C4.5 7.76088 5.29018 5.85322 6.6967 4.4467C8.10322 3.04018 10.0109 2.25 12 2.25C13.9891 2.25 15.8968 3.04018 17.3033 4.4467C18.7098 5.85322 19.5 7.76088 19.5 9.75V9.75Z"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12.75C13.6569 12.75 15 11.4069 15 9.75C15 8.09315 13.6569 6.75 12 6.75C10.3431 6.75 9 8.09315 9 9.75C9 11.4069 10.3431 12.75 12 12.75Z"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{t("all_mauritania")}</span>
        </div>
      </div>
      <div className="centre">
	<li
          onClick={() => {
            navigate("/");
            setMenuOpen((prev) => !prev);
          }}
        >
          {t("magazine")}
        </li>
	<li
          onClick={() => {
            navigate("/shops");
            setMenuOpen((prev) => !prev);
          }}
        >
          {t("boutiques")}
        </li>
        <li
          onClick={() => {
            navigate("/category");
            setMenuOpen((prev) => !prev);
          }}
        >
          {t("categories")}
        </li>
        <li
          onClick={() => {
            navigate("/about");
            setMenuOpen((prev) => !prev);
          }}
        >
          {t("about")}
        </li>
      </div>
    </motion.div>
  );
};
