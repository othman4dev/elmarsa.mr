import { useEffect, useState } from "react";
import { fetchCategories } from "../../redux/apiCalls";
import { useTranslation } from "react-i18next";

const FilterSection = ({ sortBy, setSortBy, categoryName, setCategoryName, onSort, onCategoryFilter }) => {
    const {t,i18n} = useTranslation();
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const res = await fetchCategories();
                setCategories(res);
                console.log("Fetched categories: ", res);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        }
        fetchAllCategories();
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="">{t('sort_by')}...</option>
                <option value="announcements">{t('annoucements')}</option>
                <option value="alphabetical">{t('alphabetical')}</option>
                <option value="date">{t('date')}</option>
            </select>
            <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setCategoryName(e.target.value)}
                value={categoryName}
            >
                <option value="">{t('all_categories')}</option>
                {categories.map((category, index) => (
                    <option key={index} value={category.name}>{category.name}</option>
                ))}
            </select>
        </div>
    );
};
export default FilterSection;