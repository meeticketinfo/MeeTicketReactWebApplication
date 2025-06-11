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
const TotalTransactionsChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  // filters,
}) => {
  const filters = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  // const [newFilters, setNewFilters] = useState(...filters);
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount = data?.reduce((sum, item) => sum + item.count, 0) || 0;

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
            fontSize: 9,
            color: "black",
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              return `${datum[calloutLabelKey]?.substring(0, 120)}\n${
                datum[angleKey]
              } (${percentage}%)`;
            },
            offset: 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: 9,
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
    <div className="w-full max-w-2xl mx-auto">
      <div ref={chartRef} className="w-[500px] h-[500px]" />
      <div className="flex flex-wrap gap-1 p-3 max-h-[350px] overflow-auto">
        <div
          title="Total Bookings"
          className="flex justify-between items-center bg-blue-v1 rounded-lg px-2 py-1 shadow-sm "
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white" />
            <span className="text-xs text-white">Total</span>
          </div>
          <Link
            to={"/failed-transactions"}
            state={{ page: "total-report" }}
            onClick={() =>
              localStorage.setItem(
                "transactionPayload",
                JSON.stringify({ ...filters, resultMsg: "", category: "" })
              )
            }
          >
            <span className="font-semibold text-sm text-[#57a4d8] ml-2 underline">
              {totalCount}
            </span>
          </Link>
        </div>
        {data?.map((item, index) => (
          <div
            key={item.failureReason}
            title={item.category}
            className="flex justify-between items-center bg-[#F5F6F8] rounded-lg px-2 py-1 shadow-sm "
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs text-gray-800">{item.category}</span>
            </div>
            <Link
              to={"/failed-transactions"}
              state={{ page: "total-report" }}
              onClick={() =>
                localStorage.setItem(
                  "transactionPayload",
                  JSON.stringify({
                    ...filters,
                    resultMsg: "",
                    category:
                      item.category == "Sucessful Transactions"
                        ? "ConfirmedSuccess"
                        : item.category ==
                          "Payment done but Ticket Not generated"
                        ? "SuccessButNotConfirmed"
                        : "Failed",
                  })
                )
              }
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

export default TotalTransactionsChart;
