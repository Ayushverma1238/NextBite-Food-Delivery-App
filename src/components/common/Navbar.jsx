import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const { user, isLoggedIn, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
            Cart ({cartItems.length})
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              isActive ? "text-orange-500 font-bold" : "text-gray-700"
            }
          >
             Wishlist ({wishlist.length})
          </NavLink>
        </li>

        {isLoggedIn && user?.role === "admin" && (
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

        {isLoggedIn && user?.role === "owner" && (
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

        {isLoggedIn ? (
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
