import { useEffect } from "react";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import NestedTable from "../tables/nestedTable/nestedTable";
import PopupModal from "../utils/popup_modal/PopupModal";
import { useModalStore } from "../../store/modalStore";
import FacilityCreate from "./facilityCreate";
import ServiceCreate from "../service_management/serviceCreate";
import ServiceVarientCreate from "../service_variant_management/serviceVarientCreate";
import { ToastContainer } from "react-toastify";
import useAuthStore from "../../store/authStore";

const UnifiedFacilityList = ({ setIsServiceEditVisible }) => {
  const { sidebarMenuItems, roleDetails, logout, decodedokenData } =
    useAuthStore();
  const role = roleDetails?.name;  
  const { allUnifiedFacilities, fetchAllUnifiedFacilities } =
    useUnifiedFacilityStore();

  useEffect(() => {
    fetchAllUnifiedFacilities(role);
  }, []);
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  
  const handleDataAdded = () => {
    fetchAllUnifiedFacilities(role);
    closeModal(); // Optionally close the modal after success
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
        <NestedTable
          data={allUnifiedFacilities}
          setIsServiceEditVisible={setIsServiceEditVisible}
        />
      </div>
      
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "facility-modal"}
        onClose={closeModal}
        title={"Edit Facility"}
        size="medium"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <FacilityCreate onDataAdded={handleDataAdded} />
        </div>
      </PopupModal>
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "sub-facility-modal"}
        onClose={closeModal}
        title={"Edit Sub-Facility"}
        size="medium"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <ServiceCreate onDataAdded={handleDataAdded} />
        </div>
      </PopupModal>
      <PopupModal
        popupModalId="first-modal"
        isOpen={openModalId === "type-of-ticket-modal"}
        onClose={closeModal}
        title={"Edit Type of Ticket"}
        size="medium"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div>
          <ServiceVarientCreate onDataAdded={handleDataAdded} />
        </div>
      </PopupModal>
    </>
  );
};

export default UnifiedFacilityList;
