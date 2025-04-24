import "./AboutHero.scss";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config

const AboutHero = () => {
  const { t, i18n } = useTranslation();

  const data = [
    {
      id: 1,
      title: t('customer_service'),
    },
    {
      id: 2,
      title: t('dedicated_employees'),
    },
    {
      id: 3,
      title:t('global_branches') ,
    },
    {
      id: 4,
      title: t('electronics_products'),
    },
  ];
  return (
    <div className="aboutHero">
      <div className="left">
        <span>{t('who_we_are')}</span>
        <h2>{t('about_title')}</h2>
        <p>
        {t('about_description')}{" "}
        </p>
        <div className="items">
          {data.map((item) => (
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13.875 7.875L5.625 16.125L1.5 12"
                  stroke="#2DB324"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M22.5004 7.875L14.2504 16.125L12.0566 13.9313"
                  stroke="#2DB324"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {item.title}
            </li>
          ))}
        </div>
      </div>
      <div className="right">
        <img src="../about.png" alt="" />
      </div>
    </div>
  );
};

export default AboutHero;
