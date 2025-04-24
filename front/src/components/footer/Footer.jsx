import { useEffect, useState } from "react";
import "./Footer.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config

const Footer = () => {
  const { t, i18n } = useTranslation();

  const [categoriesData, setCategoriesData] = useState([]);
  const categories = useSelector((stat) => stat.category.categories);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        setCategoriesData(categories);
      } catch (error) {
        //console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="footer">
      <div className="wrapper">
        <div className="contact">
          <div className="logo">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24ZM36 24C36 30.6274 30.6274 36 24 36C17.3726 36 12 30.6274 12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24ZM24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z"
                fill="#FA8232"
              />
            </svg>

            <span>Elmarsa</span>
          </div>
	  <a href="https://wa.me/22246820209" target="_blank">
          <div className="item">
            <span>{t('customer_support')}:</span>
            <p>+22246820209</p>
          </div>
	  </a>
	  <a href="https://www.facebook.com/share/1Dy8hTigeF/?mibextid=wwXIfr" target="_blank">
          <div className="item" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', textDecoration: 'underline' }}>
	    <i className="bi bi-facebook" style={{ color: '#77878f' }}></i>
            <span>
             {t('lien_facebook')}
            </span>
          </div>
	  </a>
          <div className="item">
            <p>elmarsa.mr@gmail.com</p>
          </div>
        </div>
        <div className="links">
          <p>{t('top_categories')}</p>
          {categoriesData?.map((item, index) => {
            return (
              <li key={index} onClick={() => navigate(`/category/${item._id}`)}>
                {item.name}
              </li>
            );
          })}

          <span onClick={() => navigate(`/category`)}>
          {t('browse_all_products')}{" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.125 10H16.875"
                stroke="#EBC80C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.25 4.375L16.875 10L11.25 15.625"
                stroke="#EBC80C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="links">
          <p>{t('quick_links')}</p>
          <li onClick={() => navigate(`/category`)}>{t('shop_products')}</li>
          <li onClick={() => navigate(`/setting`)}>{t('my_account')}</li>

          <li onClick={() => navigate(`/about`)}>{t('about')}</li>
        </div>
        <div className="app">
          <p>{t('download_app')}</p>
          <div className="item ">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="33"
                viewBox="0 0 32 33"
                fill="none"
              >
                <g clip-path="url(#clip0_134_116)">
                  <path
                    d="M20.0866 15.8131L6.29141 1.97946L23.8434 12.0563L20.0866 15.8131ZM2.68981 1.16666C1.87701 1.59226 1.33301 2.36666 1.33301 3.37466V30.9587C1.33301 31.9667 1.87701 32.7411 2.68981 33.1667L18.733 17.1635L2.68981 1.16666ZM29.2706 15.2691L25.589 13.1379L21.4818 17.1699L25.589 21.2019L29.3458 19.0707C30.4706 18.1763 30.4706 16.1635 29.2706 15.2691ZM6.29141 32.3603L23.8434 22.2835L20.0866 18.5267L6.29141 32.3603Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_134_116">
                    <rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="text">
              <span>{t('get_it_now')}</span>
              <h3>{t('google_play')}</h3>
            </div>
          </div>
          <div className="item">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="33"
                viewBox="0 0 32 33"
                fill="none"
              >
                <g clip-path="url(#clip0_134_122)">
                  <path
                    d="M29.0563 25.438C28.5896 26.5249 28.0133 27.5614 27.3363 28.5313C26.431 29.8213 25.6903 30.714 25.1197 31.21C24.235 32.0233 23.2863 32.4407 22.271 32.464C21.5423 32.464 20.6637 32.2567 19.6403 31.836C18.6137 31.4173 17.6703 31.2093 16.8077 31.2093C15.903 31.2093 14.933 31.4173 13.895 31.836C12.8557 32.2567 12.0183 32.476 11.3783 32.4973C10.405 32.5393 9.43433 32.1107 8.46499 31.21C7.84699 30.67 7.07433 29.746 6.14766 28.4367C5.15366 27.038 4.33633 25.4167 3.69633 23.5673C3.01099 21.5707 2.66699 19.6367 2.66699 17.7647C2.66699 15.62 3.13033 13.7707 4.05833 12.2207C4.78833 10.9753 5.75833 9.994 6.97299 9.27267C8.16465 8.55956 9.52435 8.17581 10.913 8.16067C11.6863 8.16067 12.7003 8.4 13.961 8.87C15.2177 9.34133 16.0243 9.58067 16.3783 9.58067C16.6423 9.58067 17.539 9.30067 19.0583 8.74333C20.4957 8.226 21.7083 8.012 22.7017 8.09667C25.3943 8.314 27.417 9.37533 28.7617 11.2873C26.3543 12.746 25.163 14.7893 25.187 17.4107C25.2083 19.4527 25.949 21.152 27.405 22.5007C28.065 23.1273 28.8017 23.6113 29.621 23.9547C29.4492 24.4552 29.2609 24.9499 29.0563 25.438ZM22.8817 1.14067C22.8817 2.74067 22.297 4.23533 21.1317 5.618C19.725 7.26267 18.0243 8.21267 16.1797 8.06267C16.1549 7.86139 16.1424 7.65879 16.1423 7.456C16.1423 5.92 16.811 4.276 17.999 2.93133C18.5923 2.25067 19.3457 1.68467 20.2603 1.23333C21.1737 0.788667 22.0363 0.542667 22.8483 0.5C22.8717 0.714 22.8817 0.928 22.8817 1.14V1.14067Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_134_122">
                    <rect
                      width="32"
                      height="32"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="text">
              <span>{t('get_it_now')}</span>
              <h3>{t('app_store')}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
