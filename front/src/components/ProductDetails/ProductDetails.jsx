import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import { X, MapPin, Phone, Tag, Building, Delete } from "lucide-react"; // Import icons

import Button from "../button/Button.jsx";

import app from "../../firebase.js";
import { toast } from "react-toastify";
import { getProduct, deleteProduct, getAllCategory, updateProduct } from "../../redux/apiCalls.js";
import { notifyUser } from "../notifyuser/ToastMessage.jsx";
import Loader from "../loader/Loader.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import { Route } from "react-router-dom";
import EditModal from "../EditModal/EditModal.jsx";
import DeleteModal from "../DeleteModal/DeleteModal.jsx";

const ProductDetails = () => {
  const userFromRedux = useSelector((state) => state.user.currentUser);
  const storedUser = localStorage.getItem("email");
  const user = userFromRedux || storedUser;
  const { t } = useTranslation();
  const [product, setProduct] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { id } = useParams(); // Get the product id directly from useParams
  const [selectedImage, setSelectedImage] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch(); // ✅ Get dispatch function
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState("");
  const [productEdit, setProductEdit] = useState({});
  
  const changeImage = (image) => {
    setSelectedImage(image);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProduct(id); // Use the id from route params
      setProduct(result);
    };

    if (id) {
      fetchProduct(); // Fetch product only if id is available
    }
  }, [id]); // Dependency array ensures this runs when the `id` changes

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategory(dispatch);
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          const fetchedCategory = fetchedCategories.find((cat) => cat._id === product.categoryId);
          const fetchedSubCategory = fetchedCategory?.subCategories.find((sub) => sub._id === product.subCategoryId);

          setCategory(fetchedCategory || "");
          setSubCategory(fetchedSubCategory || "");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (product?.categoryId) {
      fetchCategories();
    }
  }, [product, dispatch]);
  const openDeleteModal = () => {
    setIsDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModal(false);
  };

  useEffect(() => {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(""); // If no images, clear the selectedImage
    }
  }, [product]); // Dependency array ensures this runs when the `product` changes
  const openEditModal = () => {
    setProductEdit({
      title: product.title,
      description: product.description,
      email: user.email,
      ville: product.ville,
      phone: product.phone,
      price: product.price,
      location: product.location,
      categoryId: product.categoryId,
      sellerId: user._id,
      subCategoryId: product.subCategoryId,
    });
    setImages(product.images);
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
  };
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
              <Link
                // to={"/publishProduct/"+product._id}
                onClick={openEditModal}
                className="bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l2.121 2.121a2.25 2.25 0 0 1 0 3.182l-8.488 8.488a2.25 2.25 0 0 1-1.042.59l-4.08 1.367a1.125 1.125 0 0 1-1.357-1.357l1.366-4.08a2.25 2.25 0 0 1 .59-1.042l8.488-8.488a2.25 2.25 0 0 1 3.182 0z"
                  />
                </svg>

                {t("edit_product")}
              </Link>
              <button
                onClick={openDeleteModal}
                className="text-red-500 font-bold bg-gray-200 flex gap-2 items-center  text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 6h-15m15 0l-1.5 15h-12L4.5 6h15zM9 6V4.5a1.5 1.5 0 0 1 3 0V6" />
                </svg>

                {t("delete_product")}
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">{t("details")}</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t("category")}:</span> {category?.name || "N/A"} - {subCategory?.name || "N/A"}
                </li>
                <li className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{t("city")}:</span> {product?.ville || "N/A"} {product?.neighborhood ? `- ${product?.neighborhood}` : ""}
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
      {isDeleteModal && <DeleteModal closeDeleteModal={closeDeleteModal} product={product} setIsDeleteModal={setIsDeleteModal} />}
      {editModal && (
        <EditModal
          category={category}
          subCategory={subCategory}
          id={id}
          product={product}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
          editModal={editModal}
          images={images}
          setImages={setImages}
        />
      )}
    </div>
  );
};
export default ProductDetails;
