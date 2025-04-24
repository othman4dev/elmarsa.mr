import { useState } from "react";
import Button from "../button/Button";
import "./AddCategory.scss";
import CategoryIcon from "@mui/icons-material/Category";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import app from "../../firebase.js";
import { notifyUser } from "../notifyuser/ToastMessage";
import { createCategory } from "../../redux/apiCalls.js";
const AddCategory = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [image,setImage]=useState(null);
  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const storage = getStorage(app);
  const handleImgChange = (e) => {
    const files = e.target.files;
    setFile(files[0]);
  };

 
  const handleUpload = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'clicon');
    data.append('cloud_name', 'di96wpw7b');

    try {
        setLoading(true);
        const response = await fetch('https://api.cloudinary.com/v1_1/di96wpw7b/image/upload', {
            method: 'POST',
            body: data,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const uploadedImageURL = await response.json();
        setImage(uploadedImageURL.url);
        return uploadedImageURL.url; // Retourne l'URL
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    } finally {
        setLoading(false);
    }
};


const handleCreate = async (e) => {
  e.preventDefault();

  if (!file) {
    notifyUser("error", "No file selected");
    return;
  }

  try {
      const icon = await handleUpload(file); // Upload image and get URL
      if (!icon) throw new Error("Image upload failed");

      await createCategory({ icon, name }, dispatch);
      notifyUser("succuss", "Category has been added successfully");

      setFile(null);
      setName("");
  } catch (error) {
      console.error("Error:", error);
      notifyUser("error", "Category has not been added");
  }
};


  return (
    <div className="addCategory">
      <form>
        <label htmlFor="img">
          <div>
            {file ? (
              <img src={URL.createObjectURL(file)} />
            ) : (
              <CategoryIcon fontSize="large" />
            )}
          </div>
        </label>
        <input type="file" id="img" onChange={handleImgChange} />
        <input
          type="text"
          placeholder="Category name"
          onChange={(e) => setName(e.target.value)}
        />
        <Button label={"Add"} onClick={handleCreate} />
      </form>
    </div>
  );
};

export default AddCategory;
