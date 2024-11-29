import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import NestedTable from "../tables/nestedTable/nestedTable";

const UnifiedFacilityList = () => {
const {allUnifiedFacilities} = useUnifiedFacilityStore();
const data = [
  {
    packageNo: 1,
    name: 12,
    description: "10 x 10 x 10",
    isActive: true,
    subRows: [
      {
        partNumber: "657338",
        description: "Lorem ipsum description 1",
        orderNumber: "6383000",
        subFacilityName: "14",
        weight: "45",
        totalValue: "4.00",
        details: [
          { detailId: "D001", detailInfo: "Detail 1 Info", notes: "Note 1" },
          { detailId: "D002", detailInfo: "Detail 2 Info", notes: "Note 2" },
        ],
      },
      {
        partNumber: "657339",
        description: "Lorem ipsum description 2",
        orderNumber: "6383011",
        subFacilityName: "4",
        weight: "56",
        totalValue: "49.00",
        details: [
          { detailId: "D003", detailInfo: "Detail 3 Info", notes: "Note 3" },
          { detailId: "D004", detailInfo: "Detail 4 Info", notes: "Note 4" },
        ],
      },
    ],
  },
  {
    packageNo: 2,
    name: 12,
    description: "10 x 10 x 10",
    isActive: true,
    subRows: [
      {
        partNumber: "657340",
        description: "Lorem ipsum description 3",
        orderNumber: "6383022",
        qtyShipped: "18",
        weight: "32",
        totalValue: "487.00",
        details: [
          { detailId: "D005", detailInfo: "Detail 5 Info", notes: "Note 5" },
        ],
      },
    ],
  },
];

  return (
    <>
      <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl">
        <NestedTable data={data} />
      </div>
    </>
  );
};

export default UnifiedFacilityList;
