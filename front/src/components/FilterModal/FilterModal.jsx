import { useState, useEffect } from "react";
import { FaTimes, FaFilter, FaImage } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FilterModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [hasPrice, setHasPrice] = useState(false);

  const categories = [
    "Immobilier",
    "Voitures",
    "Electroniques",
    "Vêtements",
    "Meubles",
    "Téléphones",
    "Électroménager",
    "Sports & Loisirs",
    "Services",
    "Emploi",
  ];

  const moroccanCities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
    "Tétouan",
    "Laâyoune",
  ];

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setSelectedCategories([]);
    setSelectedCity("");
    setHasImage(false);
    setHasPrice(false);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaFilter />
        Filtrer les annonces
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-2xl font-bold">
                  Filtres
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">
                    Fourchette de prix (DH)
                  </h3>
                  <Slider
                    range
                    min={0}
                    max={100000}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value)}
                    className="mb-4"
                  />
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Catégories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="rounded text-blue-600"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Ville</h3>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Toutes les villes</option>
                    {moroccanCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasImage}
                      onChange={(e) => setHasImage(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="flex items-center gap-2">
                      <FaImage /> Avec photos uniquement
                    </span>
                  </label>

                  <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPrice}
                      onChange={(e) => setHasPrice(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Avec prix uniquement</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default FilterModal;
