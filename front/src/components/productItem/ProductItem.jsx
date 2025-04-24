import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../../axios";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import "./ProductItem.scss";
import { formatDistanceToNow } from "date-fns";
const ProductItem = ({ item }) => {
  const timeAgo = formatDistanceToNow(item.createdAt, { addSuffix: true });
  const [openUpdate, setOpenUpdate] = useState(false);

  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      //console.log("aaaa");

      await publicRequest.delete("/api/product/" + item._id);
    } catch (err) {
      //console.log(err);
    }
  };
  return (
    <div className="productItem" key={item._id}>
      <div className="left">
        <img src={item.images[0]} alt="" />
        <div className="productInfo">
          <div className="title">
            <p>{item.price}DH</p>
            <span>{item.title}</span>
          </div>
          <span>{`${timeAgo} ${item.location}`}</span>
        </div>
      </div>
      <div className="right">
        <div className="action">
          <div className="delete" onClick={() => handleDelete()}>
            <DeleteRoundedIcon fontSize="inherit" />
          </div>
          <img
            src="../setting.png"
            alt=""
            onClick={() => navigate("/publishProduct/" + item._id)}
          />
        </div>

        <div
          className="booster"
          onClick={() => navigate("/booster/" + item._id)}
        >
          <img src="../booster.png" alt="" />
          BOOSTER
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
