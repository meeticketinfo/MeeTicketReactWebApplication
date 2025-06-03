import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link } from "react-router-dom";

const TransactionDepartment = () => {
  const chartRef = useRef(null);

  const data = [
    { department: "GHMC", count: 40, color: "#001F54" },
    { department: "Endowment", count: 20, color: "#005B96" },
    { department: "TGTDC", count: 15, color: "#3399FF" },
    { department: "HMDA", count: 15, color: "#678CB1" },
    { department: "Forest Department", count: 10, color: "#A0BFE0" },
  ];

  useEffect(() => {
  const options = {
    container: chartRef.current,
    autoSize: true,
    title: {
      text: "Failed Transactions By Departments",
      fontSize: 16,
      fontWeight: "bold",
      spacing: 10,
    },
    data,
    series: [
      {
        type: "donut",
        angleKey: "count",
        calloutLabelKey: "department",
        calloutLabel: {
          formatter: ({ datum }) => `${datum.department} (${datum.count}%)`,
          fontSize: 13,
          color: "#333",
        },
        // Disable sector labels
        sectorLabel: {
          enabled: false,
        },
        fills: data.map((d) => d.color),
        strokes: data.map(() => "#fff"),
        innerRadiusRatio: 0.7,
        sectorSpacing: 2,
      },
    ],
    legend: {
      enabled: false,
    },
  };

  AgCharts.create(options);
}, []);


  return (
    <div className="w-[475px] m-2 bg-white rounded-xl p-5 shadow-md">
      <div ref={chartRef} className="w-full h-[300px]" />
      <div className="grid grid-cols-2 gap-3 mt-5">
        {data.map((item) => (
          <div
            key={item.department}
            className="flex items-center gap-2 bg-[#F5F6F8] rounded-md px-3 py-2 text-sm font-medium"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.department}</span>
            
             <span className="ml-auto text-[#3399FF] font-semibold text-sm underline">
             <Link>{String(item.count).padStart(2, "0")}</Link> 
            </span>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDepartment;
