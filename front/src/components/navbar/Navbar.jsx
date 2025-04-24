import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { ListFilterPlus, Plus } from "lucide-react";
import Button from "../button/Button";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginStart, loginSuccuss, logOut } from "../../redux/userSlice";
import { SideBar } from "../phoneSidebar/SideBar";
import { fetchUser, getAllCategory, switchMode } from "../../redux/apiCalls";
import { publicRequest } from "../../axios.js";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageDropdown from "../LanguageDropdown.jsx";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import FilterModal from "../FilterModal/FilterModal.jsx";
import SearchInput from "./SearchInput.jsx";
import ProfileDropdown from "./ProfileDropdown.jsx";
import Header from "./Header.jsx";
import { MdTune } from "react-icons/md";
import FilterSection from "../FilterSection/FilterSection.jsx";
const Navbar = () => {
  const user = useSelector((state) => state.user.currentUser);
  const storedUser = localStorage.getItem("name");
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const categories = useSelector((stat) => stat.category.categories);
  const [profileOpen, setProfileOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [openFilterMobileMenu, setOpenFilterMobileMenu] = useState(false);
  
  const fetchUserData = async () => {
    try {
      const res = await fetchUser();
      setUserData(
        res
      );
      console.log("user data", res.data.user);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(()=>{
    fetchUserData();
  },[]);
  const [filterModal, setFilterModal] = useState(false);
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  // const [searchTerm , setSearchTerm] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let token = params.get("token");
    let name = params.get("name");
    let email = params.get("email");
    let username = params.get("username") || name;
    let isAdmin = params.get("isAdmin") || false;

    if (!token) {
      token = localStorage.getItem("token");
      name = localStorage.getItem("name");
      email = localStorage.getItem("email");
      username = localStorage.getItem("username");
      isAdmin = localStorage.getItem("isAdmin");
    } // Utilise 'username' si disponible, sinon 'name'

    // Assurez-vous que tous les paramètres sont présents
    if (token && name && email && username && isAdmin !== null) {
      setUserData({ name, email, username });
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("username", username); // Store username in localStorage
      localStorage.setItem("isAdmin", isAdmin);
    }
    fetchUserData();
  }, [location]);

  



  useEffect(() => {
    const fetchData = async () => {
      try {
        setCategory(categories);
      } catch (error) {
        console.error("Error : ", error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = async () => {
    // Remove relevant items from localStorage
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");

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
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate("/category/search/" + search);
    }
  };
  const openFilterModal = () => {
    setFilterModal(true);
  };
  const closeFilterModal = () => {
    setFilterModal(false);
  };
  return (
    <header>
      <nav className="hidden lg:block bg-[#1b6392] border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 text-white h-16 shadow-xl  p-4">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center ">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSideBarOpen);
              }}
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <a onClick={() => navigate("/")} className="flex items-center h-11 w-24 cursor-pointer">
              <img src="logo.png" className="h-12" alt="Flowbite Logo" />
              <span className="hidden lg:block self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Elmarsa</span>
            </a>
          </div>
          <SearchInput />

          <button onClick={() => navigate("/products?categoryId=&minPrice=0&maxPrice=100000&subCategoryId=&villeParams=")} className="md:hidden p-2 rounded-lg shadow">
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M5 8h14M7 12h10m-4 4h4" />
            </svg>
          </button>
          <div className="hidden lg:block">
            <LanguageDropdown />
          </div>
          <div>
	  <a href="https://wa.me/22246820209" target="_blank">
            <button className="hidden lg:flex items-center px-4 py-2 h-10  text-white rounded-lg shadow ">
              <svg className="w-5 h-full mx-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18.364 5.636a9 9 0 11-12.728 0M12 1v4m-6.364 2.364l-2.828-2.828m17.456 2.828l-2.828-2.828M12 21v-4m6.364-2.364l2.828 2.828M4.222 17.778l2.828-2.828"
                />
              </svg>
              <span>{t('customer_support')}</span>
            </button>
	  </a>
          </div>

          <div className="hidden lg:flex items-center">
            {(user && user.username) || userData?.username ? (
              <ProfileDropdown user={user ? user : userData} handleLogout={handleLogout} />
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
              >
                <i className="fas fa-bullhorn"></i> {/* Example icon from FontAwesome */}
                {t("login")}
              </button>
            )}
          </div>
        </div>
        {isSideBarOpen && <SideBar user={user ? user : userData} setMenuOpen={setIsSidebarOpen} />}
      </nav>
      <div className="hidden lg:block">
        <Header />
      </div>


      <nav className="lg:hidden bg-[#1b6392] border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 text-white h-16 shadow-xl  p-4">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center ">
            <button
              onClick={() => {
                setIsSidebarOpen(!isSideBarOpen);
              }}
              data-collapse-toggle="mobile-menu-2"
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            <a onClick={() => navigate("/")} className="flex items-center h-11 w-24 cursor-pointer">
              <img src="logo.png" className="h-12" alt="Flowbite Logo" />
            </a>
          </div>
          <SearchInput />

          <button onClick={() => {
            navigate("/products?categoryId=&minPrice=0&maxPrice=100000&subCategoryId=&villeParams=");
            setOpenFilterMobileMenu(true);
          }} className=" p-2 rounded-lg shadow">
            <MdTune className="text-2xl" />
          </button>
        </div>
        {isSideBarOpen && <SideBar user={user ? user : userData} setMenuOpen={setIsSidebarOpen} />}
      </nav>
      <FilterSection hidden={true} openFilterMobileMenu={openFilterMobileMenu} setOpenFilterMobileMenu={setOpenFilterMobileMenu} />
    </header>
  );
};

export default Navbar;
