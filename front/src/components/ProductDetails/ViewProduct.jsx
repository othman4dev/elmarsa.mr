import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import { MapPin, Phone, Tag, Building, PackageOpen, Heart, Mail, MessageCircle } from "lucide-react"; // Import icons
import { getProduct, getAllCategory, addToFavorites, fetchDataByCategory, getAllUsers, removeFromFavorites, getFavorites } from "../../redux/apiCalls.js";
import { notifyUser } from "../notifyuser/ToastMessage.jsx";
import Loader from "../loader/Loader.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import { Route } from "react-router-dom";
import { format } from "date-fns";
import ProductContainer from "../ProductContainer/ProductContainer.jsx";
import LoaderComponent from "../Loader/LoaderComponent.jsx";

const ProductDetails = () => {
  const user = useSelector((state) => state.user.currentUser);
  const { t , i18n} = useTranslation();
  // const lang = i18n.language || 'fr';
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const [users, setUsers] = useState([]);
  const { id } = useParams(); // Get the product id directly from useParams
  const [selectedImage, setSelectedImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch(); // ✅ Get dispatch function
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const productsPerPage = 4;
  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProduct(id); // Use the id from route params
      setProduct(result);
      //console.log("product : ", product);
      const fetchedFavorites = await getFavorites();
      //console.log("Fetched favorites: ", fetchedFavorites);

      // Ensure correct ID comparison (if fetchedFavorites contains objects)
      const isFavorite = fetchedFavorites.some((fav) => {
        const favId = typeof fav === "object" ? fav._id : fav; // Extract ID if fav is an object
        return String(favId) === String(result._id); // Ensure string comparison
      });

      setProduct(result);
      setIsFavorite(isFavorite);
      //console.log("Is favorite: ", isFavorite);
    };
    const fetchUsers = async () => {
      const result = await getAllUsers();
      setUsers(result);
    };
    if (id) {
      fetchProduct(); // Fetch product only if id is available
      fetchUsers();
    }
  }, [id]); // Dependency array ensures this runs when the `id` changes
  useEffect(() => {
    if (products.length > 0 && users.length > 0) {
      const fetchedSeller = users.find((user) => user._id === products[0].sellerId);
      setSeller(fetchedSeller || null);
      //console.log("seller : " , seller);
    }
  }, [products, users]);
  useEffect(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategory(dispatch); // ✅ Pass dispatch and await result
        setCategories(categories);
        if (!categories || categories.length === 0) {
          console.error("No categories found!");
          return;
        }

        const fetchedCategory = categories.find((category) => category._id === product.categoryId);
        setCategory(fetchedCategory || "");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if (product?.categoryId) {
      fetchCategories();
    }
  }, [product]);
  const handleAddToFavories = async () => {
    try {
      const res = await addToFavorites(id);
      //console.log("res: ", res);
      setIsFavorite(true);
      notifyUser("succuss", "Product added to favorites successfully");
    } catch (error) {
      notifyUser("error", "Error adding product to favorites");
      console.error("Error adding product to favorites", error);
    }
  };
  const handleRemoveFromFavories = async () => {
    try {
      const res = await removeFromFavorites(id);
      //console.log("res rem: ", res);
      setIsFavorite(false);
      notifyUser("succuss", "Product has been removed from favorites successfully");
    } catch (error) {
      notifyUser("error", "Error removing product from favorites");
    }
  };
  useEffect(() => {
    const ProductsByCategory = async () => {
      try {
        if (product.categoryId) {
          // ✅ Ensure categoryId exists before calling API
          const fetchedProducts = await fetchDataByCategory(product.categoryId);
          setProducts(fetchedProducts);
          const fetchedUsers = await getAllUsers();

          // Associer chaque produit à son vendeur
          const productsWithSellers = fetchedProducts.map((product) => {
            const seller = fetchedUsers.find((user) => user._id === product.sellerId);
            return { ...product, seller };
          });

          // Appliquer le filtre après avoir associé les vendeurs
          const filteredProducts = category !== "" ? productsWithSellers.filter((product) => product.categoryId === category) : productsWithSellers;

          setProducts(filteredProducts);
          setUsers(fetchedUsers);
        }
      } catch (error) {
        console.error("Error fetching products by category:", error);
      }
    };

    ProductsByCategory();
  }, [product.categoryId]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(products.length / productsPerPage);
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <img
              src={selectedImage || "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1732584305.jpg"}
              alt="Product"
              className="w-[728px] h-[528px] object-cover rounded-lg shadow-md mb-4"
            />

            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 sm:w-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                  onClick={() => changeImage(image)}
                />
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 px-4">
            <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
            {/* <p className="text-gray-600 mb-4">{product._id}</p> */}
            <div className="mb-4">
              <span className="text-2xl font-bold mr-2">
                {product.price} {t("dhs")}
              </span>
              {/* <span className="text-gray-500 line-through">$399.99</span> */}
            </div>
            {/* <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-500">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="ml-2 text-gray-600">4.5 (120 {t("reviews")})</span>
            </div> */}
            <p className="text-gray-700 mb-6">{product.description}</p>
            <div className="flex space-x-4 mb-6">
              <a
                href={`https://wa.me/${seller?.phone.replace(/^\+/, "")}`}
                target="_blank" 
                className="bg-green-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <MessageCircle className="size-6" /> {/* Use the Lucide message icon */}
                {t("contact_seller")}
              </a>

              <button
                onClick={isFavorite ? handleRemoveFromFavories : handleAddToFavories}
                className="text-red-500 font-bold bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {isFavorite ? (
                  <Heart className="size-6 fill-red-500" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
                {t("add_to_favorites")}
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t("details")}</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t("category")}:</span> {category?.name || "N/A"}
                </li>
                <li className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{t("city")}:</span> {product?.ville || "N/A"}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{t("location")}:</span> {product?.location || "N/A"}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">{t("phone")}:</span> {product?.phone || "N/A"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen" style={{ marginTop: "-227px" }}>
          <LoaderComponent />
        </div>
      ) : (
        <div>
          <p className="ml-5 lg:ml-20 my-8 text-xl font-semibold flex items-center gap-2 text-gray-900">
            <PackageOpen className="w-6 h-6 text-indigo-600" />
            {t("related_products")}
          </p>
          <ProductContainer category={category} products={products} link={"viewProduct"} />
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
