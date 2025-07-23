import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useUnifiedFacilityStore } from "../../../../store/masters/unifiedFacilityStore";
import PackageNestedTable from "./PackageNestedTable";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import PackageTableLoader from "./PackageTableLoader";

const PackageTable = () => {
  const {
    PackagesWithRooms,
    isPackagesWithRoomsLoading,
    fetchPackagesWithRooms,
  } = usePackagesStore();
 
  useEffect(() => {
    fetchPackagesWithRooms();
  }, []);

  return (
    <>
   
      {isPackagesWithRoomsLoading ? (
        <PackageTableLoader />
      ) : (
        <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
          <PackageNestedTable data={PackagesWithRooms} />
        </div>
      )}
    </>
  );
};

export default PackageTable;
