import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { IoClose } from "react-icons/io5";

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
};

const AddressModal = ({
  isOpen,
  onClose,
  onSuccess,
  editAddress = null,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editAddress) {
      setFormData({
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
      setFormData(initialState);
    }
  }, [editAddress]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editAddress) {
        await axiosInstance.patch(
          `/address/${editAddress._id}`,
          formData
        );
      } else {
        await axiosInstance.post("/address", formData);
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
              value={formData.fullName}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="houseNo"
              placeholder="House / Flat No"
              value={formData.houseNo}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            />

            <select
              name="label"
              value={formData.label}
              onChange={handleChange}
              className="rounded-lg border p-3 outline-none focus:border-green-500"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>

          </div>

          {/* Default */}
          <div className="mt-5 flex items-center gap-3">
            <input
              id="default"
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />

            <label htmlFor="default">
              Make this my default address
            </label>
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

export default AddressModal;