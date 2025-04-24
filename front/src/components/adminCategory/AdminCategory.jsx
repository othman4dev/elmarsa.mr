import { useEffect, useState } from "react";
import AddCategory from "../addCategory/AddCategory";
import SelectCategoryItem from "../selectCategoryItem/SelectCategoryItem";
import "./AdminCategory.scss";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory, getAllCategory } from "../../redux/apiCalls";
import DeleteIcon from "@mui/icons-material/Delete";
const AdminCategory = () => {
  const dispatch = useDispatch();
  const [categoryData, setCategoryData] = useState([]);
  const categories = useSelector((stat) => stat.category.categories);
  useEffect(() => {
    getAllCategory(dispatch);
    setCategoryData(categories);
  }, [categories]);

  return (
    <div className="adminCategory">
      {" "}
      <AddCategory />
      <div className="categoryItems">
        {categoryData.map((item) => {
          return (
            <div
              className="remove"
              onClick={() => deleteCategory(item._id, dispatch)}
            >
              <div className="iconRemove">
                <DeleteIcon fontSize="large" />
              </div>
              <SelectCategoryItem item={item} onSelectCategory={null} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCategory;
