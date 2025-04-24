import { useNavigate } from "react-router-dom";
import "./SelectCategoryItem.scss";

const SelectCategoryItem = ({ item, onSelectCategory }) => {
  const url = location.pathname;
 
  const navigate = useNavigate();
  return (
    <div
      className="selectCategoryItem"
      key={item._id}
      onClick={() =>
        url === "/"
          ? navigate("/category/" + item._id)
          : onSelectCategory(item._id)
      }
    >
      <div className="icon">
        {" "}
        <img src={item.icon} alt="" />
      </div>
      {item.name}
    </div>
  );
};

export default SelectCategoryItem;
