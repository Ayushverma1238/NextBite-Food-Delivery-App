import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";

const initialState = {
  fullName: "",
  phone: "",
  houseNo: "",
  street: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  label: "Home",
  isDefault: false,
  latitude: "",
  longitude: "",
};

const AddressModal = ({ isOpen, onClose, onSuccess, editAddress = null }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (editAddress) {
      setForm({
        fullName: editAddress.fullName,
        phone: editAddress.phone,
        houseNo: editAddress.houseNo,
        street: editAddress.street,
        landmark: editAddress.landmark,
        city: editAddress.city,
        state: editAddress.state,
        pincode: editAddress.pincode,
        label: editAddress.label,
        isDefault: editAddress.isDefault,
      });
    } else {
      setForm(initialState);
    }
  }, [editAddress]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setError("Could not fetch your current location.");
        setLocating(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editAddress) {
        await axiosInstance.patch(`/address/${editAddress._id}`, form);
      } else {
        await axiosInstance.post("/address", form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editAddress ? "Edit Address" : "Add New Address"}
          </h2>

          <button onClick={onClose}>
            <IoClose size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="houseNo"
              placeholder="House / Flat No"
              value={form.houseNo}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={form.landmark}
              onChange={handleChange}
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <select
              name="label"
              value={form.label}
              onChange={handleChange}
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 disabled:opacity-50"
              >
                <FiMapPin size={14} />
                {locating ? "Locating..." : "Use my current location"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
              />
              <Field
                label="Longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Default */}
          <div className="mt-5 flex items-center gap-3">
            <input
              id="default"
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />

            <label htmlFor="default">Make this my default address</label>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              {loading
                ? "Saving..."
                : editAddress
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
    />
  </div>
);

export default AddressModal;
