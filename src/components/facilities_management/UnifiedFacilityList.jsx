import { useEffect } from "react";
import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import NestedTable from "../tables/nestedTable/nestedTable";

const UnifiedFacilityList = () => {
  const { allUnifiedFacilities, fetchAllUnifiedFacilities } =
    useUnifiedFacilityStore();

  useEffect(() => {
    fetchAllUnifiedFacilities();
  }, []);

  return (
    <>
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
        <NestedTable data={allUnifiedFacilities} />
      </div>
    </>
  );
};

export default UnifiedFacilityList;
