import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";

import axiosInstance from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSuccess(true);

    try {
      const data = new FormData();

      data.append("name", name);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("avatar", avatar);

      const res = await axiosInstance.post("/user/register", data);

      if (res.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSuccess(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 via-white to-red-50 px-5 py-10">
      {/* Background */}

      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-300/30 blur-3xl"></div>

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2"
      >
        {/* Left */}

        <div className="relative hidden overflow-hidden bg-linear-to-br from-orange-500 via-orange-600 to-red-500 p-10 text-white lg:flex lg:flex-col lg:justify-center">
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
            className="absolute right-10 top-10 rounded-full bg-white/20 p-6"
          >
            <UtensilsCrossed size={55} />
          </motion.div>

          <motion.h1
            initial={{
              x: -40,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="text-5xl font-extrabold"
          >
            Join NextBite
          </motion.h1>

          <motion.p
            initial={{
              x: -40,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.4,
            }}
            className="mt-6 max-w-md text-lg text-orange-100"
          >
            Create your free account and enjoy delicious food from hundreds of
            restaurants with lightning-fast delivery.
          </motion.p>

          <div className="mt-12 space-y-5">
            {[
              "🍔 Order from 1000+ Restaurants",
              "⚡ Super Fast Delivery",
              "🎁 Daily Offers & Rewards",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.2 + 0.6,
                }}
                className="rounded-xl bg-white/10 p-4 backdrop-blur-md"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right */}

        <div className="p-8 sm:p-12">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.2,
            }}
          >
            <h2 className="text-4xl font-bold text-gray-800">
              Create Account
            </h2>

            <p className="mt-3 text-gray-500">
              Join NextBite today
            </p>
          </motion.div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >
            {/* Name */}

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* Avatar */}

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Profile Photo
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-dashed border-orange-300 p-4 transition hover:bg-orange-50">
                <div className="flex items-center gap-3">
                  <Upload className="text-orange-500" />

                  <span className="text-gray-600">
                    {avatar
                      ? avatar.name
                      : "Choose Profile Photo"}
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setAvatar(e.target.files[0])
                  }
                />
              </label>

              {avatar && (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Preview"
                  className="mt-4 h-24 w-24 rounded-full border-4 border-orange-400 object-cover shadow-lg"
                />
              )}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border border-gray-300 py-3 pl-12 pr-14 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSuccess}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-red-500 py-3.5 font-semibold text-white shadow-lg transition hover:shadow-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSuccess ? "Creating Account..." : "Create Account"}

              {!isSuccess && <ArrowRight size={20} />}
            </motion.button>

            {/* Login */}

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>

          {/* Mobile Welcome Card */}

          <div className="mt-10 rounded-2xl bg-linear-to-r from-orange-500 to-red-500 p-6 text-white lg:hidden">
            <h3 className="text-2xl font-bold">
              Welcome to NextBite 🍔
            </h3>

            <p className="mt-3 text-orange-100">
              Create your account today and enjoy delicious meals,
              lightning-fast delivery, exciting offers, and an amazing food
              ordering experience.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating Food Icons */}

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

      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
        }}
        className="absolute bottom-12 left-20 hidden rounded-full bg-white p-4 shadow-xl xl:block"
      >
        🌮
      </motion.div>
    </div>
  );
};

export default Register;