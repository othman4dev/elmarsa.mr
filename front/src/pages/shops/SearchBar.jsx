import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ onSearch  , searchQuery , setSearchQuery}) => {
   const {t,i18n} = useTranslation();
  
    return (
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={t('search_stores')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    );
  };
  export default SearchBar;