import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import "./PublishProduct.scss";
import app from "../../firebase.js";
import { toast } from "react-toastify";
import { X } from "lucide-react"; // Import icons
import { createProduct, fetchUser, getAllCategory, getProduct, updateProduct } from "../../redux/apiCalls.js";
import { notifyUser } from "../../components/notifyuser/ToastMessage.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import Loader from "../../components/loader/Loader.jsx";
import PhoneInput from "react-phone-input-2";
const PublishProduct = ({ mode }) => {
  const { t, i18n } = useTranslation();
  const cities = {
    [t("Nouadhibou")]: [t("Cansado"), t("Numerowatt"), t("Airport Zone"), t("Downtown")],
    [t("Choum")]: [t("Railway Station Area"), t("Choum Market"), t("Residential Zone")],
    [t("Zouerate")]: [t("Mining Zone"), t("City Center"), t("Tazadit")],
    [t("BirMoghrein")]: [t("North Border Post"), t("Military Base"), t("Village Center")],
    [t("AïnBenTili")]: [t("Desert Camp"), t("Border Post"), t("Market Square")],
    [t("Boulenoir")]: [t("Coastal Area"), t("Old Town"), t("Fishing Port")],
    [t("Rosso")]: [t("Riverbank"), t("Market District"), t("Port Area")],
    [t("Boghé")]: [t("Central Market"), t("River Side"), t("Agricultural Zone")],
    [t("Kaédi")]: [t("Hospital Area"), t("Market Square"), t("University District")],
    [t("Sélibaby")]: [t("Main Market"), t("Hospital Area"), t("Residential Blocks")],
    [t("Maghama")]: [t("Riverside"), t("Fishing Zone"), t("Market Area")],
    [t("MBout")]: [t("Agricultural Lands"), t("Central Market"), t("Hospital District")],
    [t("Nouakchott")]: [t("Tevragh Zeina"), t("Ksar"), t("El Mina"), t("Sebkha"), t("Dar Naim"), t("Arafat"), t("Teyarett"), t("Riyad"), t("Toujounine")],
    [t("Aleg")]: [t("Market Area"), t("Hospital Zone"), t("Government District")],
    [t("Boutilimit")]: [t("Central Mosque Area"), t("Market Square"), t("Residential Blocks")],
    [t("Sangrave")]: [t("Fishing Village"), t("Market Area"), t("Agricultural Zone")],
    [t("Tijikja")]: [t("Oasis Quarter"), t("Market Square"), t("Desert Camp")],
    [t("Bogué")]: [t("River Port"), t("Market Square"), t("Old Town")],
    [t("Néma")]: [t("Airport Zone"), t("Market Area"), t("Nomadic Camp")],
    [t("Amourj")]: [t("Village Center"), t("Market Square"), t("Health Post")],
    [t("Timbedra")]: [t("Livestock Market"), t("Residential Blocks"), t("Hospital Area")],
    [t("Oualata")]: [t("Ancient Library Area"), t("Old Town"), t("Heritage Zone")],
    [t("Bassikounou")]: [t("Refugee Camp"), t("Market District"), t("Border Zone")],
    [t("AdelBagrou")]: [t("Village Center"), t("Border Checkpoint"), t("Agricultural Fields")],
    [t("Atar")]: [t("Old Town"), t("Market Square"), t("Tourist Camp")],
    [t("Chinguetti")]: [t("Historic Mosque Area"), t("Old Libraries"), t("Sand Dunes")],
    [t("Ouadane")]: [t("Ancient Ruins"), t("Market Square"), t("Residential Quarter")],
    [t("Akjoujt")]: [t("Mining Zone"), t("City Center"), t("Residential Area")],
    [t("Aoujeft")]: [t("Market Square"), t("Health Center"), t("Residential Blocks")],
    [t("ElMina")]: [t("Fishing Port"), t("Market Area"), t("Industrial Zone")],
    [t("Kiffa")]: [t("City Center"), t("Market Square"), t("Hospital District")],
    [t("Kankossa")]: [t("Livestock Market"), t("Residential Area"), t("Government District")],
    [t("Tamchakett")]: [t("Village Center"), t("Market Square"), t("Health Post")],
    [t("Tintane")]: [t("Market Area"), t("Hospital District"), t("Residential Blocks")],
    [t("Guerou")]: [t("Livestock Zone"), t("Market Square"), t("Transport Hub")],
    [t("KeurMacène")]: [t("Coastal Village"), t("Fishing Port"), t("Residential Blocks")],
  };

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  console.log("user : ", user);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("selectedLanguage"));  
  const storedUser = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const storedCategories = JSON.parse(localStorage.getItem("persist:root"))?.category;
  //console.log("stored user : " , storedUser);
  //console.log("user : ", user)
  const categories = useSelector((stat) => stat.category.categories);
  const [subCategories, setSubCategories] = useState([]);
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [category, setCategory] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    email: user?.email || localStorage.getItem("email") || "",
    ville: "",
    neighborhood: "",
    phone: user?.phone,
    price: "",
    location: "",
    categoryId: categories[0]?._id || "",
    sellerId: user?._id || storedUser._id,
    subCategoryId: subCategories[0]?._id || "",
  });
  useEffect(() => {
    setSubCategories(categories?.find((item) => item._id === product?.categoryId)?.subCategories || []);
  }, [product?.categoryId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCategory(categories);
      } catch (error) {
        //console.log(error);
      }
    };

    fetchData();
    const fetchProduct = async () => {
      const product = await getProduct(productId);
      //console.log(product);

      setProduct({
        title: product.title,
        description: product.description,
        price: product.price,
        email: product.email,
        ville: product.ville,
        neighborhood: product.neighborhood,
        phone: product.phone,
        location: product.location,
        categoryId: product.categoryId || "",
        sellerId: product.sellerId,
        subCategoryId: product.subCategoryId || "",
      });
      setImages(product.images);
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await fetchUser();
        setProduct({
          ...product,
          email: user?.email,
          phone: user?.phone,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchCurrentUser();
    if (mode === "edit") {
      fetchProduct();
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct({
        ...product,
        images: images,
      });
      if (res === true) {
        navigate("/myProduct");
      }
      //console.log("Success ");
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      // notifyUser("error", `Product has not been added: ${error.response?.data?.message || error.message}`);
    } finally {
      //console.log("data product : ", product);
      //console.log("data images  : ", images);
    }
  };
  const handleImageUpload = async (event) => {
    const newImages = [];
    const files = event.target.files;

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "clicon"); // Your upload preset from Cloudinary
      data.append("cloud_name", "di96wpw7b"); // Replace with your Cloudinary cloud name

      try {
        setLoading(true);
        // Upload each file to Cloudinary
        const response = await fetch("https://api.cloudinary.com/v1_1/di96wpw7b/image/upload", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadedImageURL = await response.json();
        //console.log("Uploaded image:", uploadedImageURL.url);

        // Add the uploaded image URL to the newImages array
        newImages.push(uploadedImageURL.url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }

    // Update state with the newly uploaded image URLs
    setImages((prevImages) => [...prevImages, ...newImages]);
  };
  // Delete Image
  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const validatePhone = (value) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(value);
  };
  const handlePhoneChange = (value, country, e, formattedValue) => {
    setProduct({ ...product, phone: value });

    // Clear errors when user types
    setErrors((prev) => ({ ...prev, phone: "" }));

    if (!validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: t("phone_error") }));
    }
  };
  return (
    <div className="publishProduct">
      <div className="wrapper">
        <form onSubmit={handleCreate}>
          <div className="w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6">
            <input type="file" accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 z-50" onChange={handleImageUpload} />
            <div className="text-center">
              <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="Upload Icon" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                <span className="cursor-pointer text-indigo-600">{t("click_to_upload_multiple_images")}</span>
              </h3>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF {t("up_to_10mb")}</p>
            </div>
          </div>
          {/* Preview Images */}
          <div className="flex flex-wrap gap-2 mt-4">
            {loading ? (
              <Loader />
            ) : (
              images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} className="w-24 h-24 object-cover rounded-md" alt={`Uploaded ${index}`} />
                  {/* Delete Button */}
                  <button onClick={() => deleteImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="item">
            <p>
              {t("title_ann")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            <input
              type="text"
              placeholder={t("title_ann")}
              value={product.title}
              required
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </div>{" "}
          <div className="item">
            <p>
              {t("text_ann")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            <textarea
              type="text"
              placeholder={t("text_ann")}
              required
              rows={4}
              value={product.description}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>{" "}
          <div className="item">
            <p>{t("price")}</p>
            <input
              type="text"
              placeholder={t("price")}
              value={product.price}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
            />
          </div>
          <div className="item">
            <p>{t("your_email")}</p>
            <input
              type="email"
              placeholder={t("your_email")}
              value={product?.email || ""}
              disabled={!!product?.email} // Disables the input if product.email exists
              style={{
                backgroundColor: "#f0f0f0",
                color: "#777",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "not-allowed",
              }}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="item">
            <p>
              {t("your_city")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            <select
              required
              value={product.ville}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  ville: e.target.value,
                }))
              }
            >
              <option value="">{t("select_city")}</option>
              {Object.keys(cities).map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="item">
            <p>
              {t("select_neighborhood")}
              {/* <span className="text-red-600 inline-block p-1 text-sm">*</span> */}
            </p>
            <select
              value={product.neighborhood}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  neighborhood: e.target.value,
                }))
              }
              disabled={!product.ville} // Disable subCity select if no city is chosen
            >
              <option value="">{t("select_neighborhood")}</option>
              {product.ville &&
                cities[product.ville]?.map((neighborhood, index) => (
                  <option key={index} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
            </select>
          </div>
          <div className="lg:w-[960px] w-[364px]">
            <p>
              {t("your_phone")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            {/* <input
              type="text"
              maxLength="10"
              placeholder={t("your_phone")}
              required
              value={product.phone}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            /> */}
            <div className="space-y-4">
              <PhoneInput
                country="ma"
                value={product.phone}
                id="phone"
                name="phone"
                inputClass={`!w-full !h-[50px] appearance-none block px-3 py-2 border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                containerClass="w-full"
                required
                onChange={handlePhoneChange}
              />
            </div>
          </div>
          <div className="item">
            <p>
              {t("your_adress")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            <input
              type="text"
              placeholder={t("your_adress")}
              required
              value={product.location}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
          </div>
          <div className="item">
            <p>
              {t("category")}
              <span className="text-red-600 inline-block p-1 text-sm">*</span>
            </p>
            <select
              name=""
              id=""
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  categoryId: e.target.value,
                }))
              }
            >
              <option value="" disabled>
                {" "}
                {t("select_category")}
              </option>
              {category.map((item, index) => {
                return (
                  <option key={index} value={item._id}>
                    {selectedLanguage == "fr" ? item.name_fr : item.name_ar}
                  </option>
                );
              })}
            </select>
          </div>
          {product?.categoryId && (
            <div className="item">
              <p>
                {t("sub_category")}
                <span className="text-red-600 inline-block p-1 text-sm">*</span>
              </p>
              <select
                name=""
                id=""
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    subCategoryId: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  {" "}
                  {t("select_sub_category")}
                </option>
                {subCategories.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {selectedLanguage == "fr" ? item.name_fr : item.name_ar}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className="button">
            <Button label={t("publish_ann")} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishProduct;
