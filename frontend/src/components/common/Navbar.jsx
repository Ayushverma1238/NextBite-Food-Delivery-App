import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axios";
import { loginSuccess, logoutSuccess } from "../../feature/auth/authSlice";
import { totalCartItem } from "../../feature/cart/cartSlice";
import { authLoading } from "../../feature/auth/authSlice";

function Navbar() {
  const { wishlist } = useContext(WishlistContext);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalCart } = useSelector((state) => state.cart);
  const { totalWishlistItem } = useSelector((state) => state.wishlist);


  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axiosInstance.get("/user", {
          withCredentials: true,
        });
        dispatch(loginSuccess(res.data.data));
        const cart = await axiosInstance.get("/cart", {
          withCredentials: true,
        });
        dispatch(totalCartItem(cart.data.data.items.length));
      } catch (error) {
        console.log("User not logged in", error.message);
      }
    };

    getCurrentUser();
  }, []);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white shadow-md px-8 py-4">
      <h1 className="text-3xl font-bold text-orange-500">🍔 NextBite</h1>

      <ul className="flex items-center gap-8 font-medium">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
            Restaurants
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
            Cart <sup> ({totalCart})</sup>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
            Wishlist <sup> ({wishlist.length})</sup>
          </NavLink>
        </li>

        {isAuthenticated && user?.role === "ADMIN" && (
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "text-orange-500 font-bold" : "text-gray-700"
              }
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}

        {isAuthenticated && user?.role === "OWNER" && (
          <li>
            <NavLink
              to="/owner/dashboard"
              className={({ isActive }) =>
                isActive ? "text-orange-500 font-bold" : "text-gray-700"
              }
            >
              Owner Dashboard
            </NavLink>
          </li>
        )}

        {isAuthenticated ? (
          <>
            <li className="font-semibold text-orange-500">Hi, {user?.name}</li>

            <li>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-bold" : "text-gray-700"
                }
              >
                Login
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-orange-500 font-bold" : "text-gray-700"
                }
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
