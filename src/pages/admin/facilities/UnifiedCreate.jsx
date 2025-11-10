import { useState } from "react";
import FacilityCreate from "../../../components/facilities_management/facilityCreate";
import FacilityList from "../../../components/facilities_management/facilityList";
import AdminLayout from "../../../layouts/AdminLayout";
import BackButton from "../../../components/BackButton";
import ServiceUnifiedCreator from "../../../components/facilities_management/ServiceUnifiedCreator";
import UnifiedFacilityList from "../../../components/facilities_management/UnifiedFacilityList";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import ServiceCreate from "../../../components/service_management/serviceCreate";
import ServiceVarientCreate from "../../../components/service_variant_management/serviceVarientCreate";
import { useModalStore } from "../../../store/modalStore";
import { useUnifiedFacilityStore } from "../../../store/masters/unifiedFacilityStore";
import WalkersParkPassCreate from "../../../components/service_variant_management/WalkersParkPassCreate";
import { WalkersPassStore } from "../../../store/masters/WalkersPassStore";
import { useSlotBookingStore } from "../../../store/masters/slotBookingStore";
import SlotCreate from "../../../components/service_variant_management/SlotCreate";

export default function UnifiedCreate() {
  // State to toggle the FacilityCreate component
  const [isFacilityCreateVisible, setIsFacilityCreateVisible] = useState(false);
  const [isFacilityEditVisible, setIsFacilityEditVisible] = useState(false);

  const { setIsCreateServiceEnabled, setIsCreateServiceVariantEnabled } =
    useUnifiedFacilityStore();

  // Function to toggle the visibility of FacilityCreate
  const toggleFacilityCreate = () => {
    setIsFacilityCreateVisible((prev) => !prev);
    setIsFacilityEditVisible(false);
  };

  const { openModalId, setOpenModalId, closeModal } = useModalStore();

  const {
    setIsWalkersPassAdd,
    isWalkersPassAdd,
    isWalkersPassEdit,
    setIsWalkersPassEdit,
    setCurrentWalkersPassEditDetails,
  } = WalkersPassStore();

  // store import for slot

  const {
    setSlotEditDetails,
    isSlotEdit,
    setIsSlotEdit,
    isSlotAdd,
    setIsSlotAdd,
  } = useSlotBookingStore();

  const addServiceCreate = () => {
    setIsCreateServiceEnabled(true);
    setOpenModalId("add-sub-facility-modal");
  };

  const addServicevariantCreate = () => {
    setIsCreateServiceVariantEnabled(true);
    setOpenModalId("add-type-of-ticket-modal");
  };
  const [refreshKey, setRefreshKey] = useState(0);
  const handleDataAdded = () => {
    closeModal();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Facilities
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            {!isFacilityCreateVisible ? (
              <>
                <button
                  onClick={toggleFacilityCreate}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Facility</span>
                </button>
                <button
                  onClick={addServiceCreate}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Sub-Facility</span>
                </button>
                <button
                  onClick={addServicevariantCreate}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Ticket Type</span>
                </button>
                <button
                  onClick={() => {
                    setIsSlotAdd(true);
                    setSlotEditDetails({});
                    setIsSlotEdit(false);
                  }}
                  className="btn px-8 bg-gray-900 text-gray-100 hover:bg-gray-800 "
                >
                  <span className="max-xs:sr-only">Add Slot</span>
                </button>
                <button
                  onClick={() => {
                    setIsWalkersPassAdd(true);
                    setCurrentWalkersPassEditDetails({});
                    setIsWalkersPassEdit(false);
                  }}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Walker Pass Type</span>
                </button>
              </>
            ) : (
              <BackButton
                label="Back"
                onClick={() => setIsFacilityCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>
        {/* Cards */}
        {isFacilityCreateVisible ? (
          <ServiceUnifiedCreator
            setIsFacilityCreateVisible={setIsFacilityCreateVisible}
            isFacilityEditVisible={isFacilityEditVisible}
            setIsFacilityEditVisible={setIsFacilityEditVisible}
          />
        ) : (
          <UnifiedFacilityList
            key={refreshKey}
            setIsFacilityCreateVisible={setIsFacilityCreateVisible}
            setIsFacilityEditVisible={setIsFacilityEditVisible}
          />
        )}

        <>
          <PopupModal
            popupModalId="first-modal"
            isOpen={openModalId === "add-sub-facility-modal"}
            onClose={closeModal}
            title={"Add Sub-Facility"}
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
            isOpen={openModalId === "add-type-of-ticket-modal"}
            onClose={closeModal}
            title={"Add Type of Ticket"}
            size="medium"
            overlayClassName="bg-gray-800 bg-opacity-60"
            contentClassName="bg-white"
            defaultBodyPadding={true}
          >
            <div>
              <ServiceVarientCreate onDataAdded={handleDataAdded} />
            </div>
          </PopupModal>
          {/* walkers park pass create */}
          <PopupModal
            popupModalId="walkers-park-pass-create-modal"
            isOpen={isWalkersPassAdd}
            onClose={() => {
              setIsWalkersPassAdd(false);
              setIsWalkersPassEdit(false);
            }}
            title={
              isWalkersPassEdit
                ? "Update Walkers Park Pass"
                : "Add Walkers Park Pass"
            }
            size="medium"
            overlayClassName="bg-gray-800 bg-opacity-60"
            contentClassName="bg-white"
            defaultBodyPadding={true}
          >
            <div>
              <WalkersParkPassCreate />
            </div>
          </PopupModal>

          {/* slot create */}

          <PopupModal
            popupModalId="slot-create-modal"
            isOpen={isSlotAdd}
            onClose={() => {
              setIsSlotAdd(false);
              setIsSlotEdit(false);
            }}
            title={
              isSlotEdit
                ? "Update Slot"
                : "Add Slot"
            }
            size="medium"
            overlayClassName="bg-gray-800 bg-opacity-60"
            contentClassName="bg-white"
            defaultBodyPadding={true}
          >
            <div>
              <SlotCreate />
            </div>
          </PopupModal>
        </>
      </div>
    </AdminLayout>
  );
}
