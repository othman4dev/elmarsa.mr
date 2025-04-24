import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Loader, X } from "lucide-react"; // Import icons
import { createCategory, updateCategory } from "../../redux/apiCalls";
import zIndex from "@mui/material/styles/zIndex";
import { notifyUser } from "../notifyuser/ToastMessage";

const AddCategoryModal = ({
  isOpen,
  onClose,
  setIsAddModalOpen,
  category,
  loading,
  setLoading,
}) => {
  const { t, i18n } = useTranslation();
  const [categoryData, setCategoryData] = useState({
    name_en: "",
    name_fr:"",
    name_ar:"",
    icon: "",
    description: "",
    bgColor: "blue",
    subCategories: [],
  });
  useEffect(() => {
    if (category) {
      setCategoryData(category);
    }
  }, [category]); // Dependency array ensures this runs only when 'category' changes
  const [image, setImage] = useState("");
  const [SubImage, setSubImage] = useState("");
  const [file, setFile] = useState(null);

  const addSubCategory = () => {
    setCategoryData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, { name_en: "", name_fr: "",name_ar: "", icon: "" }],
    }));
  };
  const removeSubCategory = (index) => {
    setCategoryData((prev) => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    console.log(file); // Check if the file is selected
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "clicon");
    data.append("cloud_name", "di96wpw7b");

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/di96wpw7b/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadedImageURL = await response.json();
      setImage(uploadedImageURL.url); // Image URL should be saved in the state
      setCategoryData({ ...categoryData, icon: uploadedImageURL.url });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageSubUpload = async (event, subCategoryId) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "clicon");
    data.append("cloud_name", "di96wpw7b");

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/di96wpw7b/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadedImage = await response.json();
      setSubImage(uploadedImage.url); // Store uploaded image URL

      // Update subCategories inside categoryData based on subCategoryId
      // Update subCategories inside categoryData based on subCategoryId
      setCategoryData((prevState) => ({
        ...prevState,
        subCategories: prevState.subCategories.map((sub) =>
          sub._id === subCategoryId ? { ...sub, icon: uploadedImage.url } : sub
        ),
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = (e) => {
    e.preventDefault();
    setImage("");
    setCategoryData({ ...categoryData, icon: "" });
  };
  // The delete function to remove the sub-image/icon
  const deleteSubImage = (e, subCategoryId) => {
    e.preventDefault();  // Prevent default action of the event (e.g., form submission)

    // Clear the icon or image and update the state
    setSubImage("");  // Clear the icon/image if needed

    setCategoryData((prevState) => ({
      ...prevState,
      subCategories: prevState.subCategories.map((sub) =>
        sub._id === subCategoryId
          ? { ...sub, icon: "" }  // Set the icon to empty for the matched subCategory
          : sub  // Keep other subCategories intact
      ),
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createCategory(categoryData);
      if (response.status === 200) {
        // Close modal and reset form if successful
        setIsAddModalOpen(false);
        resetForm();
      } else {
        console.error("Failed to create category:", response);
      }
      setIsAddModalOpen(false);
      notifyUser("succuss", "Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      notifyUser("error", "Failed to create category");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateCategory(categoryData._id, categoryData);
      if (response.status === 200) {
        // Close modal and reset form if successful
        setIsAddModalOpen(false);
        resetForm();
      } else {
        console.error("Failed to update category:", response);
      }
      console.log("category data", categoryData);
      setIsAddModalOpen(false);
      notifyUser("succuss", "Category updated successfully");
    } catch (error) {
      console.error("Error upfating category:", error);
      notifyUser("error", "Failed to update category");
    } finally {
      setLoading(false);
    }
  };
  const updateSubCategoryNameEn = (e, subCategoryId) => {
    const updatedName = e.target.value;

    // Update the name in the state
    setCategoryData((prevState) => ({
      ...prevState,
      subCategories: prevState.subCategories.map((sub) =>
        sub._id === subCategoryId ? { ...sub, name_en: updatedName } : sub
      ),
    }));
    console.log("category data", categoryData);
  };
  const updateSubCategoryNameFr = (e, subCategoryId) => {
    const updatedName = e.target.value;

    // Update the name in the state
    setCategoryData((prevState) => ({
      ...prevState,
      subCategories: prevState.subCategories.map((sub) =>
        sub._id === subCategoryId ? { ...sub, name_fr: updatedName } : sub
      ),
    }));
    console.log("category data", categoryData);
  };
  const updateSubCategoryNameAr = (e, subCategoryId) => {
    const updatedName = e.target.value;

    // Update the name in the state
    setCategoryData((prevState) => ({
      ...prevState,
      subCategories: prevState.subCategories.map((sub) =>
        sub._id === subCategoryId ? { ...sub, name_ar: updatedName } : sub
      ),
    }));
    console.log("category data", categoryData);
  };
  return (
    <div
      style={{ zIndex: 100 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {category ? "Edit Category" : "Add New Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={categoryData.name_en}
              onChange={(e) =>
                setCategoryData((prev) => ({ ...prev, name_en: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              value={categoryData.name_fr}
              onChange={(e) =>
                setCategoryData((prev) => ({ ...prev, name_fr: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              الاسم
            </label>
            <input
              type="text"
              value={categoryData.name_ar}
              onChange={(e) =>
                setCategoryData((prev) => ({ ...prev, name_ar: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="mt-4 w-[400px] relative border-2 border-gray-300 border-dashed rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 z-50"
                onChange={handleImageUpload}
              />
              <div className="text-center">
                <img
                  className="mx-auto h-12 w-12"
                  src="https://www.svgrepo.com/show/357902/image-upload.svg"
                  alt="Upload Icon"
                />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  <span className="cursor-pointer text-indigo-600">
                    {t("click_to_upload_multiple_images")}
                  </span>
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF {t("up_to_10mb")}
                </p>
              </div>
            </div>
            {/* Preview Images */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryData?.icon &&
                (loading ? (
                  <Loader />
                ) : (
                  <div className="relative">
                    <img
                      src={categoryData.icon}
                      className="w-24 h-24 object-cover rounded-md"
                      alt="Uploaded"
                    />
                    {/* Delete Button */}
                    <button
                      onClick={deleteImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (en)
              </label>
              <textarea
                value={categoryData.description_en}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    description_en: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (fr)
              </label>
              <textarea
                value={categoryData.description_fr}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    description_fr: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (ar)
              </label>
              <textarea
                value={categoryData.description_ar}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    description_ar: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Background Color
              </label>
              <select
                value={categoryData.bgColor}
                onChange={(e) =>
                  setCategoryData((prev) => ({
                    ...prev,
                    bgColor: `bg-${e.target.value}-100`, // Dynamically update class
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {["blue", "red", "green", "yellow", "purple", "pink"].map(
                  (color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sub Categories
                </label>
                <button
                  type="button"
                  onClick={addSubCategory}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaPlus size={16} />
                </button>
              </div>
              {categoryData.subCategories.map((sub, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sub.name_en}
                      onChange={(e) => updateSubCategoryNameEn(e, sub._id)} // Update the subcategory name
                      placeholder="Name"
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                    />
                    <br />
                     <input
                      type="text"
                      value={sub.name_fr}
                      onChange={(e) => updateSubCategoryNameFr(e, sub._id)} // Update the subcategory name
                      placeholder="Name"
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                    />
                    <br />
                     <input
                      type="text"
                      value={sub.name_ar}
                      onChange={(e) => updateSubCategoryNameAr(e, sub._id)} // Update the subcategory name
                      placeholder="Name"
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                    />
                    <br />
                    <button
                      type="button"
                      onClick={() => removeSubCategory(index)}
                      className="p-2 text-red-600 rounded-md hover:text-red-800 hover:bg-red-100 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>

                  {/* Zone d'upload */}
                  <div className="relative w-full max-w-sm border-2 border-gray-300 border-dashed rounded-lg p-6 hover:border-indigo-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                      onChange={(event) => handleImageSubUpload(event, sub._id)}
                    />
                    <div className="text-center">
                      <img
                        className="mx-auto h-12 w-12 opacity-75"
                        src="https://www.svgrepo.com/show/357902/image-upload.svg"
                        alt="Upload Icon"
                      />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        <span className="cursor-pointer text-indigo-600 hover:underline">
                          {t("click_to_upload_multiple_images")}
                        </span>
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF {t("up_to_10mb")}
                      </p>
                    </div>
                  </div>

                  {/* Preview Images */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {sub?.icon &&
                      (loading ? (
                        <Loader />
                      ) : (
                        <div className="relative">
                          <img
                            src={sub.icon}
                            className="w-24 h-24 object-cover rounded-md"
                            alt="Uploaded"
                          />
                          {/* Delete Button */}
                          <button
                            onClick={(e) => deleteSubImage(e, sub._id)}  //
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={category ? handleUpdate : handleCreate}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700"
            >
              {category ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
