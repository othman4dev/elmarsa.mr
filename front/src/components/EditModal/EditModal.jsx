import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory, updateProduct } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import { X, MapPin, Phone, Tag, Building, Delete, Loader } from "lucide-react"; // Import icons
import { notifyUser } from "../notifyuser/ToastMessage";
import PhoneInput from "react-phone-input-2";

const EditModal = ({ id, closeEditModal, product, category, subCategory, link }) => {
  const cities = {
    Nouadhibou: ["Cansado", "Numerowatt", "Airport Zone", "Downtown"],
    Choum: ["Railway Station Area", "Choum Market", "Residential Zone"],
    Zouerate: ["Mining Zone", "City Center", "Tazadit"],
    BirMoghrein: ["North Border Post", "Military Base", "Village Center"],
    AïnBenTili: ["Desert Camp", "Border Post", "Market Square"],
    Boulenoir: ["Coastal Area", "Old Town", "Fishing Port"],
    Rosso: ["Riverbank", "Market District", "Port Area"],
    Boghé: ["Central Market", "River Side", "Agricultural Zone"],
    Kaédi: ["Hospital Area", "Market Square", "University District"],
    Sélibaby: ["Main Market", "Hospital Area", "Residential Blocks"],
    Maghama: ["Riverside", "Fishing Zone", "Market Area"],
    MBout: ["Agricultural Lands", "Central Market", "Hospital District"],
    Nouakchott: ["Tevragh Zeina", "Ksar", "El Mina", "Sebkha", "Dar Naim", "Arafat"],
    Aleg: ["Market Area", "Hospital Zone", "Government District"],
    Boutilimit: ["Central Mosque Area", "Market Square", "Residential Blocks"],
    Sangrave: ["Fishing Village", "Market Area", "Agricultural Zone"],
    Tijikja: ["Oasis Quarter", "Market Square", "Desert Camp"],
    Bogué: ["River Port", "Market Square", "Old Town"],
    Néma: ["Airport Zone", "Market Area", "Nomadic Camp"],
    Amourj: ["Village Center", "Market Square", "Health Post"],
    Timbedra: ["Livestock Market", "Residential Blocks", "Hospital Area"],
    Oualata: ["Ancient Library Area", "Old Town", "Heritage Zone"],
    Bassikounou: ["Refugee Camp", "Market District", "Border Zone"],
    AdelBagrou: ["Village Center", "Border Checkpoint", "Agricultural Fields"],
    Atar: ["Old Town", "Market Square", "Tourist Camp"],
    Chinguetti: ["Historic Mosque Area", "Old Libraries", "Sand Dunes"],
    Ouadane: ["Ancient Ruins", "Market Square", "Residential Quarter"],
    Akjoujt: ["Mining Zone", "City Center", "Residential Area"],
    Aoujeft: ["Market Square", "Health Center", "Residential Blocks"],
    ElMina: ["Fishing Port", "Market Area", "Industrial Zone"],
    Kiffa: ["City Center", "Market Square", "Hospital District"],
    Kankossa: ["Livestock Market", "Residential Area", "Government District"],
    Tamchakett: ["Village Center", "Market Square", "Health Post"],
    Tintane: ["Market Area", "Hospital District", "Residential Blocks"],
    Guerou: ["Livestock Zone", "Market Square", "Transport Hub"],
    KeurMacène: ["Coastal Village", "Fishing Port", "Residential Blocks"],
  };
  console.log("EditModal Props:", { id, product, category, subCategory });
  if (!id) return null;
  if (!product) return null;

  const { t,i18n } = useTranslation();
  const lang = i18n.language || 'fr';
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [productEdit, setProductEdit] = useState({
    title: "",
    description: "",
    email: "",
    ville: "",
    neighborhood: "",
    phone: "",
    price: "",
    location: "",
    categoryId: category._id,
    sellerId: "",
    subCategoryId: subCategory._id,
  });
  console.log("product edit : ", productEdit);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategory(dispatch);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (product?.categoryId) {
      fetchCategories();
    }
  }, [product, dispatch]);

  useEffect(() => {
    if (categories.length > 0 && productEdit?.categoryId) {
      setSubCategories(categories.find((item) => item._id === productEdit.categoryId)?.subCategories || []);
    }
  }, [categories, productEdit.categoryId]);

  useEffect(() => {
    if (product) {
      setProductEdit({
        title: product.title,
        description: product.description,
        email: user?.email || "",
        ville: product.ville,
        neighborhood: product.neighborhood,
        phone: product.phone,
        price: product.price,
        location: product.location,
        categoryId: category._id,
        sellerId: user?._id || "",
        subCategoryId: subCategory._id,
      });
      setImages(product.images || []);
    }
  }, [product, user]);
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      title: productEdit.title,
      description: productEdit.description,
      price: productEdit.price,
      email: productEdit.email,
      ville: productEdit.ville,
      neighborhood: productEdit.neighborhood,
      phone: productEdit.phone,
      location: productEdit.location,
      categoryId: productEdit.categoryId,
      images: images,
      sellerId: productEdit.sellerId,
      subCategoryId: productEdit.subCategoryId,
    };

    try {
      setLoading(true);
      await updateProduct(payload, id);
      notifyUser("succuss", "Product has been updated successfully");
      closeEditModal();
      if (link === true) {
        window.location.href = "/productDetails/" + id;
      }
    } catch (error) {
      console.error("Error updating product:", error);
      notifyUser("error", "Product has not been updated");
    } finally {
      setLoading(false);
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
  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validatePhone = (value) => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    return phoneRegex.test(value);
  };
  const handleInputChange = (value, country, e, formattedValue) => {
    setProductEdit({ ...productEdit, phone: value });

    // Clear errors when user types
    setErrors(prev => ({ ...prev, phone: "" }));

    if (!validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: t('phone_error') }));
    }
  };
  return (
    <div className="fixed inset-0 z-40 min-h-full overflow-y-auto overflow-x-hidden transition flex items-center">
      <div aria-hidden="true" className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"></div>

      <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
        <div className="w-full py-2 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-[27rem]">
          <button onClick={closeEditModal} type="button" className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
            <svg
              xlinkTitle="Close"
              className="h-4 w-4 hover:rotate-180 transition-all ease-in-out duration-500 cursor-pointer text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close</span>
          </button>

          <div className="space-y-2 p-2">
            <div className="p-2 space-y-2 text-center dark:text-white">
              <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                {t("let_me_reach_you")}
              </h2>
              <p className="text-gray-500">{t("are_you_sure_you_would_like_to_do_this")}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div aria-hidden="true" className="border-t border-gray-700 px-2"></div>

            <div className="grid grid-cols-1 place-items-center px-4 py-2">
              <form noValidate className="space-y-4">
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

                <div>
                  <label htmlFor="Title" className="mb-2 text-gray-400 text-lg">
                    {t("title")}
                  </label>
                  <input
                    id="title"
                    className="border p-3 shadow-md  border-gray-700 placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("title")}
                    value={productEdit.title}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="description" className="mb-2 text-gray-400 text-lg">
                    {t("description")}
                  </label>

                  <textarea
                    id="Description"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    placeholder={t("description")}
                    value={productEdit.description}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 text-gray-400 text-lg">
                    {t("email")}
                  </label>
                  <input
                    id="subject"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="email"
                    disabled
                    placeholder={t("email")}
                    value={productEdit.email}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 text-gray-400 text-lg">
                    {t("city")}
                  </label>
                  <select
                    id="city"
                    className="border p-3 border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    value={productEdit.ville}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        ville: e.target.value,
                      }))
                    }
                  >
                    <option value="">{t("select_city")}</option>
                    {/* {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))} */}
                    {Object.keys(cities).map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="neighborhood" className="mb-2 text-gray-400 text-lg">
                    {t("neighborhood")}
                  </label>
                  <select
                    id="city"
                    className="border p-3 border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    value={productEdit.neighborhood}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        neighborhood: e.target.value,
                      }))
                    }
                  >
                    <option value="">{t("select_neighborhood")}</option>
                    {/* {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))} */}
                    {productEdit.ville &&
                      cities[productEdit.ville]?.map((neighborhood, index) => (
                        <option key={index} value={neighborhood}>
                          {neighborhood}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 text-gray-400 text-lg">
                    {t("phone")}
                  </label>
                  {/* <input
                    id="phone"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("phone")}
                    value={productEdit.phone}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  /> */}
                  <div className="space-y-4">
                    <PhoneInput
                      country="ma"
                      value={productEdit.phone}
                      name="phone"
                      onChange={handleInputChange}
                      inputClass={`border border-gray-700 appearance-none block !h-[50px] !w-full px-3 py-2 border ${errors.phone ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      containerClass="w-full"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 text-gray-400 text-lg">
                    {t("price")}
                  </label>
                  <input
                    id="price"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("price")}
                    value={productEdit.price}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 text-gray-400 text-lg">
                    {t("adress")}
                  </label>
                  <input
                    id="adress"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("adress")}
                    value={productEdit.location}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label htmlFor="Message" className="mb-2 text-gray-400 text-lg">
                    {t("category")}
                  </label>
                  <select
                    id="category"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("category")}
                    value={productEdit.categoryId || ""}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                  >
                    {categories.map((c, index) => (
                      <option key={index} value={c._id}>
                        {c["name_" + lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="Message" className="mb-2 text-gray-400 text-lg">
                    {t("sub_category")}
                  </label>
                  <select
                    id="category"
                    className="border p-3  border-gray-700 shadow-md placeholder:text-base focus:outline-none ease-in-out duration-300 rounded-lg w-full"
                    type="text"
                    placeholder={t("sub_category")}
                    value={productEdit.subCategoryId || ""}
                    onChange={(e) =>
                      setProductEdit((prev) => ({
                        ...prev,
                        subCategoryId: e.target.value,
                      }))
                    }
                  >
                    {subCategories.map((c, index) => (
                      <option key={index} value={c._id}>
                        {c["name_" + lang]}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div aria-hidden="true" className="border-b border-gray-700 px-2"></div>
            <div className="px-6 py-2">
              <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800"
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  onClick={handleUpdate}
                  className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-[#4d1b80] hover:bg-[#7127BA] focus:bg-[#11071F] focus:ring-offset-[#11071F]"
                >
                  <span className="flex items-center gap-1">
                    <span className="">{t("submit")}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
