import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import AdminLayout from "../layout/AdminLayout";

// Customer Pages
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Restaurants from "../pages/Restaurants/Restaurants";
import RestaurantDetails from "../pages/RestaurantDetails/RestaurantDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import Profile from "../pages/Profile/Profile";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Wishlist from "../pages/Wishlist/Wishlist";
import NotFound from "../pages/NotFound/NotFound";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users"; // If your file is User.jsx, change this to ../pages/Admin/User
import AdminRestaurants from "../pages/Admin/Restaurants";
import Categories from "../pages/Admin/Categories";
import AdminOrders from "../pages/Admin/Orders";
import Reports from "../pages/Admin/Reports";
import Analytics from "../pages/Admin/Analytics";
import RestaurantOwnerLayout from "../layout/RestaurantOwnerLayout";

import OwnerDashboard from "../pages/RestaurantOwner/Dashboard";
import Food from "../pages/RestaurantOwner/Food";
import OwnerOrders from "../pages/RestaurantOwner/Orders";
import OwnerAnalytics from "../pages/RestaurantOwner/Analytics";
import Setting from "../pages/RestaurantOwner/Setting";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import CategoryPage from "../pages/CategoryFood/CategoryFood";
import TrackOrder from "../pages/Orders/Tracking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "restaurants",
        element: <Restaurants />,
      },
      {
        path: "restaurant/:id",
        element: <RestaurantDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "/track-order/:order",
        element: <TrackOrder />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "category",
        element: <CategoryPage />,
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "restaurants",
            element: <AdminRestaurants />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
        ],
      },

      {
        path: "owner/",
        element: (
          <ProtectedRoute allowedRole="OWNER">
            <RestaurantOwnerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <OwnerDashboard />,
          },
          {
            path: "dashboard",
            element: <OwnerDashboard />,
          },
          {
            path: "food",
            element: <Food />,
          },
          {
            path: "orders",
            element: <OwnerOrders />,
          },
          {
            path: "analytics",
            element: <OwnerAnalytics />,
          },
          {
            path: "settings",
            element: <Setting />,
          },
        ],
      },

      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
