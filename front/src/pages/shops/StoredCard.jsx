import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FiMail, FiPhone, FiTag, FiBell, FiCalendar, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const StoreCard = React.memo(({ store }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [expanded, setExpanded] = useState(true);

    const toggleExpand = useCallback(() => {
        setExpanded((prev) => !prev);
    }, []);
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    // Assuming the store has a dynamic structure with categories and subcategories
    const categories = Object.entries(store).map(([category, subCategory], index) => (
        <span key={index} className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
            <FiTag className="inline mr-1" />
            {category} -- {subCategory}
        </span>
    ));
    console.log("Categories:", categories);
    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg cursor-pointer relative"
            onClick={toggleExpand}
            onKeyPress={(e) => e.key === "Enter" && toggleExpand()}
            role="button"
            tabIndex={0}
        >
            <div className="flex items-center justify-between mb-2">

                <h3 className="text-xl font-bold text-gray-800 mb-2">{store.username}</h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/sellerProfile/${store._id}`);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Visit store page"
                >
                    <FiExternalLink className="w-5 h-5" />
                </button>
            </div>
            <div className={`transition-all duration-300 my-4 ${expanded ? "block" : "hidden"} space-y-3`}>
                <div className="flex items-center text-gray-600">
                    <FiMail className="mr-2" />
                    <span>{store.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-2" />
                    <span>{store.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2" />
                    <span>{t('registred')}: {formatDate(store.createdAt)}</span>
                </div>
            </div>
            {
                store.categories.map((category, index) => (
                    <span key={index} className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                        <FiTag className="inline mr-1" />
                        {/* <div className="flex flex-wrap gap-2 mt-3"> */}
                        {category}
                        {/* </div> */}
                    </span>
                ))
            }

            <div className="mt-4 flex items-center justify-end mb-0 absolute bottom-3 right-3">
                <FiBell className="text-purple-500 mr-1" />
                <span className="text-sm font-semibold text-purple-500">
                    {store.announcements} Announcements
                </span>
            </div>
        </div>
    );
});

export default StoreCard;
