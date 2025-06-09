import React, { useState } from "react";
import UnifiedFacilityList from "../../../../components/facilities_management/UnifiedFacilityList";
import PackageTable from "../packageTable/packageTable";

const PackagesList = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFacilityCreateVisible, setIsFacilityCreateVisible] = useState(false);
  const [isFacilityEditVisible, setIsFacilityEditVisible] = useState(false);
  return (
    <div>
      <PackageTable
        key={refreshKey}
        setIsFacilityCreateVisible={setIsFacilityCreateVisible}
        setIsFacilityEditVisible={setIsFacilityEditVisible}
      />
    </div>
  );
};

export default PackagesList;
