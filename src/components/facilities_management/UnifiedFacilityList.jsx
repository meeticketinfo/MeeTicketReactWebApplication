import NestedTable from "../tables/nestedTable/nestedTable";

const UnifiedFacilityList = () => {

const data = [
  {
    name: "boating",
    weight: 12,
    dimensions: "10 x 10 x 10",
    value: "200.00",
    subRows: [
      {
        partNumber: "657338",
        description: "Lorem ipsum description 1",
        orderNumber: "6383000",
        qtyShipped: "14",
        weight: "45",
        totalValue: "4.00",
      },
      {
        partNumber: "657339",
        description: "Lorem ipsum description 2",
        orderNumber: "6383011",
        qtyShipped: "4",
        weight: "56",
        totalValue: "49.00",
      },
    ],
  },
  {
    packageNo: 2,
    weight: 14,
    dimensions: "15 x 12 x 10",
    value: "250.00",
    subRows: [
      {
        partNumber: "657340",
        description: "Lorem ipsum description 3",
        orderNumber: "6383022",
        qtyShipped: "18",
        weight: "32",
        totalValue: "487.00",
      },
      {
        partNumber: "657341",
        description: "Lorem ipsum description 4",
        orderNumber: "6383033",
        qtyShipped: "7",
        weight: "60",
        totalValue: "74.00",
      },
    ],
  },
];

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <NestedTable data={data} />
      </div>
    </>
  );
};

export default UnifiedFacilityList;
