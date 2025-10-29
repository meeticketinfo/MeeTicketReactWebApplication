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
const PaymentGatewayReportChart = ({
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
  const hasData = data && data.length > 0 && totalCount > 0;

  useEffect(() => {
    // Only create chart if there's data
    if (!hasData) return;

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
  }, [data, title, angleKey, calloutLabelKey, hasData]);

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">Settlement Summary</h2>
        <div className="flex items-center gap-2 bg-[#C0DDFF] rounded-lg px-4 py-3 shadow-sm">
          <span className="text-lg text-[#404040] font-semibold">Total Settlement Summary</span>
          <Link to={`/bus-pass-settlement-summary-inner-report?${searchParams.toString()}&status=all`} className="font-semibold text-lg text-[#57a4d8] ml-2 underline">
            {totalCount}
          </Link>
        </div>
      </div>
      
      {hasData ? (
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
          <div className="w-full lg:w-auto lg:flex-1 max-w-[800px]">
            <div ref={chartRef} className="w-full h-[400px]" />
          </div>
          <div className="w-full lg:w-auto lg:min-w-[300px] xl:min-w-[340px]">
            <div className=" pl-4 pr-4 overflow-x-auto"> 
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-[#DBF0FF]">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Reasons
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="text-sm text-gray-800">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/bus-pass-settlement-summary-inner-report?${searchParams.toString()}&status=${encodeURIComponent(item.status)}`}
                          onClick={() => {
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.set('status', item.status);
                            localStorage.setItem("busPassPaymentGatewayInnerTransactionSearchParams", newParams.toString())
                          }}
                          className="font-semibold text-sm text-[#57a4d8] hover:underline"
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
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-[800px] h-[400px] mx-auto ">
          <div className="text-center">

            <span className="text-sm font-medium text-gray-900 mb-2">No Data Display</span>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGatewayReportChart;
