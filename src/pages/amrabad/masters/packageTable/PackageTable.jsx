import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useUnifiedFacilityStore } from "../../../../store/masters/unifiedFacilityStore";
import PackageNestedTable from "./PackageNestedTable";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import PackageTableLoader from "./PackageTableLoader";

const PackageTable = ({ isHouseEditVisible ,setIsHouseEditVisible }) => {
  const {
    PackagesWithRooms,
    isPackagesWithRoomsLoading,
    fetchPackagesWithRooms,
  } = usePackagesStore();
  console.log("PackagesWithRooms", PackagesWithRooms);
  useEffect(() => {
    fetchPackagesWithRooms();
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {isPackagesWithRoomsLoading ? <PackageTableLoader /> : (
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
        <PackageNestedTable data={PackagesWithRooms} isHouseEditVisible={isHouseEditVisible} setIsHouseEditVisible={setIsHouseEditVisible} />
      </div>)}
    </>
  );
};

export default PackageTable;
