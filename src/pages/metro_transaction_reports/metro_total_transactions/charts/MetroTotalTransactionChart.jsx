import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link, useSearchParams } from "react-router-dom";
import useMetroTotalCommonStore from "../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";

// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];
const MetroTotalTransactionChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  // filters,
}) => {
  const { setOuterFilters, outerFilters, resetOuterFilters } =
    useMetroTotalCommonStore();

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
            fontSize: 10,
            color: "black",
            maxWidth: 150, // enables wrapping on AgCharts v8+
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 25;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${
                datum[angleKey]
              } (${percentage}%)`;
            },
            offset: 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: 10,
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

      const routes={
        FailedDueToOtherReasons:"/metro-failed-other-reason",
        FailedFromGateway:"/metro-failed-gateway",
        PaymentSuccessButTicketNotGenerated:"/metro-not-generated",
        Success:"/metro-total-report",
        Uncategorized:"/metro-total-report"
      }
  return (
    <div className="gap-8 w-full p-6">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h2 className="text-lg font-medium mb-2">Total Transactions</h2>
        <div className="bg-[#A7D3FF] text-[#404040] font-semibold rounded-xl px-4 py-2 text-base shadow-sm flex items-center">
          Total Transactions&nbsp;
          <Link
            to="/metro-total-report"
            onClick={() => {
              setOuterFilters({ ...outerFilters, status: "" });
            }}
            className="text-[#007AFF] font-bold underline ml-1"
          > 
            {totalCount}
          </Link>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        {/* Pie Chart */}
        <div className="flex-1 w-[90%]">
          <div ref={chartRef} className="h-[400px] max-w-[90%]" />
        </div>
        {data.length > 0 && (
          <div className="min-w-[340px]">
            <div className="border-l-[#B7B7B7] border-r-[#B7B7B7]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#D9E4FF]">
                    <th className="text-left px-4 py-2 text-[#205375] font-semibold">
                      Reasons
                    </th>
                    <th className="text-right px-4 py-2 text-[#205375] font-semibold">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <Link 
                           to={routes[item.paymentCategoryKey]}
                          className="text-[#000] hover:underline text-xs"
                           onClick={() => {
                            setOuterFilters({
                              ...outerFilters,
                              status: item.paymentCategoryKey,
                            });
                          }}
                          >
                            {item.location || item.paymentCategory}
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right border border-b-[#B7B7B7]">
                        <Link
                          to={routes[item.paymentCategoryKey]}
                          onClick={() => {
                            setOuterFilters({
                              ...outerFilters,
                              status: item.paymentCategoryKey,
                            });
                          }}
                          className="text-[#4A90E2] font-semibold hover:underline text-sm"
                        >
                          {item.count}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetroTotalTransactionChart;
