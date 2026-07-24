import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";

const Setting = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [restaurant, setRestaurant] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    openingTime: "",
    closingTime: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const getRestaurant = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/restaurant");

      const data = res.data.data;

      setRestaurant({
        name: data.name || "",
        description: data.description || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        latitude: data.location?.coordinates?.[1] || "",
        longitude: data.location?.coordinates?.[0] || "",
        openingTime: data.openingTime || "",
        closingTime: data.closingTime || "",
      });

      setPreview(data.image);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch restaurant");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  const handleChange = (e) => {
    setRestaurant((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      Object.keys(restaurant).forEach((key) => {
        formData.append(key, restaurant[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      const res = await axiosInstance.put(
        "/restaurant/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);

      getRestaurant();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="mb-8 text-center text-4xl font-bold">
          Restaurant Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="flex flex-col items-center">

            <img
              src={
                preview ||
                "https://placehold.co/200x200?text=Restaurant"
              }
              alt=""
              className="h-40 w-40 rounded-full border-4 border-orange-400 object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="mt-4"
            />

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label>Name</label>

              <input
                name="name"
                value={restaurant.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Phone</label>

              <input
                name="phone"
                value={restaurant.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Email</label>

              <input
                name="email"
                value={restaurant.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>City</label>

              <input
                name="city"
                value={restaurant.city}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>State</label>

              <input
                name="state"
                value={restaurant.state}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Pincode</label>

              <input
                name="pincode"
                value={restaurant.pincode}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Latitude</label>

              <input
                name="latitude"
                value={restaurant.latitude}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Longitude</label>

              <input
                name="longitude"
                value={restaurant.longitude}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Opening Time</label>

              <input
                type="time"
                name="openingTime"
                value={restaurant.openingTime}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label>Closing Time</label>

              <input
                type="time"
                name="closingTime"
                value={restaurant.closingTime}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

          </div>

          <div>

            <label>Description</label>

            <textarea
              rows={5}
              name="description"
              value={restaurant.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <label>Address</label>

            <textarea
              rows={3}
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border p-3"
            />

          </div>

          <button
            disabled={saving}
            className="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Restaurant"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Setting;