import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useUnifiedFacilityStore } from "../../../../store/masters/unifiedFacilityStore";
import NestedTable from "../../../../components/tables/nestedTable/nestedTable";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import { useModalStore } from "../../../../store/modalStore";
import FacilityCreate from "../../../../components/facilities_management/facilityCreate";
import ServiceCreate from "../../../../components/service_management/serviceCreate";
import ServiceVarientCreate from "../../../../components/service_variant_management/serviceVarientCreate";
import useAuthStore from "../../../../store/authStore";
import PackageNestedTable from "./PackageNestedTable";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";

const PackageTable = ({ setIsServiceEditVisible }) => {
  const { allUnifiedFacilities, fetchAllUnifiedFacilities } =
    useUnifiedFacilityStore();
    const { PackagesWithRooms, isPackagesWithRoomsLoading, fetchPackagesWithRooms } = usePackagesStore();
    console.log("PackagesWithRooms",PackagesWithRooms)
  useEffect(() => {
    fetchAllUnifiedFacilities();
    fetchPackagesWithRooms();
  }, []);

  return (
    <> 
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
        <PackageNestedTable
          data={allUnifiedFacilities}
          setIsServiceEditVisible={setIsServiceEditVisible}
        />
      </div>
    </>
  );
};

export default PackageTable;
