import { FaCheckCircle, FaEdit, FaMapMarkerAlt, FaPhoneAlt, FaTrash } from "react-icons/fa";

const AddressCard = ({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      onClick={() => onSelect(address)}
      className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-lg ${
        selected
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 bg-white hover:border-green-300"
      }`}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <span className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
          Default
        </span>
      )}

      {/* Selected Tick */}
      {selected && (
        <FaCheckCircle className="absolute bottom-4 right-4 text-2xl text-green-600" />
      )}

      {/* Name & Phone */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {address.fullName}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
          <FaPhoneAlt className="text-green-600" />
          <span>{address.phone}</span>
        </div>
      </div>

      {/* Label */}
      <div className="mb-3 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
        {address.label}
      </div>

      {/* Address */}
      <div className="flex gap-3">
        <FaMapMarkerAlt className="mt-1 text-lg text-red-500" />

        <div className="text-sm leading-6 text-gray-700">
          <p>
            {address.houseNo}, {address.street}
          </p>

          {address.landmark && <p>{address.landmark}</p>}

          <p>
            {address.city}, {address.state}
          </p>

          <p>{address.pincode}</p>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="mt-6 flex gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(address)}
          className="flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-blue-600 transition hover:bg-blue-500 hover:text-white"
        >
          <FaEdit />
          Edit
        </button>

        {!address.isDefault && (
          <button
            onClick={() => onDelete(address._id)}
            className="flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 transition hover:bg-red-500 hover:text-white"
          >
            <FaTrash />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;