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
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];
const TransactionPieChart = ({ data, title, angleKey, calloutLabelKey }) => {
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
          calloutLabelKey: calloutLabelKey,
          calloutLabel: {
            enabled: true,
            fontSize: 9, // Reduced font size
            color: "black",
            // fontWeight: "normal",
            formatter: ({ datum }) =>
              `${datum[calloutLabelKey]?.substring(0, 20)}\n${
                datum[angleKey]
              }%`, // Truncate text if needed
            offset: 15, // Increased offset for better spacing
            minAngle: 0, // ensures small slices still show labels
          },

          sectorLabel: {
            enabled: true,
            fontSize: 9, // Reduced font size for sector labels
            fontWeight: "bold",
            color: "#000",
            formatter: ({ datum }) => `${datum[angleKey]}%`,
          },
          fills: Object.values(reasonStyles).map((s) => s.color),
          stroke: "#fffff",
          calloutLine: {
            colors: Object.values(reasonStyles).map((s) => s.color),
          },
        },
      ],
      legend: { enabled: false },
    });

    return () => chart.destroy();
  }, [data, title, angleKey, calloutLabelKey]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div ref={chartRef} className="w-[500px] h-[500px]" />
      <div className="flex flex-wrap gap-1 p-3 max-h-[350px] overflow-auto">
        {data?.map((item, index) => (
          <div
            key={item.failureReason}
            title={item.failureReason}
            className="flex justify-between items-center bg-[#F5F6F8] rounded-lg px-2 py-1 shadow-sm "
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-gray-800 max-w-[150px] truncate">
                {item.failureReason ? item.failureReason : "Reason not updated"}
              </span>
            </div>
            <Link to={""}>
              <span className="font-semibold text-sm text-[#57a4d8] ml-2 underline">
                {String(item.failedCount).padStart(2, "0")}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPieChart;
