import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts, getAllUsers, getAllCategory, filterdProducts } from "../../redux/apiCalls.js";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import "./Home.scss";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import LoaderComponent from "../../components/Loader/LoaderComponent.jsx";
import ProductContainer from "../../components/ProductContainer/ProductContainer.jsx";
import FilterSection from "../../components/FilterSection/FilterSection.jsx";
import CategoriesContainer from "../../components/CategoriesContainer/CategoriesContainer.jsx";
import PopularSubCategories from "../../components/PopularSubCategories/PopularSubCategories.jsx";
import { Plus } from "lucide-react";
import AdsSection from "../../components/AdsSection/AdsSection.jsx";
const Home = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const categories = useSelector((state) => state.category.categories);
  const subCategories = categories.flatMap((c) => c.subCategories);
  const [category, setCategory] = useState("");
  const [ville, setVille] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Number of products to show per page
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [villes, setVilles] = useState([]);

  const queryParams = new URLSearchParams(location.search);

  const searchQuery = queryParams.get("searchQuery") || "";
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const fetchProducts = await filterdProducts( categoryId || "",
          subCategoryId || "",
          villes || [],
          minPrice || "",
          maxPrice || "");

        // Format creation date
        fetchProducts.forEach((r) => {
          r.createdAt = r?.createdAt ? format(new Date(r.createdAt), "MMM dd, yyyy") : "Date not available";
        });
        // Fetch users
        const fetchedUsers = await getAllUsers();

        // Map products to include seller and subCategory
        const productsWithSellersAndSubCategory = fetchProducts.map((product) => {
          const seller = fetchedUsers.find((user) => user._id === product.sellerId);

          // Find the corresponding subCategory from the categories' subCategories
          const subCategory = subCategories?.find((subCategory) => subCategory._id === product.subCategoryId);
          console.log("Sub category : ", subCategory);
          return { ...product, seller, subCategory };
        });

        // Filter products by category if a category is selected
        const filteredProducts = category !== "" ? productsWithSellersAndSubCategory.filter((product) => product.categoryId.toString() === category._id.toString()) : productsWithSellersAndSubCategory;

        // Set products and loading state
        setProducts(filteredProducts);
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error : ", error);
      }
    };

    fetchFilteredProducts();
  }, [category, ville, minPrice, maxPrice]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleCategoryClick = (categoryId) => {
    if (category === categoryId) {
      setCategory(""); // Désélectionner la catégorie si elle est déjà sélectionnée
    } else {
      setCategory(categoryId); // Sélectionner une nouvelle catégorie
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="home">
      <CategoriesContainer categories={categories} category={category} handleCategoryClick={handleCategoryClick} />
      {/*<AdsSection/>*/}
      <div className="flex justify-center" onClick={() => navigate("/publishProduct")}>
        <button className="lg:hidden flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300">
          <Plus className="w-5 h-5 mr-2" /> {/* Add icon */}
          {t("publish_ann")}
        </button>
      </div>
      <div className="hidden">
        <FilterSection  selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} searchQuery={searchQuery} />
      </div>
      <PopularSubCategories hidden={true} setSelectedSubCategory={setSelectedSubCategory} />
      {/*<AdsSection/>*/}
      {loading ? (
        <div className="flex items-center justify-center h-screen" style={{ marginTop: "-227px" }}>
          <LoaderComponent />
        </div>
      ) : (
        <ProductContainer category={category} products={products} link={"viewProduct"} selectedSubCategory={selectedSubCategory} setSelectedSubCategory={setSelectedSubCategory} />
      )}
    </div>
  );
};

export default Home;
