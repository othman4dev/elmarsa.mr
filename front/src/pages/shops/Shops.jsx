import React, { useState, useEffect, useMemo } from "react";
import FilterSection from "./FilterSection";
import SearchBar from "./SearchBar";
import StoreCard from "./StoredCard";
import { fetchShops } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";
import ShopCard from "./ShopCard";

const Shops = () => {
    const { t, i18n } = useTranslation();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getShops = async () => {
            try {
                const res = await fetchShops(categoryName, sortBy, searchQuery);
                if (res.status === 200) {
                    setStores(res.data);
                    setLoading(false);
                    console.log("Shops : ", res.data);
                }
                else {
                    setError("Failed to fetch stores");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error : ", error);
            }
        }
        getShops();
    }, [categoryName, sortBy, searchQuery]);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
             
        <div className="max-w-7xl mx-auto">
        
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={setSearchTerm} />
             <FilterSection
                 sortBy={sortBy}
                 setSortBy={setSortBy}
                 categoryName={categoryName}
                 setCategoryName={setCategoryName}
                 onSort={setSortBy}
                 onCategoryFilter={setCategoryName}
             />
          
          {stores.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">No shops found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-6">
              {stores.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
};

export default Shops;