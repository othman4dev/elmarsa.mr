import "./MobileApp.scss";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const MobileApp = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="mobileApp">
      <div className="top">
        <img src="./Background.png" alt="" />
      </div>
      <div className="bottom">
        <div className="left">
          <div className="text">
            <span>73%</span>
            <p>
              {t('sold_quickly1')}<br /> {t('sold_quickly2')}
            </p>
          </div>
        </div>
        <div className="right">
          <div className="text">
            <span>92%</span>
            <p>{t('user_satisfaction')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
