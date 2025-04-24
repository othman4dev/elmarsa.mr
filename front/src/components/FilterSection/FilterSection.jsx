import { useState, useCallback, memo, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdTune } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { filterdProducts, getAllUsers } from "../../redux/apiCalls";
import ProductContainer from "../ProductContainer/ProductContainer";
import LoaderComponent from "../Loader/LoaderComponent";
import { format } from "date-fns";
import { CircleDollarSignIcon, GemIcon, Image, Search } from "lucide-react";
import PriceRangeFilter from "../PriceRangeFilter/PriceRangeFilter";
import Slider from "rc-slider";
import { categorySlice } from "../../redux/categorySlice";
import LoadingDots from "../LoadingDots/LoadingDots";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18";
const cities = {
  "Région Nord": ["Nouadhibou", "Choum", "Zouerate", "Bir Moghrein", "Aïn Ben Tili", "Boulenoir"],
  "Région Sud": ["Rosso", "Boghé", "Kaédi", "Sélibaby", "Maghama", "M'Bout"],
  "Région Centre": ["Nouakchott", "Aleg", "Boutilimit", "Sangrave", "Tijikja", "Bogué"],
  "Région Est": ["Néma", "Amourj", "Timbedra", "Oualata", "Bassikounou", "Adel Bagrou"],
  "Région Ouest": ["Atar", "Chinguetti", "Ouadane", "Akjoujt", "Aoujeft", "El Mina"],
  "Région Atlas": ["Kiffa", "Kankossa", "Tamchakett", "Tintane", "Guerou", "Keur Macène"],
};


const SearchInput = memo(({ sm, searchQuery, setSearchQuery }) => {
  const { t, i18n } = useTranslation(); // Hooks must be used inside the component body
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  return (
    <div className="relative h-12">
      <input
        style={{
          borderRadius: !isRTL ? (!sm ? "300px 30px 30px 300px" : "300px") : !sm ? "30px 300px 300px 30px" : "300px",
        }}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t("what_do_you_want")}
        className="w-full h-full px-10 border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      {searchQuery && (
        <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <FiX />
        </button>
      )}
    </div>
  );
});

const CategoryModal = memo(
  ({ isOpen, onClose, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory, withPrice, setWithPrice, withImage, setWithImage, withPro, setWithPro }) => {
    const { t,i18n } = useTranslation();
    const categories = useSelector((state) => state.category.categories);
    const isRTL = i18n.language === "ar"; // Check if Arabic is selected
   const lang = i18n.language || 'fr';
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
        <div className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{t("select_category")}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-4 my-8">
              {categories.map((category) => (
                <div key={category._id} className="space-y-2">
                  <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedCategory?._id === category._id ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    onClick={() => (selectedCategory === category ? setSelectedCategory(null) : setSelectedCategory(category))}
                  >
                    <span className="mr-3">
                      <img src={category.icon} alt="" className="w-6 h-6" />
                    </span>
                    <span>{category.name}</span>
                    {selectedCategory?._id === category._id ? (
                      <MdKeyboardArrowDown className="ml-auto" />
                    ) : isRTL ? (
                      <MdKeyboardArrowLeft className="mr-auto" />
                    ) : (
                      <MdKeyboardArrowRight className="ml-auto" />
                    )}
                  </div>
                  {selectedCategory?._id === category._id && (
                    <div className="ml-8 space-y-2">
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub._id}
                          className={`p-2 flex items-center space-between pr-5 cursor-pointer rounded-lg transition-all duration-200 
                            ${selectedSubcategory?._id === sub._id
                              ? "bg-indigo-100 shadow-md scale-105" // Fond bleu clair, ombre et légère augmentation de taille
                              : "hover:bg-indigo-100 hover:shadow-sm"
                            }`}
                          onClick={() => (selectedSubcategory === sub ? setSelectedSubcategory("") : setSelectedSubcategory(sub))}
                        >
                          <img src={sub.icon} alt="" className="w-6 h-6 mr-3" />
                          <span>{sub.name}</span>
                          {isRTL ? <MdKeyboardArrowLeft className="mr-auto" /> : <MdKeyboardArrowRight className="ml-auto" />}
                          {/* <MdKeyboardArrowRight className="ml-auto" /> */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden lg:block">
              <h4 className="text-2xl font-bold text-gray-800 mb-4 border-b-4 pb-2">{t("advanced_search")}</h4>

              <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <CircleDollarSignIcon className="text-blue-600 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-black">{t("ann_with_price")}</h3>
                    <h2 className="text-gray-500 text-sm">{t("display_only_ann_with_price")}</h2>
                  </div>
                </div>
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" onChange={() => setWithPrice(!withPrice)} checked={withPrice} />
                  <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <Image className="text-blue-600 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-black">{t("ann_with_image")}</h3>
                    <h2 className="text-gray-500 text-sm">{t("display_only_ann_with_image")}</h2>
                  </div>
                </div>
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" onChange={() => setWithImage(!withImage)} checked={withImage} />
                  <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <GemIcon className="text-blue-600 w-6 h-6" />
                  <div>
                    <h3 className="text-lg font-medium text-black">{t("premium_ads")}</h3>
                    <h2 className="text-gray-500 text-sm">{t("display_only_premium_ads")}</h2>
                  </div>
                </div>
                <label class="inline-flex items-center mb-5 cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" checked={withPro} onChange={() => setWithPro(!withPro)} />
                  <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <button onClick={onClose} className="flex items-center mt-4 p-4 pr-2 float-right bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              <span>{t("confirmer")}</span>
              {isRTL ? <MdKeyboardArrowLeft className="ml-3" /> : <MdKeyboardArrowRight className="ml-3" />}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

const CityModal = memo(({ isOpen, onClose, selectedCities, setSelectedCities }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t, i18n } = useTranslation(); // Hooks must be used inside the component body
  if (!isOpen) return null;
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected

  const filteredCities = Object.entries(cities).reduce((acc, [region, cityList]) => {
    const filtered = cityList.filter((city) => city.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filtered.length > 0) {
      acc[region] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t("select_cities")}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>

          {selectedCities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((city) => (
                  <span key={city} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {city}
                    <button onClick={() => setSelectedCities((prev) => prev.filter((c) => c !== city))} className="ml-2 hover:text-blue-600">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_cities")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 
      ${isRTL ? "left-3" : "right-3"}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(filteredCities).map(([region, cityList]) => (
              <div key={region} className="space-y-2">
                <div className="ml-4 space-y-2">
                  {cityList.map((city) => (
                    <label key={city} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => {
                          setSelectedCities((prev) => (prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]));
                        }}
                        className="form-checkbox text-blue-500"
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="flex items-center mt-4 p-4 pr-2 float-right bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            <span>{t("confirmer")}</span>
            {isRTL ? <MdKeyboardArrowLeft className="ml-3" /> : <MdKeyboardArrowRight className="ml-3" />}
          </button>
        </div>
      </div>
    </div>
  );
});

const PriceModal = memo(({ priceRange, setPriceRange, isOpen, onClose }) => {
  const [] = useState("");
  const { t } = useTranslation();
  if (!isOpen) return null;
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{t("filter_by_price")}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FiX size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6">
              <div className=" inset-0 flex items-center justify-center p-4">
                <div>
                  <h3 className="font-semibold mb-3">
                    {/* Fourchette de prix (DH) */}
                    {t("price_range")}
                  </h3>
                  <Slider range min={0} max={100000} value={priceRange} onChange={(value) => setPriceRange(value)} className="mb-4" />
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full p-2 border rounded"
                      placeholder={t("min")}
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full p-2 border rounded"
                      placeholder={t("max")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="flex items-center mt-4 p-4 pr-2 float-right bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
            <span>{t("confirmer")}</span>
            {isRTL ? <MdKeyboardArrowLeft className="ml-3" /> : <MdKeyboardArrowRight className="ml-3" />}
          </button>
        </div>
      </div>
    </div>
  );
});
const MobileFilterButton = memo(({ onClick }) => {
  const { t } = useTranslation();

  return (
    <button onClick={onClick} className="hidden w-full h-12 flex items-center justify-center bg-blue-500 text-white rounded-lg sm:hidden">
      <BiCategory className="mr-2" />
      {t("open_filters")}
    </button>
  );
});

const FilterSection = ({ hidden , isCategoryModal, setIsCategoryModal, cities, subCategory, selectedSubCategory, category, loadingD, searchQuery, productsLength, openFilterMobileMenu, setOpenFilterMobileMenu }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  // const [selectedCities, setSelectedCities] = cities
  //   ? useState(cities)
  //   : useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [withPrice, setWithPrice] = useState(false);
  const [withImage, setWithImage] = useState(false);
  const [withPro, setWithPro] = useState(false);
  const [openFilteringMobileMenu, setOpenFilteringMobileMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("10000");
  const [productsLen, setProductsLen] = useState(null);
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected
  // const lang = localStorage.getItem('selectedLanguage') || 'fr';
  console.log("mobile filter 1", openFilterMobileMenu)

  useEffect(() => {
    console.log("mobile filter", openFilterMobileMenu)
    if (openFilterMobileMenu === true) {
      setOpenFilteringMobileMenu(true)
      setOpenFilterMobileMenu(true)
    } else {
      setOpenFilteringMobileMenu(false)
      setOpenFilteringMobileMenu(false)
    }
  }, [openFilterMobileMenu, openFilteringMobileMenu])
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await filterdProducts(
          selectedCategory?._id || "",
          selectedSubCategory?._id || "",
          cities || [],
          minPrice || "",
          maxPrice || "",
          searchQuery || "",
          withPrice || false,
          withImage || false,
          withPro || false
        );
        const countProducts = res.length;
        console.log("Cities : ", cities);
        console.log("Products : ", res);
        console.log("Products length : ", res.length);
        setProductsLen(res.length);
      } catch (error) {
        console.error("Error fetching products ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [cities?.join(","), , selectedCities.join(","), selectedCategory?._id, selectedSubCategory?._id, minPrice, maxPrice, searchQuery, withPrice, withImage, withPro]);
  useEffect(() => {
    if (cities) setSelectedCities(cities);
    console.log("Cities : ", selectedCities);
  }, [cities]);

  useEffect(() => {
    setSelectedCategory(category);
  }, [category]);
  useEffect(() => {
    setIsCategoryModalOpen(isCategoryModal);
  }, [isCategoryModal, setIsCategoryModal]);
  useEffect(() => {
    setSelectedSubcategory(selectedSubCategory);
  }, [selectedSubCategory]);
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);
  const handleSearch = useCallback(async () => {
    console.log({
      searchQuery,
      // categoryId: selectedSubcategory?._id,
      categoryId: selectedSubcategory?._id,
      villes: selectedCities,
    });
    try {
      setLoading(true);
      const fetchProducts = await filterdProducts(
        selectedSubcategory?._id || "", // Assure que categoryId est bien une string
        selectedCities || [], // Assure que villes est un tableau
        "10000",
        "1"
      );
      console.log("products : ", products);
      fetchProducts.forEach((r) => {
        r.createdAt = r?.createdAt ? format(new Date(r.createdAt), "MMM dd, yyyy") : "Date not available";
      });
      const fetchedUsers = await getAllUsers();
      const productsWithSellers = fetchProducts.map((product) => {
        const seller = fetchedUsers.find((user) => user._id === product.sellerId);
        return { ...product, seller };
      });

      setProducts(productsWithSellers);
      setUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error : ", error);
    }
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedCities]);

  const isSearchDisabled = false;
  const villeParams = selectedCities.map((v) => `ville=${encodeURIComponent(v)}`).join("&");
  useEffect(() => {
    setSelectedSubcategory(subCategory);
  }, [subCategory]);



  const queryParams = [
    selectedCategory?._id ? `categoryId=${selectedCategory._id}` : "",
    selectedSubcategory?._id ? `subCategoryId=${selectedSubcategory._id}` : "",
    villeParams,
    `minPrice=${priceRange[0]}`,
    `maxPrice=${priceRange[1]}`,
    query ? `searchQuery=${query}` : "",
    withPrice ? `withPrice=${withPrice}` : false,
    withImage ? `withImage=${withImage}` : false,
    withPro ? `withPro=${withPro}` : false,
  ].join("&");
  useEffect(() => {

  }, [queryParams]);
  useEffect(() => {
    console.log("With Pro : ", withPro);
  }, [withPro]);
  return (
    <div className={`${hidden ? "lg:hidden" : ""}`}>
      <div className="max-w-7xl mx-auto p-4 ">
        <div className="space-y-4 sm:space-y-0">
          <div className="sm:hidden mb-4">
            <MobileFilterButton onClick={() => setIsFilterModalOpen(true)} />
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-5">
            <button onClick={() => setIsCategoryModalOpen(true)} className="h-12 flex items-center justify-center px-4 border rounded-lg hover:bg-gray-50">
              <BiCategory className="mr-2" />
              {selectedSubcategory?.name || t("select_category")}{" "}
            </button>

            <button onClick={() => setIsCityModalOpen(true)} className="h-12 flex items-center justify-center px-4 border rounded-lg hover:bg-gray-50">
              <IoLocationOutline className="mr-2" />
              {selectedCities.length ? `${selectedCities.length} ${t("selected_cities")}` : t("select_cities")}
            </button>
            <Link
              to={`/products?${queryParams}`}
              style={{
                borderRadius: isRTL ? "300px 30px 30px 300px" : "30px 300px 300px 30px",
              }}
              // onClick={handleSearch}
              disabled={isSearchDisabled}
              className={`h-12 flex items-center justify-center px-4 rounded-lg transition-all duration-300 ${isSearchDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {loadingD ? (
                <div className="flex justify-center items-center">
                  <LoadingDots />
                </div>
              ) : (
                <div className="flex items-center">
                  <Search size={20} />
                  <span className="ml-2">{t("search2")}</span>
                </div>
              )}
            </Link>
          </div>

          {/* mobile filters */}
          {/* <button
            onClick={() => setOpenFilteringMobileMenu(true)}
            className="md:hidden z-50 fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Open filters"
          >
            <MdTune className="text-2xl" />
          </button> */}
          {openFilteringMobileMenu && (
            <>
              <div style={{ marginTop: "-50px" }} className="fixed inset-0 bg-black/50 z-40" onClick={() => {
                setOpenFilteringMobileMenu(false);
                setOpenFilterMobileMenu(false);
              }}></div>
              <div
                className={`lg:hidden md:hidden fixed shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] rounded-t-2xl inset-shadow-sm inset-shadow-indigo-500 transform transition-transform duration-700  ${openFilteringMobileMenu ? "translate-y-0" : "translate-y-full"
                  } bottom-0 w-full left-0 bg-white z-50`}
              >
                <div className="flex justify-between mx-2 items-center  p-2 border-b-2 border-gray-500 shadow-b-xl">
                  <h3 className="flex text-lg text-black pl-5">{t("filter_your_search")}</h3>
                  <button onClick={() => {
                    setOpenFilteringMobileMenu(false)
                    setOpenFilterMobileMenu(false);
                  }} className="text-gray-400 hover:text-gray-600">
                    <FiX size={24} />
                  </button>
                </div>
                <h4 className="px-8 mb-[-10px] text-gray-500 my-4">{t("categories")}</h4>
                <button onClick={() => setIsCategoryModalOpen(true)} className="my-4 lg:hidden w-full h-12 flex items-center  px-8 border rounded-lg hover:bg-gray-50 ">
                  <BiCategory className="mr-2 text-blue-600 text-lg" />
                  {selectedSubcategory ? `${selectedSubcategory.name}` : t("select_category")}

                  {isRTL ? <MdKeyboardArrowLeft className="mr-auto" /> : <MdKeyboardArrowRight className="ml-auto" />}
                </button>
                <h4 className="px-8 mb-[-10px] text-gray-500">{t("cities")}</h4>
                <button onClick={() => setIsCityModalOpen(true)} className="lg:hidden w-full h-12 flex items-center  px-8 border rounded-lg hover:bg-gray-50 my-2">
                  <IoLocationOutline className="mr-2 text-lg" />
                  {selectedCities.length ? `${selectedCities.length} ${t("selected_cities")}` : t("select_cities")}

                  {isRTL ? <MdKeyboardArrowLeft className="mr-auto" /> : <MdKeyboardArrowRight className="ml-auto" />}
                </button>

                <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start space-x-3">
                    <CircleDollarSignIcon className="text-blue-600 w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-medium text-black">{t("ann_with_price")}</h3>
                      <h2 className="text-gray-500 text-sm">{t("display_only_ann_with_price")}</h2>
                    </div>
                  </div>
                  <label class="inline-flex items-center mb-5 cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" onChange={() => setWithPrice(!withPrice)} checked={withPrice} />
                    <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Image className="text-blue-600 w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-medium text-black">{t("ann_with_image")}</h3>
                      <h2 className="text-gray-500 text-sm">{t("display_only_ann_with_image")}</h2>
                    </div>
                  </div>
                  <label class="inline-flex items-center mb-5 cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" onChange={() => setWithImage(!withImage)} checked={withImage} />
                    <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-3 px-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-start space-x-3">
                    <GemIcon className="text-blue-600 w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-medium text-black">{t("premium_ads")}</h3>
                      <h2 className="text-gray-500 text-sm">{t("display_only_premium_ads")}</h2>
                    </div>
                  </div>
                  <label class="inline-flex items-center mb-5 cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" checked={withPro} onChange={() => setWithPro(!withPro)} />
                    <div class="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <Link
                  to={`/products?${queryParams}`}
                  onClick={() => {
                    setOpenFilteringMobileMenu(false)
                    setOpenFilterMobileMenu(false);
                  }}
                  style={{ borderRadius: "10px" }}
                  // onClick={handleSearch}
                  disabled={isSearchDisabled}
                  className={`my-3 h-12 flex items-center justify-center px-4 rounded-lg transition-all duration-300 mx-8 text-lg ${isSearchDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#2E6BFF] text-white"
                    }`}
                >
                  {loadingD ? (
                    <div className="flex justify-center items-center">
                      <LoadingDots />
                    </div>
                  ) : (
                    <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                      <span className="ml-2">
                        {t("display")} ({productsLen}) {t("annoucements")}
                      </span>
                      {isRTL ? <MdKeyboardArrowLeft className="mr-auto text-2xl" /> : <MdKeyboardArrowRight className="ml-auto text-2xl" />}
                    </div>
                  )}
                </Link>
              </div>
            </>
          )}

          {selectedCities.length > 0 && (
            <div className="hidden  lg:flex  p-2 flex-wrap gap-2 mt-4">
              {selectedCities.map((city) => (
                <span key={city} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {city}
                  <button onClick={() => setSelectedCities((prev) => prev.filter((c) => c !== city))} className="ml-2 hover:text-blue-600">
                    <FiX size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}
          {selectedSubcategory && typeof selectedSubcategory === "object" && Object.keys(selectedSubcategory).length > 0 && (
            <div className=" hidden  lg:flex p-2 flex-wrap gap-2 mt-4">
              <span className="flex items-center bg-green-200 text-green-800 px-3 py-1 rounded-full">
                {selectedSubcategory?.name}
                <button onClick={() => setSelectedSubcategory("")} className="ml-2 hover:text-green-600">
                  <FiX size={16} />
                </button>
              </span>
            </div>
          )}
          {!(priceRange[0] === 0 && priceRange[1] === 100000) && (
            <div className="hidden  lg:flex p-2 flex-wrap gap-2 mt-4">
              <span className="flex items-center bg-red-200 text-green-800 px-3 py-1 rounded-full">
                {t("min")} : {priceRange[0]} | {t("max")} : {priceRange[1]}
                <button onClick={() => setPriceRange([0, 100000])} className="ml-2 hover:text-green-600">
                  <FiX size={16} />
                </button>
              </span>
            </div>
          )}
        </div>

        <CategoryModal
          isOpen={isCategoryModalOpen || isFilterModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false);
            setIsFilterModalOpen(false);
            setIsCategoryModal(false);
            navigate(`/products?${queryParams}`);
          }}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          withPrice={withPrice}
          withImage={withImage}
          withPro={withPro}
          setWithPrice={setWithPrice}
          setWithImage={setWithImage}
          setWithPro={setWithPro}
        />
        <CityModal
          isOpen={isCityModalOpen}
          onClose={() => {
            setIsCityModalOpen(false);
            navigate(`/products?${queryParams}`);
          }}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
        />
        <PriceModal
          isOpen={isPriceModalOpen}
          onClose={() => {
            setIsPriceModalOpen(false);
            navigate(`/products?${queryParams}`);
          }}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
