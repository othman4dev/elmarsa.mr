import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../locales/i18.js"; // Import the i18n config

const LanguageDropdown = ({ mode }) => {
  const { t, i18n } = useTranslation();
  const languages = [
    //{ flag: { img: "/usa.jpg", alt: t('eng') }, lang: "en" },
    { flag: { img: "/saoudia.webp", alt: t('ar') }, lang: "ar" },
    { flag: { img: "/france.webp", alt: t('fr') }, lang: "fr" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]); // Default language

  // Load saved language from localStorage when component mounts
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage") || "ar"; // Default to English if not set
    const newLang = languages.find((l) => l.lang === savedLang);

    if (newLang) {
      setSelectedLang(newLang);
      i18n.changeLanguage(savedLang);
      document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLang;
    }
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    
    const newLang = languages.find((l) => l.lang === lang);
    
    if (newLang) {
      setSelectedLang(newLang);
      localStorage.setItem("selectedLanguage", lang); // Save to localStorage
    }
  
    // Force re-render for immediate language switch
    setSelectedLang(prevState => ({
      ...prevState,
      flag: {
        ...prevState.flag,
        alt: t(lang === "ar" ? "ar" : "fr"),  // Ensure translation is updated
      },
    }));
  
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };
  
  const isRTL = i18n.language === "ar"; // Check if Arabic is selected

  return (
    <div className={`relative ${mode === "mobile" ? "flex" : ""}`}>
      <button
        type="button"
        style={{
          position: "relative",
          width: "30px",
          height: "30px",
          marginLeft: isRTL ? "0px" : "27px",  // Adjust margin for LTR
          marginRight: isRTL ? "27px" : "0px", // Adjust margin for RTL
          display: mode === "mobile" ? "flex" : ""
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="lang inline-flex justify-center items-center px-2 py-2 text-sm font-medium text-gray-900 rounded-lg cursor-pointer dark:text-white "
      >
        <img
          style={{ position: "absolute", width: "100%", height: "100%", marginLeft: mode === 'mobile' ? '-30px' : '' }}
          src={selectedLang.flag.img}
          alt={selectedLang.flag.alt}
          className="w-5 h-5 rounded-full me-3"
        />
        <p className="text-white" style={{ display: mode === "mobile" ? "block" : "none", marginLeft: mode === 'mobile' ? '50px' : '' }}>
          {selectedLang.flag.alt}</p>

        {/* Button */}

      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            marginLeft: mode === 'mobile' ? '40px' : '',
            marginTop: mode === 'mobile' ? '40px' : ''
          }}
          className="absolute z-50 mt-2 text-base list-none bg-white rounded-lg divide-y divide-gray-100 shadow dark:bg-gray-700">
          <ul className="py-2 font-medium">
            {languages.map(({ flag, lang }, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changeLanguage(lang);
                    setIsOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white w-[200px]"
                >
                  <div className="inline-flex items-center"
                    style={{
                      position: "relative",
                      width: "30px",
                      height: "30px",
                    }}>
                    <img
                      style={{ position: "absolute", width: "100%", height: "100%" }}
                      src={flag.img}
                      alt={flag.alt}
                      className="w-3.5 h-3.5 rounded-full me-2"
                    />
                    <p style={{
                      color:"black",
                      marginLeft: isRTL ? "0px" : "40px",  // Adjust margin for LTR
                      marginRight: isRTL ? "40px" : "0px", // Adjust margin for RTL

                    }}>
                      {flag.alt}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
