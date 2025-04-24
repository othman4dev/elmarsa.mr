import "./ProductCard.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { publicRequest } from "../../axios";
import { addFavorite, removeFavorite } from "../../redux/userSlice";
import { useTranslation } from "react-i18next";
import "../../locales/i18.js"; // Import the i18n config
const ProductCard = ({ item }) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const user = useSelector((stat) => stat.user.currentUser);
  const fav = user?.favorites;
  const isFav = fav?.includes(item._id);
  const dispatch = useDispatch();
  const handleFav = async (id) => {
    if (isFav) {
      await publicRequest.delete(`/api/product/favorites/${id}`);
      dispatch(removeFavorite(id));
    } else {
      await publicRequest.post(`/api/product/favorites/${id}`);

      dispatch(addFavorite(id));
    }
  };

  return (
    <div className="productCard">
      {item.isPremium && (
        <h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
          >
            <path
              d="M6.6108 9.13L3.0843 11.104L3.8718 7.14L0.904297 4.396L4.9178 3.92L6.6108 0.25L8.3038 3.92L12.3173 4.396L9.3498 7.14L10.1373 11.104L6.6108 9.13Z"
              fill="#FC942D"
            />
          </svg>{" "}
          {t('premium_ann')}
        </h3>
      )}
      <img
        src={item.images[0]}
        alt=""
        onClick={() => navigate("/productPage/" + item._id)}
      />
      <div className="info">
        <div className="text">
          <h2>{item.title}</h2>
          <span>{item.price} DH</span>
        </div>
        <div className="icon" onClick={() => handleFav(item._id)}>
          {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
