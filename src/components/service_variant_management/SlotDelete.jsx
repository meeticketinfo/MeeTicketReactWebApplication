import React from "react";
import { useSlotBookingStore } from "../../store/masters/slotBookingStore";
import { toast } from "react-toastify";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import useAuthStore from "../../store/authStore";

const SlotDelete = ({ deleteModal, setdeleteModal, deleteSlotId }) => {
  const { DeleteSlotDetails, DeleteSlotDetailsLoading } = useSlotBookingStore();
  const { roleDetails } = useAuthStore();
  const role = roleDetails?.name;
  const { fetchAllUnifiedFacilities } = useUnifiedFacilityStore();

  const handleDeleteSlot = async (slotId) => {
    try {
      const res = await DeleteSlotDetails(slotId);
      if (res.data.status === 200) {
        toast.success("Slot deleted successfully!");
       
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error(error.response?.data.title);
    } finally {
      setdeleteModal(false);
      fetchAllUnifiedFacilities(role);
    }
  };
  return (
    <>
      <PopupModal
        popupModalId="slot-delete-modal"
        isOpen={deleteModal}
        onClose={() => setdeleteModal(false)}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure you want to Delete the Record?
          </h1>

          <div className="flex justify-center gap-8 mt-4 z-30">
            <button
              onClick={async () => {
                await handleDeleteSlot(deleteSlotId);
              }}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
            >
              {DeleteSlotDetailsLoading ? (
                <span className="px-8">
                  <l-tailspin
                    size="15"
                    stroke="5"
                    speed="0.9"
                    color="white"
                  ></l-tailspin>
                </span>
              ) : (
                "Delete"
              )}
            </button>

            <button
              onClick={() => setdeleteModal(false)}
              className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </PopupModal>
    </>
  );
};

export default SlotDelete;
