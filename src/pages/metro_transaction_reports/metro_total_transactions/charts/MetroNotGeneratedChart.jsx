import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link, useSearchParams } from "react-router-dom";
import useMetroTotalCommonStore from "../../../../store/metro_transaction_reports_store/metro_total/MetroTotalCommonStore";

const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

const MetroFailedGatewayChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  // filters,
}) => {
  const { innerFilters, setInnerFilters, outerFilters } =
    useMetroTotalCommonStore();
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount =
    data?.reduce((sum, item) => sum + item.subCategoryCount, 0) || 0;

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
    <div className="gap-8 w-full p-6">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h2 className="text-lg font-medium mb-2">{title}</h2>
        <div className="bg-[#A7D3FF] text-[#404040] font-semibold rounded-xl px-4 py-2 text-base shadow-sm flex items-center">
          Total Transactions&nbsp;
          <Link
            to="/metro-not-generated-report"
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
      <div className="flex flex-row gap-2 items-center justify-between">
        {/* Pie Chart */}
        <div className="flex-1 w-[90%]">
          <div ref={chartRef} className="h-[400px] max-w-[90%]" />
        </div>

        <div className="min-w-[340px] max-w-[500px]">
          <div className="flex justify-end mb-2"></div>
          <div className="border-l-[#B7B7B7] border-r-[#B7B7B7] max-h-[450px] overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#D9E4FF]">
                  <th className="text-left px-4 py-2 text-[#205375] font-semibold">
                    Locations
                  </th>
                  <th className="text-right px-4 py-2 text-[#205375] font-semibold">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={item.location || item.paymentCategory}>
                    <td className="px-3 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <Link
                          to="/metro-not-generated-report"
                          className="text-[#000] hover:underline text-xs"
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
                    <td className="px-3 py-2 text-right border border-b-[#B7B7B7]">
                      <Link
                        to="/metro-not-generated-report"
                        onClick={() => {
                          setInnerFilters({
                            ...innerFilters,
                            status: outerFilters.status,
                            subCategory: item.failureReasonKey,
                          });
                        }}
                        className="text-[#4A90E2] font-semibold hover:underline text-sm"
                      >
                        {item.reasonCount}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetroFailedGatewayChart;
