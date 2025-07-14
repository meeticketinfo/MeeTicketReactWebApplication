import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link } from "react-router-dom";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";

// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

const TransactionByLocation = ({ data, title, angleKey, calloutLabelKey, filters }) => {
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const { setIsTotalTransactionPage } = userFailureTransaction();
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
            fontSize: 9, // Reduced font size for better readability
             color: "black",
            fontWeight: "normal",
            formatter: ({ datum }) =>
              `${datum[calloutLabelKey]?.substring(0, 110)}\n${datum[angleKey]}%`, // Truncate text if needed
            offset: 12, // Increased offset to provide more space
            minAngle: 0, // ensures small slices still show labels
          },
          sectorLabel: {
            enabled: true,
            fontSize: 10, // Adjusted font size for better readability
            fontWeight: "bold",
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
  }, [data, title, angleKey, calloutLabelKey]);

  return (
    <div className="w-full max-w-2xl mx-auto pb-3">
      <div ref={chartRef} className="w-[500px] h-[500px]" />
      <div className="flex flex-wrap gap-1 p-3 max-h-[350px] overflow-auto">
        <div
          title="Total Failed Transactions"
          className="flex justify-between items-center bg-blue-v1 rounded-lg px-2 py-1 shadow-sm "
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white" />
            <span className="text-xs text-white">Total</span>
          </div>
          <Link
            to={"/failed-transactions"}
            state={{ page: "total-report" }}
            onClick={() => {
              setIsTotalTransactionPage(false)
              localStorage.setItem(
                "transactionPayload",
                JSON.stringify({ ...UserTransactionReportFilter, resultMsg: "", category: "", locationId: "", status: "Failed", departmentId: "", categoryId: "" })
              )
            }}
          >
            <span className="font-semibold text-sm text-[#57a4d8] ml-2 underline">
              {String(data?.reduce((sum, item) => sum + item.failedCount, 0)).padStart(2, "0")}
            </span>
          </Link>
        </div>
        {data?.map((item, index) => (
          <div
            key={index}
            title={item.locationName}
            className="flex justify-between items-center bg-[#F5F6F8] rounded-lg px-2 py-1 shadow-sm "
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-gray-800 max-w-[150px] truncate">
                {item.locationName ? item.locationName : "N/A"}
              </span>
            </div>
            
            <Link 
              to={"/failed-transactions"} 
              onClick={() => {
                setIsTotalTransactionPage(false)
                localStorage.setItem("transactionPayload", 
                  JSON.stringify({...UserTransactionReportFilter, locationId: item.parkId, status: "Failed", resultMsg: "", departmentId: "", categoryId: "", category: ""}))
              }}
            >
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

export default TransactionByLocation;
