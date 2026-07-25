import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import FoodModal from "./FoodModal";

import { FaEdit, FaTrash, FaPlus, FaSearch, FaLeaf } from "react-icons/fa";
import {toast} from 'react-toastify'
import { GiMeat } from "react-icons/gi";
import { MdRestaurantMenu } from "react-icons/md";

const Food = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Modal State

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  // ===========================
  // Get Foods
  // ===========================

  const getFoods = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/food/owner");
      
      setFoods(res?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFoods();
  }, []);

  // ===========================
  // Add Food
  // ===========================

  const addFood = async (formData) => {
    try {
      setBtnLoading(true);

      await axiosInstance.post("/food", formData);
      toast.success("Food added successfully")
      setIsModalOpen(false);
      
      getFoods();
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  // ===========================
  // Update Food
  // ===========================

  const updateFood = async (formData) => {
    try {
      setBtnLoading(true);

      await axiosInstance.patch(`/food/${selectedFood._id}/update`, formData);

      setIsModalOpen(false);
      setSelectedFood(null);

      getFoods();
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  // ===========================
  // Delete Food
  // ===========================

  const deleteFood = async (foodId) => {
    const confirmDelete = window.confirm("Delete this food item?");

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/food/delete-food/${foodId}`);

      getFoods();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Change Availability
  // ===========================

  const changeAvailability = async (foodId) => {
    try {
      await axiosInstance.patch(`/food/${foodId}/available`);

      getFoods();
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // Open Add Modal
  // ===========================

  const openAddModal = () => {
    setSelectedFood(null);
    setIsModalOpen(true);
  };

  // ===========================
  // Open Edit Modal
  // ===========================

  const openEditModal = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  // ===========================
  // Close Modal
  // ===========================

  const closeModal = () => {
    setSelectedFood(null);
    setIsModalOpen(false);
  };

  // ===========================
  // Categories
  // ===========================

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(foods.map((item) => item.category).filter(Boolean)),
    ];
  }, [foods]);

  // ===========================
  // Filtered Foods
  // ===========================

  const filteredFoods = foods.filter((food) => {
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory = category === "All" || food.category === category;

    return matchSearch && matchCategory;
  });

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-6">
        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Manage Food</h1>

            <p className="mt-2 text-gray-500">Manage your restaurant menu</p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600"
          >
            <FaPlus />
            Add Food
          </button>
        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Foods</p>

                <h2 className="mt-2 text-3xl font-bold">{foods.length}</h2>
              </div>

              <MdRestaurantMenu size={42} className="text-orange-500" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">Categories</p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {categories.length - 1}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-gray-500">Available Foods</p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {foods.filter((i) => i.isAvailable).length}
            </h2>
          </div>
        </div>

        {/* Search */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full rounded-xl border bg-white py-3 pl-12 pr-4 outline-none focus:border-orange-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border bg-white px-5"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl bg-white p-5 shadow"
              >
                <div className="h-56 rounded-xl bg-gray-200"></div>

                <div className="mt-5 h-6 rounded bg-gray-200"></div>

                <div className="mt-3 h-4 rounded bg-gray-200"></div>

                <div className="mt-6 h-10 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-60 w-full object-cover"
                  />

                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      {food.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                        food.veg ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {food.veg ? (
                        <div className="flex items-center gap-1">
                          <FaLeaf />
                          Veg
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <GiMeat />
                          Non Veg
                        </div>
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => changeAvailability(food._id)}
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white transition ${
                      food.isAvailable
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">
                      {food.name}
                    </h2>

                    <span className="text-2xl font-bold text-orange-500">
                      ₹{food.price}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-gray-500">
                    {food.description}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => openEditModal(food)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteFood(food._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredFoods.length === 0 && (
          <div className="mt-20 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              className="mx-auto h-40"
              alt="No Food"
            />

            <h2 className="mt-6 text-2xl font-bold">No Food Found</h2>

            <p className="mt-2 text-gray-500">Add your first menu item.</p>

            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              <FaPlus />
              Add Food
            </button>
          </div>
        )}
      </div>

      {/* Food Modal */}

      <FoodModal
        isOpen={isModalOpen}
        onClose={closeModal}
        loading={btnLoading}
        initialData={selectedFood}
        onSubmit={selectedFood ? updateFood : addFood}
      />
    </>
  );
};

export default Food;
