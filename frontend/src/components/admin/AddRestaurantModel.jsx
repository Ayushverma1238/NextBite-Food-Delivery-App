import { useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../../api/axios";
import { FiX, FiUpload, FiMapPin, FiSearch, FiCheck } from "react-icons/fi";

const initialForm = {
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
};

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onCreated: (restaurant) => void  -> called with the newly created restaurant
 */
const AddRestaurantModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [owner, setOwner] = useState(null); // { _id, fullName, email }
  const [ownerQuery, setOwnerQuery] = useState("");
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [loadingOwners, setLoadingOwners] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const ownerBoxRef = useRef(null);

  // Reset everything whenever the modal is (re)opened
  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setOwner(null);
      setOwnerQuery("");
      setImageFile(null);
      setImagePreview(null);
      setError("");
    }
  }, [open]);

  // Fetch users once, filter client-side as the admin types
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        setLoadingOwners(true);
        const res = await axiosInstance.get("/admin/users");
        const users = res.data?.data?.users || res.data?.data || [];
        setOwnerOptions(users);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingOwners(false);
      }
    };

    fetchUsers();
  }, [open]);

  // Close owner dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ownerBoxRef.current && !ownerBoxRef.current.contains(e.target)) {
        setOwnerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOwners = useMemo(() => {
    if (!ownerQuery.trim()) return ownerOptions.slice(0, 8);

    const q = ownerQuery.toLowerCase();
    return ownerOptions
      .filter((u) =>
        `${u.fullName || ""} ${u.email || ""}`.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [ownerOptions, ownerQuery]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectOwner = (user) => {
    setOwner(user);
    setOwnerQuery(`${user.name} (${user.email})`);
    setOwnerDropdownOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
      }
    );
  };

  const validate = () => {
    if (!owner) return "Please select a restaurant owner.";
    if (!form.name.trim()) return "Restaurant name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state.trim()) return "State is required.";
    if (!form.pincode.trim()) return "Pincode is required.";
    if (form.latitude === "" || form.longitude === "")
      return "Latitude and longitude are required.";
    if (!imageFile) return "Restaurant image is required.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      console.log("Owner selected", owner)

      const payload = new FormData();
      payload.append("ownerId", owner._id);
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      payload.append("image", imageFile);

      const res = await axiosInstance.post(
        "/admin/create-restaurant",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onCreated?.(res.data?.data);
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating the restaurant."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Add Restaurant</h2>
            <p className="text-sm text-gray-500">
              Onboard a new restaurant and assign it to an owner.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Owner search */}
          <div ref={ownerBoxRef} className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Restaurant owner
            </label>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={ownerQuery}
                onChange={(e) => {
                  setOwnerQuery(e.target.value);
                  setOwner(null);
                  setOwnerDropdownOpen(true);
                }}
                onFocus={() => setOwnerDropdownOpen(true)}
                placeholder="Search user by name or email..."
                className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-orange-500"
              />
              {owner && (
                <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>

            {ownerDropdownOpen && (
              <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                {loadingOwners && (
                  <p className="px-4 py-3 text-sm text-gray-500">Loading users...</p>
                )}

                {!loadingOwners && filteredOwners.length === 0 && (
                  <p className="px-4 py-3 text-sm text-gray-500">No users found.</p>
                )}

                {!loadingOwners &&
                  filteredOwners.map((u) => (
                    <button
                      type="button"
                      key={u._id}
                      onClick={() => handleSelectOwner(u)}
                      className="flex w-full flex-col items-start px-4 py-2 text-left transition hover:bg-orange-50"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        {u.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {u.email} &middot; {u.role}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Restaurant image
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-4 transition hover:border-orange-400">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  <FiUpload size={22} />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700">
                  {imageFile ? imageFile.name : "Click to upload an image"}
                </p>
                <p className="text-xs text-gray-500">PNG or JPG, up to a few MB</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Basic details */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Restaurant name" name="name" value={form.name} onChange={handleChange} />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="A short description of the restaurant..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <Field label="Address" name="address" value={form.address} onChange={handleChange} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="City" name="city" value={form.city} onChange={handleChange} />
            <Field label="State" name="state" value={form.state} onChange={handleChange} />
          </div>

          {/* Location */}
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
              <Field label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} />
              <Field label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
    />
  </div>
);

export default AddRestaurantModal;