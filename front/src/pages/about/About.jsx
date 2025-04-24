import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUserShield, FaHandshake, FaBoxOpen, FaHome, FaCar, FaBlender, FaMobile, FaTshirt, FaCouch, FaIndustry, FaGamepad, FaBriefcase } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const About = () => {
  const {t,i18n} = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    {
      icon: <FaHome className="text-4xl" />,
      title: t('immobilier'),
      description: t('immobilier_description')
    },
    {
      icon: <FaCar className="text-4xl" />,
      title: t('vehicules_transport'),
      description: t('vehicules_transport_description')
    },
    {
      icon: <FaBlender className="text-4xl" />,
      title: t('electromenager_cuisine'),
      description: t('electromenager_cuisine_description')
    },
    {
      icon: <FaMobile className="text-4xl" />,
      title: t('electronique'),
      description: t('electronique_description')
    },
    {
      icon: <FaTshirt className="text-4xl" />,
      title: t('mode_accessoires_beaute'),
      description: t('mode_accessoires_beaute_description')
    },
    {
      icon: <FaCouch className="text-4xl" />,
      title: t('decoration_meubles'),
      description: t('decoration_meubles_description')
    },
    {
      icon: <FaIndustry className="text-4xl" />,
      title: t('materiel_industriel_agricole'),
      description: t('materiel_industriel_agricole_description')
    },
    {
      icon: <FaGamepad className="text-4xl" />,
      title: t('jeux_sports_loisirs'),
      description: t('jeux_sports_loisirs_description')
    },
    {
      icon: <FaBriefcase className="text-4xl" />,
      title: t('offres_emploi_services'),
      description: t('offres_emploi_services_description')
    }
  ];

  const benefits = [
    { icon: <FaShoppingCart className="text-4xl" />, title: t('easy_seller_onboarding'), description: t('easy_seller_onboarding_description') },
    { icon: <FaUserShield className="text-4xl" />, title: t('buyer_protection'), description: t('buyer_protection_description') },
    { icon: <FaHandshake className="text-4xl" />, title: t('transport_transactions'), description: t('transport_transactions_description') },
    { icon: <FaBoxOpen className="text-4xl" />, title: t('diverse_product_range'), description: t('diverse_product_range_description') }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-6 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-5xl font-bold mb-4">{t('connecting_people')}</h1>
              <p className="text-xl mb-8">{t('building_bridges')}</p>
              <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">{t('get_started')}</button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8">{t('our_story')}</h2>
            <h4 className=" font-bold mb-4">{t('story_title')}</h4>
            <p className="text-lg text-gray-600 mb-12">{t('story_container')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8">{t('platform_title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">{t('ad_section_title_1')}</h3>
              <p className="text-gray-600">{t('ad_section_desc_1')}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">{t('ad_section_title_2')}</h3>
              <p className="text-gray-600">{t('ad_section_desc_2')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">{t('why_choose_us')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:transform hover:scale-105 transition duration-300"
              >
                <div className="text-blue-600 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">{t('our_categories')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="text-blue-600 mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;