import NavBar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import "./App.scss";
import LoginAndRegister from "./pages/loginAndRegister/LoginAndRegister";
import ProductPage from "./pages/productPage/ProductPage";
import About from "./pages/about/About";
import CustomerSupport from "./pages/custemerSupport/CustomerSupport";
import BlogList from "./pages/blogList/BlogList";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublishProduct from "./pages/publishProduct/PublishProduct";
import ErrorPage from "./pages/errorPage/ErrorPage";
import MyProduct from "./pages/myProduct/MyProduct";
import Settings from "./pages/setting/Settings";
import BoosterPage from "./pages/boosterPage/BoosterPage";
import Category from "./pages/category/Category";
import MyFav from "./pages/myFav/MyFav";
import Dashboard from "./pages/dashboard/Dashboard";
import { useEffect } from "react";
import { getAllCategory } from "./redux/apiCalls";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import ViewProduct from "./components/ProductDetails/ViewProduct";
import SellerProfile from "./components/sellerProfile/SellerProfile";
import EmptyProduct from "./components/emptyProduct/EmptyProduct";
import ProductsByCategory from "./components/ProductsByCategory/ProductsByCategory";
import FilteredProducts from "./components/FilteredProducts/FilteredProducts";
import Shops from "./pages/shops/Shops";
import PhoneVerification from "./pages/PhoneVerification/PhoneVerification";
import { Profile } from "./pages/Profile/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
function App() {
  const dispatch = useDispatch();

  const userFromRedux = useSelector((state) => state.user.currentUser);
  const storedUser = localStorage.getItem("token");
  const user = userFromRedux || storedUser;
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  useEffect(() => {
    getAllCategory(dispatch);
  }, []);
  const Layout = () => {
    return (
      <div style={{ overflowX: "hidden" }}>
        <NavBar />
        <Outlet />
        <Footer />
        <ToastContainer />
      </div>
    );
  };
  const AuthRedirect = ({ children }) => {
    if (user) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  };
  const ProtectedRoute = ({ children }) => {
    // Get user from Redux state
    const user = useSelector((state) => state.user.currentUser);

    // Check if the user is logged in either through Redux state or localStorage token
    const token = localStorage.getItem("token");

    // If there's a user or a valid token in localStorage, allow access
    if (user || token) {
      return children;
    }

    // Otherwise, redirect to the login page
    return <Navigate to="/auth" />;
  };
  const AdminRedirect = ({ children }) => {
    return user && (user.isAdmin || isAdmin === "true") ? children : <Navigate to="/" />;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/productPage/:id",
          element: <ProductPage />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/customer",
          element: <CustomerSupport />,
        },
        {
          path: "/blogList",
          element: <BlogList />,
        },

        {
          path: "/category",
          element: <Category />,
        },
        {
          path: "/category/:id",
          element: <Category />,
        },
        {
          path: "/category/search/:search",
          element: <Category />,
        },
        {
          path: "/dashBoard",
          element: (
            <AdminRedirect>
              <Dashboard />
            </AdminRedirect>
          ),
        },
        {
          path: "*",
          element: <ErrorPage />,
        },
        {
          path: "/myProduct",
          element: (
            <ProtectedRoute>
              <EmptyProduct />
            </ProtectedRoute>
          ),
        },
        {
          path: "/myFavorite",
          element: (
            <ProtectedRoute>
              <MyFav />
            </ProtectedRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/booster/:id",
          element: (
            <ProtectedRoute>
              <BoosterPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/setting",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        {
          path: "/publishProduct",
          element: (
            <ProtectedRoute>
              <PublishProduct />
            </ProtectedRoute>
          ),
        },
        {
          path: "/publishProduct/:id",
          element: (
            <ProtectedRoute>
              <PublishProduct mode={"edit"} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/auth",
          element: (
            <AuthRedirect>
              <LoginAndRegister />
            </AuthRedirect>
          ),
        },
        {
          path: "/productDetails/:id",
          element: <ProductDetails />,
        },
        {
          path: "/viewProduct/:id",
          element: <ViewProduct />,
        },
        {
          path: "/sellerProfile/:id",
          element: <SellerProfile />,
        },
        {
          path: "/products/:categoryId",
          element: <ProductsByCategory />,
        },
        {
          path: "/products",
          element: <FilteredProducts />,
        },
        {
          path: "/shops",
          element: <Shops />,
        },
        {
          path: "/phone-verification",
          element: <PhoneVerification />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
