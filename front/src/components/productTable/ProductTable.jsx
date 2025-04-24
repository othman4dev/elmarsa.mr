import { useEffect, useState } from "react";
import { changeActivity, fetchCategories, getAllCategory, updateProduct } from "../../redux/apiCalls";
import "./ProductTable.scss";
import List from "../list/List";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import { Box, Typography } from "@mui/material";
import { publicRequest } from "../../axios";
import { useNavigate } from "react-router-dom";
import EditModal from "../EditModal/EditModal.jsx";
import { useDispatch } from "react-redux";
import { EditOff } from "@mui/icons-material";

const ProductTable = () => {
  const navigate = useNavigate();
  const [product, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return console.error("No token found");
      try {
        const res = await publicRequest.get("/api/productList", {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });
        setProducts(res.data.data);
        const fetchedCategories = await fetchCategories();
        console.log("Fetched categories : ", fetchedCategories);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, [selectedProduct, category, subCategory, categories]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return console.error("No token found");
    try {
      await publicRequest.delete(`/api/product/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const changeStatus = async (productId, status) => {
    try {
      setLoading(true);
      await changeActivity(productId, status);
      setProducts((prev) => prev.map((p) => p._id === productId ? { ...p, status } : p));
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };
  const openEditModal = async (id) => {
    console.log("Id : ", id);
    const selected = product.find((p) => p._id === id);
    console.log("selected : ", selected);

    if (selected) {
      setSelectedProduct(selected);
      setEditModal(true);
      console.log("Render check - EditModal:", editModal, selectedProduct);

      if (categories.length > 0) {
        const fetchedCategory = categories.find(cat => cat._id === selected.categoryId);
        console.log("Fetched category :", fetchedCategory);
        
        const fetchedSubCategory = fetchedCategory?.subCategories.find(sub => sub._id === selected.subCategoryId);
        console.log("Fetched Sub category :", fetchedSubCategory);
        
        setCategory(fetchedCategory || "");
        setSubCategory(fetchedSubCategory || "");
    }
    

    }
  };



  const closeEditModal = () => {
    setEditModal(false);
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 100, renderCell: (params) => <Typography fontWeight="bold">{params.row.title}</Typography> },
    { field: "price", headerName: "Price", width: 100, renderCell: (params) => <span>{params.value} DH</span> },
    { field: "image", headerName: "Image", width: 100, renderCell: (params) => <img src={params.value} alt="" className="productListImg" /> },
    { field: "isPremium", headerName: "IsPremium", width: 100 },
    { field: "contact", headerName: "Contact", width: 100 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "update", headerName: "Update", width: 100,
      renderCell: (params) => <button className="updateBtn" onClick={() => openEditModal(params.row.id)}>Update</button>
    },
    {
      field: "actions", headerName: "Actions", width: 100,
      renderCell: (params) => (
        <DeleteIcon className="deleteIcon" onClick={() => window.confirm("Are you sure?") && handleDelete(params.row.id)} />
      )
    },
    {
      field: "status", headerName: "Status", width: 150,
      renderCell: (params) => (
        <select value={params.row.status} onChange={(e) => changeStatus(params.row.id, e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      )
    },
  ];

  const productRows = product?.map((p) => ({
    id: p._id,
    title: p.title,
    price: p.price,
    isPremium: p.isPremium,
    image: p.images?.[0] || "", // Ensure safety when accessing images array
    contact: p.contact,
    status: p.status,
    createdAt: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
  }));

  return (
    <div className="productTable">
      <div className="productStat">
        <div className="productCardStat"><span>Total Products:</span><p>{product.length}</p></div>
        <div className="productCardStat"><span>Active:</span><p>{product.filter(p => p.status === "active").length}</p></div>
        <div className="productCardStat"><span>Inactive:</span><p>{product.filter(p => p.status === "inactive").length}</p></div>
      </div>
      <List rows={productRows} column={columns} />
      {editModal && (
        <EditModal product={selectedProduct}
          id={selectedProduct?._id}
          closeEditModal={closeEditModal}
          category={category}
          subCategory={subCategory}
          link={false}
        />
      )}
    </div>
  );
};

export default ProductTable;
