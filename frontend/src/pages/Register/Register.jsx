import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../../api/axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(true)
    try {
      const data = new FormData();
      console.log(avatar);
      data.append("name", name);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("avatar", avatar);

      const res = await axiosInstance.post("/user/register", data);
      if (res.data.success) {
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setPhone("");

        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registation user");
    } finally{
      setIsSuccess(false)
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center py-10 mx-auto justify-center px-6">
      <div className="w-full max-w-md py-10 bg-white ring-1 ring-gray-300 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <p className="text-center text-gray-500 mb-8">Join NextBite today</p>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Contact</label>

            <input
              type="text"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your contact"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Profile Photo
            </label>

            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:bg-orange-500 file:text-white
               file:font-medium file:cursor-pointer
               hover:file:bg-orange-600
               focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition"
          >
            {isSuccess ? "Registering...":"Register"} 
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
