import { useEffect, useState } from "react";
import "./ProductPage.scss";
import { useLocation } from "react-router-dom";
import HorizontalScroll from "../../components/horizentalScroll/HorizentalScroll";
import { toast } from "react-toastify";
import Button from "../../components/button/Button";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
import {
  fetchDataByCategory,
  getCategory,
  getProduct,
  getSeller,
} from "../../redux/apiCalls";

const ProductPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [seller, setSeller] = useState("");
  const [category, setCategory] = useState(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const fetchData = async () => {
      const product = await getProduct(productId);
      const category = await getCategory(product.categoryId);
      const categoryData = await fetchDataByCategory(product.categoryId);
      const seller = await getSeller(product.sellerId);

      setProduct(product);
      setCategory(category.name);
      setCategoryData(categoryData);
      setSeller(seller);
    };

    fetchData();
  }, [productId, product.categoryId]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
//console.log(product);

  return (
    <div className="productPage">
      <div className="product">
        <div className="item imgContainer">
          <div className="main-image">
            {product.images && (
              <img src={product.images[currentIndex]} alt="" />
            )}
          </div>
          <div className="control">
            <div className="left" onClick={() => handlePrev()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.25 12H3.75"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.5 5.25L3.75 12L10.5 18.75"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="thumbnail">
              {product.images &&
                product.images.map((img, index) => {
                  return (
                    <img
                      src={img}
                      alt=""
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={currentIndex === index ? "active" : ""}
                    />
                  );
                })}
            </div>
            <div className="right" onClick={() => handleNext()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M3.75 12H20.25"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.5 5.25L20.25 12L13.5 18.75"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="item infoContainer">
          <h3>{product.title}</h3>
          <span className="price">{product.price} DH</span>
          <div className="item">
            <p>{t('category')} : </p>
            <span>{category}</span>
          </div>
          <div className="item">
            <p>{t('location')} : </p>
            <span>{product.location}</span>
          </div>
          <div className="item">
            <p>{t('seller')}:</p>
            <span>{seller}</span>
          </div>
          <div className="item">
            <p>{t('description')}:</p>
            <span>{product.description}</span>
          </div>
          <div className="item btn">
            <Button
              label={t('contact_now')}
              onClick={() => {
                navigator.clipboard.writeText(`${product.contact}`);
                toast.success("Contact information copied to clipboard!", {
                  theme: "colored",
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="categoryItem">
        <div className="tittle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M16.6878 7.46824C17.2008 7.46824 17.4478 6.81512 17.0298 6.48895L10.3418 0.923535C10.2438 0.839894 10.1192 0.793945 9.9903 0.793945C9.86144 0.793945 9.73681 0.839894 9.6388 0.923535L2.9698 6.48895C2.5708 6.81512 2.7988 7.46824 3.3118 7.46824H4.0338V17.7552H3.7868C3.62012 17.7574 3.46101 17.8251 3.34374 17.9436C3.22646 18.062 3.16041 18.2218 3.1598 18.3885C3.1598 18.7337 3.4448 19.0218 3.7868 19.0218H16.2128C16.3795 19.0195 16.5386 18.9519 16.6559 18.8334C16.7731 18.715 16.8392 18.5552 16.8398 18.3885C16.8398 18.0425 16.5548 17.7552 16.2128 17.7552H15.9658V7.46824H16.6878ZM9.1448 15.8552C9.1448 16.0847 8.9548 16.2771 8.7268 16.2771H6.8268C6.71557 16.2757 6.60938 16.2305 6.53116 16.1514C6.45295 16.0723 6.409 15.9656 6.4088 15.8544V14.7421C6.4088 14.5117 6.5988 14.3193 6.8268 14.3193H8.7268C8.9548 14.3193 9.1448 14.5117 9.1448 14.7421V15.8552ZM9.1448 12.2847C9.1448 12.5151 8.9548 12.7075 8.7268 12.7075H6.8268C6.71557 12.706 6.60938 12.6609 6.53116 12.5818C6.45295 12.5027 6.409 12.396 6.4088 12.2847V11.1717C6.4088 10.9421 6.5988 10.7497 6.8268 10.7497H8.7268C8.9548 10.7497 9.1448 10.9413 9.1448 11.1717V12.2847ZM9.1448 8.71512C9.1448 8.94549 8.9548 9.13787 8.7268 9.13787H6.8268C6.71557 9.13641 6.60938 9.09126 6.53116 9.01216C6.45295 8.93305 6.409 8.82636 6.4088 8.71512V7.60204C6.4088 7.37245 6.5988 7.18008 6.8268 7.18008H8.7268C8.9548 7.18008 9.1448 7.37166 9.1448 7.60204V8.71512ZM13.5908 15.8552C13.5908 16.0847 13.4008 16.2771 13.1728 16.2771H11.2728C11.1616 16.2757 11.0554 16.2305 10.9772 16.1514C10.8989 16.0723 10.855 15.9656 10.8548 15.8544V14.7421C10.8548 14.5117 11.0448 14.3193 11.2728 14.3193H13.1728C13.4008 14.3193 13.5908 14.5117 13.5908 14.7421V15.8552ZM13.5908 12.2847C13.5908 12.5151 13.4008 12.7075 13.1728 12.7075H11.2728C11.1616 12.706 11.0554 12.6609 10.9772 12.5818C10.8989 12.5027 10.855 12.396 10.8548 12.2847V11.1717C10.8548 10.9421 11.0448 10.7497 11.2728 10.7497H13.1728C13.4008 10.7497 13.5908 10.9413 13.5908 11.1717V12.2847ZM13.5908 8.71512C13.5908 8.94549 13.4008 9.13787 13.1728 9.13787H11.2728C11.1616 9.13641 11.0554 9.09126 10.9772 9.01216C10.8989 8.93305 10.855 8.82636 10.8548 8.71512V7.60204C10.8548 7.37245 11.0448 7.18008 11.2728 7.18008H13.1728C13.4008 7.18008 13.5908 7.37166 13.5908 7.60204V8.71512Z"
              fill="#3AA4FF"
            />
          </svg>
          <h3>{category}</h3>
          <span>{t('see_more')}</span>
        </div>
        <HorizontalScroll data={categoryData} />
      </div>
    </div>
  );
};

export default ProductPage;
