import { useUnifiedFacilityStore } from "../../store/masters/unifiedFacilityStore";
import NestedTable from "../tables/nestedTable/nestedTable";

const UnifiedFacilityList = () => {
const {allUnifiedFacilities} = useUnifiedFacilityStore();
const data = [
  {
    packageNo: 1,
    weight: 12,
    dimensions: "10 x 10 x 10",
    value: "200.00",
    totalCost: "35.00",
    specialServices: "4.00",
    subRows: [
      {
        partNumber: "657338",
        description: "Lorem ipsum description 1",
        orderNumber: "6383000",
        qtyShipped: "14",
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
        qtyShipped: "4",
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
    weight: 14,
    dimensions: "15 x 12 x 10",
    value: "250.00",
    totalCost: "50.00",
    specialServices: "5.00",
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
