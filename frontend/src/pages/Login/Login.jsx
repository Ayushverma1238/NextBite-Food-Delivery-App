import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";

import axiosInstance from "../../api/axios";
import { loginSuccess } from "../../feature/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/user/login", formData);

      if (res.data.success) {
        dispatch(loginSuccess(res.data.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 via-white to-red-50 px-5 py-10">
      {/* Background Blur */}

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-300/30 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2"
      >
        {/* Left Section */}

        <div className="relative hidden overflow-hidden bg-linear-to-br from-orange-500 via-orange-600 to-red-500 p-10 text-white lg:flex lg:flex-col lg:justify-center">
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute right-8 top-10 rounded-full bg-white/20 p-6"
          >
            <UtensilsCrossed size={55} />
          </motion.div>

          <motion.h1
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold leading-tight"
          >
            Welcome Back!
          </motion.h1>

          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 max-w-md text-lg text-orange-100"
          >
            Sign in to continue ordering your favourite meals from hundreds of
            restaurants with lightning-fast delivery.
          </motion.p>

          <div className="mt-12 space-y-5">
            {[
              "🍕 Fresh Food Delivered",
              "⚡ Fast & Secure Checkout",
              "🎉 Exclusive Discounts",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.2 + 0.5,
                }}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-md"
              >
                <span className="text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Section */}

        <div className="p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-gray-800">Login</h2>

            <p className="mt-3 text-gray-500">Login to your NextBite account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {/* Email */}

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-14 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {/* Forgot Password */}

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-orange-500 transition hover:text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-red-500 py-3.5 font-semibold text-white shadow-lg transition hover:shadow-orange-300"
            >
              Login
              <ArrowRight size={20} />
            </motion.button>

            {/* Register */}

            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>

          {/* Mobile Welcome Card */}

          <div className="mt-10 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 p-6 text-white lg:hidden">
            <h3 className="text-2xl font-bold">Welcome to NextBite 🍔</h3>

            <p className="mt-3 text-orange-100">
              Discover delicious food from nearby restaurants and enjoy
              lightning-fast delivery right to your doorstep.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating Decorations */}

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute left-10 top-24 hidden rounded-full bg-white p-4 shadow-xl xl:block"
      >
        🍕
      </motion.div>

      <motion.div
        animate={{
          y: [0, 18, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        className="absolute bottom-24 right-16 hidden rounded-full bg-white p-4 shadow-xl xl:block"
      >
        🍔
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
        }}
        className="absolute right-1/4 top-16 hidden rounded-full bg-white p-4 shadow-xl xl:block"
      >
        🍟
      </motion.div>
    </div>
  );
};

export default Login;
