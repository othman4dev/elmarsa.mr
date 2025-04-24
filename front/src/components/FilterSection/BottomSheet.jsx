import { useState, useCallback, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { MdTune } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import FilterSection from "./FilterSection";

const BottomSheet = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    price: "all",
    category: "all",
    rating: "all",
  });

  const toggleSheet = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleSheet();
    }
  };

  const filters = [
    {
      name: "Price Range",
      options: ["All", "Under $50", "$50-$100", "$100-$200", "$200+"],
    },
    {
      name: "Category",
      options: ["All", "Electronics", "Clothing", "Books", "Home & Garden"],
    },
    {
      name: "Rating",
      options: ["All", "4★ & above", "3★ & above", "2★ & above"],
    },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={toggleSheet}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open filters"
      >
        <MdTune className="text-2xl" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" onClick={handleBackdropClick} aria-hidden="true">
          <div
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`}
            style={{ maxHeight: "90vh" }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                <button onClick={toggleSheet} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Close filters">
                  <IoClose className="text-2xl" />
                </button>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)" }}>
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="h-12 flex items-center justify-center hover:bg-gray-50 w-full text-left text-lg px-4 py-3 rounded-lg transition-colors duration-200"
                >
                  <BiCategory className="mr-2" />
                  {t("select_category")}{" "}
                </button>
              </div>

              <div className="sticky bottom-0 pt-4 pb-6 bg-white border-t border-gray-200">
                <button
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={toggleSheet}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FilterSection isCategoryModal={isCategoryModalOpen} setIsCategoryModal={setIsCategoryModalOpen} />
    </div>
  );
};

export default BottomSheet;
