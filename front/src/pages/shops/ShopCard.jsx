import React from 'react'
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import { FiTag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
const ShopCard = ({ shop }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const lang = i18n.language || "fr";
    let langType = "";
    if (lang === "fr") {
        langType = "fr-FR";
    } else if (lang === "ar") {
        langType = "ar-EG";
    }
    else {
        langType = "en-US";
    }
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(langType, {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };
    console.log("Shop Card : ", shop);
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/sellerProfile/${shop._id}`);
            }}
            className="bg-white cursor-pointer rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="flex flex-col md:flex-row p-6 gap-6">
                <div className="flex-1">
                    <div className="flex items-start gap-4">
                        <img
                            src={shop.image || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt={`${shop.username}`}
                            className="w-20 h-20 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8";
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-800">{shop.username}</h2>
                                {shop.isVerified && (
                                    <FaCheckCircle className="text-blue-500 text-lg" />
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-gray-600">
                                <div className="flex items-center gap-1 mb-6">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="text-sm">{t('member_since')} {formatDate(shop.createdAt)}</span>
                                </div>
                                {/* <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="text-sm">{shop.location}</span>
                  </div> */}
                            </div>
                            {
                                shop.categories.map((category, index) => (
                                    <span key={index} className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-600">
                                        <FiTag className="inline mr-1" />
                                        {/* <div className="flex flex-wrap gap-2 mt-3"> */}
                                        {category}
                                        {/* </div> */}
                                    </span>
                                ))
                            }
                            <p className="mt-2 text-gray-600 text-sm">{shop.description}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full md:w-48">
                    {shop.productsImages.slice(0, 3).map((product, index) => (
                        <img
                            key={index}
                            src={product}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg hover:opacity-75 transition-opacity duration-300"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38";
                            }}
                        />
                    ))}
                    <div className="relative">
                        <img
                            src={shop.productsImages[3]}
                            alt="Product 4"
                            className="w-full h-24 object-cover rounded-lg brightness-50"
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38";
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                            + {shop.announcements} {t('items')}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};
export default ShopCard;