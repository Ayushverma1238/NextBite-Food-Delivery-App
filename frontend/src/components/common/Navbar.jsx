import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { WishlistContext } from "../../context/WishlistContext";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../api/axios";
import { loginSuccess, logoutSuccess } from "../../feature/auth/authSlice";
import { totalCartItem } from "../../feature/cart/cartSlice";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { wishlist } = useContext(WishlistContext);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalCart } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

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
  }, [dispatch]);

  const handleLogout = async() => {
    try {
      const res = await axiosInstance.post('/user/logout');
      dispatch(logoutSuccess());
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.log("Error during logout", error.message)
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-orange-500">
            <div> <img src="./LOGO_bg.png" alt="LOGO" /> NextBite</div>
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-7 font-medium lg:flex">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-orange-500"
                    : "text-gray-700 transition hover:text-orange-500"
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/restaurants"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-orange-500"
                    : "text-gray-700 transition hover:text-orange-500"
                }
              >
                Restaurants
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-orange-500"
                    : "text-gray-700 transition hover:text-orange-500"
                }
              >
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to={isAuthenticated ? "/cart" : "/login"}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-orange-500"
                    : "text-gray-700 transition hover:text-orange-500"
                }
              >
                Cart <sup>({totalCart})</sup>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-orange-500"
                    : "text-gray-700 transition hover:text-orange-500"
                }
              >
                Wishlist <sup>({wishlist.length})</sup>
              </NavLink>
            </li> */}

            {isAuthenticated && user?.role === "ADMIN" && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold text-orange-500"
                      : "text-gray-700 transition hover:text-orange-500"
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
                    isActive
                      ? "font-bold text-orange-500"
                      : "text-gray-700 transition hover:text-orange-500"
                  }
                >
                  Owner Dashboard
                </NavLink>
              </li>
            )}

            {isAuthenticated ? (
              <>
                <li className="font-semibold text-orange-500">
                  Hi, {user?.name}
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
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
                      isActive
                        ? "font-bold text-orange-500"
                        : "text-gray-700 transition hover:text-orange-500"
                    }
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold text-orange-500"
                        : "text-gray-700 transition hover:text-orange-500"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-72 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl font-bold text-orange-500">🍔 NextBite</h2>

          <button
            onClick={closeMenu}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={26} />
          </button>
        </div>

        {/* Links */}
        <div className="flex h-[calc(100%-84px)] flex-col justify-between">
          <ul className="space-y-2 p-5">
            <li>
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-orange-500 font-semibold text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/restaurants"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-orange-500 font-semibold text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                Restaurants
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/orders"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-orange-500 font-semibold text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/cart"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-orange-500 font-semibold text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                Cart ({totalCart})
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/wishlist"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 ${
                    isActive
                      ? "bg-orange-500 font-semibold text-white"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                Wishlist ({wishlist.length})
              </NavLink>
            </li>

            {isAuthenticated && user?.role === "ADMIN" && (
              <li>
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 ${
                      isActive
                        ? "bg-orange-500 font-semibold text-white"
                        : "hover:bg-gray-100"
                    }`
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
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 ${
                      isActive
                        ? "bg-orange-500 font-semibold text-white"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  Owner Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Bottom Section */}
          <div className="border-t p-5">
            {isAuthenticated ? (
              <>
                <p className="mb-4 font-semibold text-orange-500">
                  Hi, {user?.name}
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="block rounded-lg bg-orange-500 py-3 text-center font-semibold text-white"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="block rounded-lg border border-orange-500 py-3 text-center font-semibold text-orange-500"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
