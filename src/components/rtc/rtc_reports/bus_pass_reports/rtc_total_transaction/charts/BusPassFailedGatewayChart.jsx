import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link, useSearchParams } from "react-router-dom";
import busPassTotalCommonStore from "../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/busPassTotalCommonStore";

const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

const BusPassFailedOtherReasonChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  // filters,
}) => {
  const { innerFilters, setInnerFilters, outerFilters } =
  busPassTotalCommonStore();
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount =
    data?.reduce((sum, item) => sum + item.reasonCount, 0) || 0;

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

  return (
    <div className="gap-4 sm:gap-6 lg:gap-8 w-full p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <h2 className="text-base sm:text-lg font-medium mb-2">{title}</h2>
        <div className="bg-[#A7D3FF] text-[#404040] font-semibold rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base shadow-sm flex items-center">
          Total Transactions&nbsp;
          <Link
            to="/metro-failed-gateway-report"
            onClick={() => {
              setInnerFilters({
                ...innerFilters,
                status: outerFilters.status,
                subCategory: "",
              });
            }}
            className="text-[#007AFF] font-bold underline ml-1"
          >
            {totalCount}
          </Link>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start justify-between">
        {/* Pie Chart */}
        <div className="w-full lg:flex-1 lg:w-[60%] xl:w-[50%]">
          <div ref={chartRef} className="h-[300px] sm:h-[350px] lg:h-[400px] w-full max-w-full" />
        </div>

       {data?.length>0&& <div className="w-full lg:min-w-[300px] lg:max-w-[400px] xl:max-w-[500px]">
          <div className="flex justify-end mb-2"></div>
          <div className="border-l-[#B7B7B7] border-r-[#B7B7B7] max-h-[350px] sm:max-h-[400px] lg:max-h-[450px] overflow-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#D9E4FF]">
                  <th className="text-left px-2 sm:px-3 lg:px-4 py-2 text-[#205375] font-semibold">
                    Locations
                  </th>
                  <th className="text-right px-2 sm:px-3 lg:px-4 py-2 text-[#205375] font-semibold">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={item.location || item.paymentCategory}>
                    <td className="px-2 sm:px-3 lg:px-4 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <Link
                          to="/metro-failed-gateway-report"
                          className="text-[#000] hover:underline text-xs sm:text-sm break-words"
                          onClick={() => {
                            setInnerFilters({
                              ...innerFilters,
                              status: outerFilters.status,
                              subCategory: item.failureReasonKey,
                            });
                          }}
                        >
                          {item.failureReason}
                        </Link>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-4 py-2 text-right border border-b-[#B7B7B7]">
                      <Link
                        to="/metro-failed-gateway-report"
                        onClick={() => {
                          setInnerFilters({
                            ...innerFilters,
                            status: outerFilters.status,
                            subCategory: item.failureReasonKey,
                          });
                        }}
                        className="text-[#4A90E2] font-semibold hover:underline text-xs sm:text-sm"
                      >
                        {item.reasonCount}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default BusPassFailedOtherReasonChart;
