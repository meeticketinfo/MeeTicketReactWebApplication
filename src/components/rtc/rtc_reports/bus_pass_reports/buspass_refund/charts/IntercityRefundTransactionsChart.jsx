import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link, useSearchParams } from "react-router-dom";


// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];
const IntercityRefundTransactionsChart = ({
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
            fontSize: 12,
            color: "black",
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              return `${datum[calloutLabelKey]?.substring(0, 220)}\n${datum[angleKey]
                } (${percentage}%)`;
            },
            offset: 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: 12,
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
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Refund Transactions</h2>
        <div className="flex items-center gap-2 bg-[#C0DDFF] rounded-lg px-4 py-3 shadow-sm">
          <span className="text-lg text-[#404040] font-semibold">Total Refund Transactions</span>
          <Link to={`/intercity-refund-inner-report?${searchParams.toString()}`} className="font-semibold text-lg text-[#57a4d8] ml-2 underline">
            {totalCount}
          </Link>
        </div>
      </div>
      <div ref={chartRef} className="w-[800px] h-[400px] mx-auto" />
      <div className="grid grid-cols-12 p-3 max-h-[350px] overflow-auto max-w-[600px] mx-auto gap-2">
        {data?.map((item, index) => (
          <div
            key={index}
            title={item.status}
            className="flex justify-between items-center rounded-lg px-2 py-1 col-span-6"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-gray-800">{item.status}</span>
            </div>
            <Link
              to={`/intercity-refund-inner-report?${searchParams.toString()}&RefundStatus=${item.refundStatus}`}
              onClick={() => {
                localStorage.setItem("busPassRefundInnerTransactionSearchParams", `${searchParams.toString()}&RefundStatus=${item.refundStatus}`)
              }}
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

export default IntercityRefundTransactionsChart;
