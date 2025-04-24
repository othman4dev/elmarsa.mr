import "./SideBarSetting.scss";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const SideBarSetting = ({  setActiveComponents }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="sideBarSetting">
      <div className="item" onClick={() => setActiveComponents("info")}>
        <p>{t('edit_your_infos')}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M21.7312 16.0112L12.1312 25.6112C11.7561 25.9863 11.1479 25.9863 10.7728 25.6112C10.3977 25.2361 10.3977 24.6279 10.7728 24.2528L19.6948 15.332L10.7728 6.41122C10.3977 6.03611 10.3977 5.42793 10.7728 5.05282C11.1479 4.67771 11.7561 4.67771 12.1312 5.05282L21.7312 14.6528C21.9115 14.8329 22.0127 15.0772 22.0127 15.332C22.0127 15.5868 21.9115 15.8312 21.7312 16.0112Z"
            fill="#5F5C5B"
          />
        </svg>
      </div>
      <div className="item" onClick={() => setActiveComponents("pass")}>
        <p>{t('edit_password')}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
        >
          <path
            d="M21.7312 16.0112L12.1312 25.6112C11.7561 25.9863 11.1479 25.9863 10.7728 25.6112C10.3977 25.2361 10.3977 24.6279 10.7728 24.2528L19.6948 15.332L10.7728 6.41122C10.3977 6.03611 10.3977 5.42793 10.7728 5.05282C11.1479 4.67771 11.7561 4.67771 12.1312 5.05282L21.7312 14.6528C21.9115 14.8329 22.0127 15.0772 22.0127 15.332C22.0127 15.5868 21.9115 15.8312 21.7312 16.0112Z"
            fill="#5F5C5B"
          />
        </svg>
      </div>
    </div>
  );
};

export default SideBarSetting;
