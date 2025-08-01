import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link, useSearchParams } from "react-router-dom";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";


// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];
const RefundTransactionsChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  // filters,
}) => {
  const [searchParams] = useSearchParams();
  
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount = data?.reduce((sum, item) => sum + item.count, 0) || 0;

  useEffect(() => {
    const chart = AgCharts.create({
      container: chartRef.current,
      series: [
        {
          type: "pie",
          data: data,
          angleKey: angleKey,
          calloutLabelKey: calloutLabelKey,
          calloutLabel: {
            enabled: true,
            fontSize: window.innerWidth < 768 ? 10 : 12,
            color: "black",
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              return `${datum[calloutLabelKey]?.substring(0, window.innerWidth < 768 ? 100 : 220)}\n${datum[angleKey]
                } (${percentage}%)`;
            },
            offset: window.innerWidth < 768 ? 10 : 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: window.innerWidth < 768 ? 10 : 12,
            fontWeight: "bold",
            color: "#000",
            formatter: ({ datum, angleKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              return `${datum[angleKey]} (${percentage}%)`;
            },
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
    <div className="w-full mx-auto p-2 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold">Refund Transactions</h2>
        <div className="flex items-center gap-2 bg-[#C0DDFF] rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
          <span className="text-sm sm:text-lg text-[#404040] font-semibold">Total Refund Transactions</span>
          <Link to={`/refund-transactions-report?${searchParams.toString()}`} className="font-semibold text-sm sm:text-lg text-[#57a4d8] ml-2 underline">
            {totalCount}
          </Link>
        </div>
      </div>
      <div ref={chartRef} className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:w-[800px] lg:h-[400px] mx-auto" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 p-2 sm:p-3 max-h-[350px] overflow-auto max-w-full lg:max-w-[600px] mx-auto gap-2">
        {data?.map((item, index) => (
          <div
            key={index}
            title={item.status}
            className="flex justify-between items-center rounded-lg px-2 py-1 col-span-1 sm:col-span-1 lg:col-span-6"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-gray-800 truncate">{item.status}</span>
            </div>
            <Link
              to={`/refund-transactions-report?${searchParams.toString()}&RefundStatus=${item.refundStatus}`}
              onClick={() => {
                localStorage.setItem("refundTransactionSearchParams", `${searchParams.toString()}&RefundStatus=${item.refundStatus}`)
              }}
              className="shrink-0"
            >
              <span className="font-semibold text-sm text-[#57a4d8] ml-2 underline">
                {String(item.count).padStart(2, "0")}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundTransactionsChart;
