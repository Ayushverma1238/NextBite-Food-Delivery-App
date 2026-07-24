import { useState } from "react";
import axiosInstance from "../../api/axios";
import AddressCard from "./AddressCard";
import AddressModal from "./AddressModal";

const AddressList = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  refreshAddresses,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  // -------------------------
  // Delete Address
  // -------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      setLoadingId(id);

      await axiosInstance.delete(`/address/${id}`);

      if (selectedAddress?._id === id) {
        setSelectedAddress(null);
      }

      refreshAddresses();
    } catch (error) {
      console.log(error);
      alert("Unable to delete address.");
    } finally {
      setLoadingId(null);
    }
  };

  // -------------------------
  // Make Default Address
  // -------------------------
  const handleSelect = async (address) => {
    try {
      setSelectedAddress(address);

      if (!address.isDefault) {
        await axiosInstance.patch(`/address/${address._id}`, {
          isDefault: true,
        });

        refreshAddresses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Delivery Address
        </h2>

        <button
          onClick={() => {
            setEditAddress(null);
            setShowModal(true);
          }}
          className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
        >
          + Add Address
        </button>
      </div>

      {/* No Address */}

      {addresses.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center">
          <h3 className="text-lg font-semibold">
            No Address Found
          </h3>

          <p className="mt-2 text-gray-500">
            Please add a delivery address.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="mt-5 rounded-lg bg-green-600 px-6 py-3 text-white"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={selectedAddress?._id === address._id}
              onSelect={handleSelect}
              onEdit={(address) => {
                setEditAddress(address);
                setShowModal(true);
              }}
              onDelete={handleDelete}
              loading={loadingId === address._id}
            />
          ))}
        </div>
      )}

      {/* Modal */}

      <AddressModal
        isOpen={showModal}
        editAddress={editAddress}
        onClose={() => {
          setShowModal(false);
          setEditAddress(null);
        }}
        onSuccess={() => {
          refreshAddresses();
          setShowModal(false);
          setEditAddress(null);
        }}
      />
    </>
  );
};

export default AddressList;