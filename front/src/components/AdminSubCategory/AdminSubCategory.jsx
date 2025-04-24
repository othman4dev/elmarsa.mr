import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddCategoryModal from "../AddCategoryModal/AddCategoryModal";
import { deleteCategory, deleteSubCategory, fetchCategories, getAllCategory } from "../../redux/apiCalls";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

const AdminSubCategory = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || 'fr';
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null)

    useEffect(() => {
        const fetchedCategories = async () => {
            try {
                // Make sure to use your API call method, like `getAllCategory`
                const res = await fetchCategories();
                setCategories(res); // Assuming `res` is the data from the response
                console.log("res : ", res);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchedCategories(); // Call fetchCategories when the component mounts
    }, [loading]); // Empty dependency array to run only once when the component mounts


    const [expandedCategory, setExpandedCategory] = useState(null);


    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };
    const openAddModal = () => {
        setCategory(null);
        setIsAddModalOpen(true);
    }
    const closeAddModal = () => {
        setIsAddModalOpen(false);
    }
    const openEditModal = (selectedCategory) => {
        setIsAddModalOpen(true);
        setCategory(selectedCategory)
    }
    const handleDeleteCategory = async (id) => {
        try {
            setLoading(true);
            await deleteCategory(id);
            console.log("Deleted category successfully");
        } catch (error) {
            console.error("Error : ", error);
        } finally {
            setLoading(false);
        }
    }
    const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
        try {
            setLoading(true);
            await deleteSubCategory(categoryId, subCategoryId);
            console.log("Deleted category successfully");
        } catch (error) {
            console.error("Error : ", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className=" mx-auto ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold ">Liste des Catégories</h2>
                <button onClick={openAddModal} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Category</button>
            </div>
            <div className="space-y-2">
                {categories?.map((category) => (
                    <div key={category._id} className="border rounded-lg overflow-hidden">
                        <div className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                            <button
                                onClick={() => toggleCategory(category._id)}
                                className="flex items-center space-x-2 flex-grow"
                            >
                                <img src={category.icon} alt='no name' className="w-8 h-8 rounded-md" />
                                <span className="font-medium">{category["name_" + lang]}</span>
                                {expandedCategory === category._id ? (
                                    <IoIosArrowUp className="text-gray-500 ml-2" />
                                ) : (
                                    <IoIosArrowDown className="text-gray-500 ml-2" />
                                )}
                            </button>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => openEditModal(category)} className="p-2 text-blue-600 hover:text-blue-800">
                                    <FaEdit size={18} />
                                </button>
                                <button onClick={() => handleDeleteCategory(category._id)}
                                    className="p-2 text-red-600 hover:text-red-800">
                                    {loading ? (
                                        <Loader />
                                    ) : (
                                        <FaTrash size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {expandedCategory === category._id && (
                            <div className="bg-gray-50 border-t mx-5">
                                {category.subCategories?.map((subCategory) => (
                                    <div key={subCategory._id} className="px-4 py-2 flex items-center justify-between hover:bg-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <img src={subCategory.icon} alt={subCategory["name_" + lang]} className="w-6 h-6 rounded-md" />
                                            <span>{subCategory["name_" + lang]}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {/* <button onClick={() => handleUpdate(subCategory._id)} className="p-1 text-blue-600 hover:text-blue-800">
                                                <FaEdit size={16} />
                                            </button> */}
                                            <button onClick={() => handleDeleteSubCategory(category._id, subCategory._id)} className="p-1 text-red-600 hover:text-red-800">
                                                {loading ? (
                                                    <Loader />
                                                ) : (
                                                    <FaTrash size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

            </div>
            {isAddModalOpen && (
                <AddCategoryModal loading={loading} setLoading={setLoading} category={category} isOpen={openAddModal} onClose={closeAddModal} setIsAddModalOpen={setIsAddModalOpen} />
            )
            }
        </div>
    );
};

export default AdminSubCategory