import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link } from "react-router-dom";

// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};

const TransactionPieChart = ({ data, title, angleKey }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = AgCharts.create({
      container: chartRef.current,
      title: {
        text: title,
      },
      series: [
        {
          type: "pie",
          data: data,
          angleKey: angleKey,
          calloutLabelKey: "passTypeName",
          calloutLabel: {
            enabled: true,
            fontSize: 12,
            fontWeight: "normal",
            formatter: ({ datum }) =>
              `${datum.passTypeName}\n${datum[angleKey]}%`,
          },
          sectorLabel: {
          enabled: true,
          fontSize: 18,
          fontWeight: "bold", // should apply after upgrading
          color: "#000",
          formatter: ({ datum }) => `${datum[angleKey]}%`,
        },
          fills: Object.values(reasonStyles).map((s) => s.color),
          stroke: "#ffffff",
          calloutLine: {
            colors: Object.values(reasonStyles).map((s) => s.color),
          },
        },
      ],
      legend: { enabled: false },
    });

    return () => chart.destroy();
  }, [data, title, angleKey]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div ref={chartRef} className="w-[500px] h-[500px]" />
      <div className="flex flex-wrap gap-3 mt-4 p-3">
        {Object.entries(reasonStyles).map(([label, { color, count }]) => (
          <div
            key={label}
            className="flex justify-between items-center bg-[#F5F6F8] rounded-lg px-4 py-2 shadow-sm "
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-800">{label}</span>
            </div>
            <Link to={"/bank-transactions"}>
              <span className="font-bold text-sm text-[#57a4d8] ml-2 underline">
              {String(count).padStart(2, "0")}
            </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPieChart;
