import { VillaRounded } from "@mui/icons-material";
import { publicRequest, userRequest } from "../axios.js";
import {
  getCategoryError,
  getCategoryStart,
  getCategorySuccuss,
  createCategoryError,
  createCategoryStart,
  createCategorySuccuss,
  removeStart,
  removeCategory,
  removeError,
} from "./categorySlice.js";
import {
  loginError,
  loginStart,
  loginSuccuss,
  updateError,
  updateStart,
  updateSuccuss,
} from "./userSlice";
import { format } from "date-fns";
import { notifyUser } from "../components/notifyuser/ToastMessage.jsx";

export const login = async (dispatch, user) => {
  try {
    dispatch(loginStart());
    const res = await publicRequest.post("/api/login", user);
    if (res.data && res.data.token) {
      // Store the token in localStorage
      localStorage.setItem('token', res.data.token);
    }
    //console.log(res.data);
    dispatch(loginSuccuss(res.data.info));
  } catch (error) {
    dispatch(loginError(error.response.data.message));
  }
};

export const register = async (formData) => {
  try {
    const res = await publicRequest.post("/api/register", formData);
    if (res && res.status === 200) {
      // notifyUser("succuss", "User Registred");
      console.log("User registred successfully");
    }
    else {
      // notifyUser("error", "Error registring user");
      console.log("Error registring user");
    }
  } catch (error) {
    console.error("Error  : ", error);
    notifyUser("error", error);
  }
}
export const update = async (dispatch, user, id) => {
  try {
    dispatch(updateStart());
    const res = await userRequest.put("api/user/update/" + id, user);
    //console.log(res.data);
    dispatch(
      updateSuccuss({
        user: res.data.user,
      })
    );
  } catch (error) {
    //console.log(error);

    dispatch(updateError(error.response.data.message));
  }
};
export const updateRole = async (dispatch, user, id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found in cookies");
    return null;
  }

  try {
    const res = await userRequest.put(`api/user/update/${id}`, 
      { ...user }, // data / request body
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
export const getAllCategory = async (dispatch) => {
  try {
    dispatch(getCategoryStart());
    const res = await publicRequest.get("/api/category");
    dispatch(getCategorySuccuss(res.data.data.categories));
    return res.data.data.categories;  // ✅ Return categories
  } catch (error) {
    //console.log(error);
    dispatch(getCategoryError(error.response.data.message));
    return []; // ✅ Return an empty array in case of error to avoid undefined issues

  }
};
export const fetchCategories = async () => {
  try {
    const res = await publicRequest.get("/api/category");
    return res.data.data.categories;
  } catch (error) {
    console.error(error);
  }
}
export const getProduct = async (id) => {
  try {
    const res = await publicRequest("/api/product/find/" + id);
    return res.data.data;
  } catch (error) {
    //console.log(error);
  }
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found in cookies");
    return null;
  }
  try {
    const res = await publicRequest.delete("/api/product/" + id, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    //console.log(error);
  }
};
export const getCategory = async (id) => {
  try {
    const res = await publicRequest.get("/api/category/" + id);

    return res.data.data;
  } catch (error) {
    //console.log(error);
  }
};
export const createCategory = async (category) => {
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.post("/api/category", category, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    return res?.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};
export const updateCategory = async (id, category) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.put(`/api/category/${id}`, category, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    return res?.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.delete("/api/category/" + id, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });

    return res?.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};
export const deleteSubCategory = async (categoryId, subCategoryId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.delete(`/api/subCategory/${categoryId}/${subCategoryId}`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });

    return res?.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};
export const fetchDataByCategory = async (id) => {
  try {
    const res = await publicRequest.get("/api/product?categoryId=" + id);

    return res.data.data.product;
  } catch (error) {
    //console.log(error);
  }
};
export const getSeller = async (id) => {
  try {
    const res = await publicRequest.get("/api/user/seller/" + id);
    return res.data.user.username;
  } catch (error) {
    //console.log(error);
  }
};
export const getSellerDetails = async (id) => {
  try {
    const res = await publicRequest.get("/api/user/seller/" + id);
    return res.data.user;
  } catch (error) {
    //console.log(error);
  }
};
export const createProduct = async (product) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found in cookies");
    return null;
  }
  try {
    await publicRequest.post("/api/product", product
      , {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      }
    );
    notifyUser("succuss", "Product created successfully");
    return true;
  } catch (error) {
    //console.log("Error creating product : ", error);
    notifyUser("error", "Error creating product");
  }
};
export const updateProduct = async (product, id) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    await userRequest.put("/api/product/" + id, product, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    //console.log("Error updating product : ", error);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await userRequest.get("/api/allUser");
    return res.data.data;
  } catch (error) {
    //console.log(error);
  }
};

export const getStatistic = async (type) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    const res = await userRequest.get(type === "user" ? "/api/user/statistic" : "/api/product/stat", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });

    return res.data.formattedData;
  } catch (error) {
    //console.log(error);
  }
};
// export const getProductsBySeller2 = async (sellerId) => {
//   try {
//     const res = await publicRequest.get(`/api/product/seller/${sellerId}`);
//     return res.data?.data || []; // Ensure it always returns an array
//   } catch (error) {
//     console.error(error);
//     return []; // Return an empty array on error
//   }
// };

export const switchMode = async (userId, mode) => {
  try {
    const res = await publicRequest.put(`/api/switch/${userId}`, { mode }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("Error switching mode:", error);
    alert("Failed to switch mode. Please try again.");
    return null; // Au lieu de `[]`, retourne `null` pour mieux gérer l'erreur
  }
};

export const getAllProducts = async () => {
  try {
    const res = await publicRequest.get("/api/product", {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data?.data.product;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const getFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.get("/api/product/favorites", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    return res.data?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getProductsBySeller = async () => {
  try {
    const token = localStorage.getItem("token");
    //console.log("Retrieved token:", token); // Debugging line

    if (!token) {
      console.error("No token found");
      return null;
    }

    const res = await publicRequest.get("/api/products/seller", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    //console.log("Fetched products by seller:", res.data);
    return res.data?.data;
  } catch (error) {
    console.error("Error fetching seller products:", error.response?.data || error.message);
    return null;
  }
};
// export const fetchProductsBySeller = async (id) => {
//   try {
//     const res = await publicRequest.get(`/api/ProductsBySeller/${id}`, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     //console.log("Fetched products by seller:", res.data);
//     return res.data?.data;
//   } catch (error) {
//     console.error("Error fetching seller products:", error.response?.data || error.message);
//     return null;
//   }
// };
export const removeFromFavorites = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.delete(`/api/product/favorites/${productId}`, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const addToFavorites = async (productId) => {
  try {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    const res = await publicRequest.post(`/api/product/favorites/${productId}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const fetchUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    const res = await publicRequest.get("/api/user", {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    //console.log("fetched user : ", res);
    return res.data.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export const updateUserInfos = async (data) => {
  console.log("data : ", data);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found ");
      return null;
    }
    const res = await publicRequest.put("/api/updateUser", data, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    });
    //console.log("fetched user : ", res);
    notifyUser("succuss", "User updated successfully");
    return res;
  } catch (error) {
    console.error(error);
    notifyUser("error", "Error updating user");
    return null;
  }
}
export const filterdProducts = async (categoryId = "", subCategoryId = "", villes = [], minPrice = "1", maxPrice = "10000", searchQuery = "", withPrice, withImage, withPro) => {
  console.log("Query Params: ", {
    categoryId,
    subCategoryId,
    villes,
    minPrice,
    maxPrice,
    searchQuery,
    withPrice,
    withImage,
    withPro
  });

  try {
    const villeParams = villes.length > 0
      ? villes.map(v => `ville=${encodeURIComponent(v)}`).join("&")
      : "";


    const queryParams = [
      categoryId ? `categoryId=${encodeURIComponent(categoryId)}` : "",
      subCategoryId ? `subCategoryId=${encodeURIComponent(subCategoryId)}` : "",
      searchQuery ? `searchQuery=${encodeURIComponent(searchQuery)}` : "",
      villeParams,
      `minPrice=${encodeURIComponent(minPrice)}`,
      `maxPrice=${encodeURIComponent(maxPrice)}`,
      withPrice ? `withPrice=${withPrice}` : "",
      withImage ? `withImage=${withImage}` : "",
      withPro ? `withPro=${withPro}` : ""
    ].filter(Boolean).join("&");


    const res = await publicRequest.get(`api/products?${queryParams}`, {
      headers: { 'Content-Type': 'application/json' },
    });


    return res?.data;
  } catch (error) {
    console.error("error : ", error);
  }
};


export const getProductsOfSeller = async (sellerId) => {
  try {
    const res = await publicRequest.get(`/api/product/seller/${sellerId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    //console.log("Fetched products for this seller : ", res?.data);
    return res?.data.data;
  } catch (error) {
    console.error("Error : ", error);
  }
}

export const getSubCategory = async (categoryId) => {
  try {
    const res = await publicRequest.get(`/api/subCategory/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res?.data.data;
  } catch (error) {
    console.error("Error : ", error);
  }
}
export const getSubCategoriesByCategory = (categoryId) => {
  try {
    const res = publicRequest.get(`/api/category/sub/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.error("Error : ", error);
  }
}

export const changeActivity = (productId, status) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    const res = publicRequest.put(`/api/products/changeActivity`, { productId, status }, {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`, // Add the token here
      },
    })
    return res;
  } catch (error) {
    console.error("Error updating status of product : ", error);
  }
}

export const fetchShops = async (categoryName, sortBy, searchQuery) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    const queryParams = [
      categoryName ? categoryName : "",
      sortBy ? sortBy : "",
      searchQuery ? searchQuery : "",
    ];
    console.log("Query Params: ", queryParams);
    const res = await publicRequest.get(`api/shops?categoryName=${categoryName}&sortBy=${sortBy}&searchQuery=${searchQuery}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res;
  } catch (error) {
    console.error("Error updating status of product : ", error);
  }
}
export const sendVerificationCode = async (phoneNumber) => {
  console.log("phone number : ", phoneNumber)
  try {
    // Sending phone number to the backend for verification
    const res = await publicRequest.post(
      `/api/sendWhatsappMessage`,
      { phoneNumber },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error sending verification code: ", error);
    notifyUser("error", error);
  }
};

export const verifyNumberPhone = async (phoneNumber, verificationCode) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found ");
    return null;
  }
  try {
    // Sending phone number and verification code to the backend for verification
    const res = await publicRequest.post(
      `/api/verifyNumberPhone`,
      { phoneNumber, verificationCode },
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`, // Add the token here
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error verifying phone number: ", error);
  }
};
export const verifyPhoneNumber = async (phoneNumber, verificationCode) => {
  try {
    const res = await publicRequest.post("/api/verifyPhoneNumber", { phoneNumber, verificationCode },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res;
  } catch (error) {
    console.error("Error verifying and registering user:", error);
    notifyUser("error", error.message);
  }
};

export const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found");
    return null;
  }
  try {
    // Sending phone number and verification code to the backend for verification
    const res = await publicRequest.put(
      `/api/updatePassword`,
      { oldPassword, newPassword, confirmPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      }
    );
    notifyUser("succuss", "Password updated successfully");
    return res;
  } catch (error) {
    console.error("Error verifying phone number: ", error);
    notifyUser("error", "Error updating password");
  }
}

export const checkPhoneNumberExists = async (phoneNumber) => {
  try {
    const res = await publicRequest.post(`/api/checkPhoneNumberExists`, { phoneNumber }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    console.error("Error checking phone number existence: ", error);
  }
}



export const loginWithPhone = async (dispatch, phoneNumber, verificationCode) => {
  try {
    dispatch(loginStart());
    const res = await publicRequest.post(`/api/loginWithPhone`, { phoneNumber, verificationCode }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res && res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("name", res.data.user.username);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("isAdmin", res.data.user.isAdmin);
    }
    dispatch(loginSuccuss(res.data.user));
    return res;
  } catch (error) {
    console.error("Error checking phone number existence: ", error);
  }
}
