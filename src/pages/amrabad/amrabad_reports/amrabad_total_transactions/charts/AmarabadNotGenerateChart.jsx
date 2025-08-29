import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { Link } from "react-router-dom";

import AmarabadTotalCommonStore from "../../../../../store/amarabad_Total_transaction_reports_store/AmarabadTotalCommonStore";

// Define reason styles (color + count)
const reasonStyles = {
  "User Returned": { color: "#4A90E2", count: 5 },
  "Payment failed by bank": { color: "#002147", count: 14 },
  "Low network": { color: "#5A6F8F", count: 10 },
  "User returned from payment": { color: "#205375", count: 5 },
  "Payment success but ticket not generated": { color: "#D9E4FF", count: 12 },
};
const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];
const AmrabadNotGeneratedChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
  packageName,
  house,
  mobileNumber,
  fromDate,
  toDate,
  // filters,
}) => {
  const { setInnerFilters, innerFilters, resetInnerFilters,setOuterFilters,outerFilters } =
  AmarabadTotalCommonStore();

  const chartRef = useRef(null);
  const totalCount = data?.reduce((sum, item) => (sum+(item.count) || item.totalCount || 0), 0) || 0;
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
            fontSize: window.innerWidth < 768 ? 8 : 10, // Smaller font on mobile
            color: "black",
            maxWidth: window.innerWidth < 768 ? 100 : 150, // Smaller max width on mobile
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + (item[angleKey] || item.reasonCount || 0), 0);
              const percentage = ((datum[angleKey] || datum.reasonCount || 0) / total * 100).toFixed(2);
              const text = datum[calloutLabelKey] || "";
              const wrapLength = window.innerWidth < 768 ? 15 : 25; // Shorter wrap on mobile
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${
                datum[angleKey] || datum.reasonCount || 0
              } (${percentage}%)`;
            },
            offset: window.innerWidth < 768 ? 10 : 15, // Smaller offset on mobile
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: window.innerWidth < 768 ? 8 : 10, // Smaller font on mobile
            fontWeight: "bold",
            color: "#000",
            formatter: ({ datum, angleKey }) => {
              const total = data.reduce((sum, item) => sum + (item[angleKey] || item.reasonCount || 0), 0);
              const percentage = ((datum[angleKey] || datum.reasonCount || 0) / total * 100).toFixed(2);
              return `${datum[angleKey] || datum.reasonCount || 0} (${percentage}%)`;
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
        FailedDueToOtherReasons:"/amrabad-failed-other-reasons-report",
        FailedFromGateway:"/amrabad-failed-gateway",
        PaymentSuccessButTicketNotGenerated:"/amrabad-not-generated",
        Success:"/amrabad-total-report",
        Uncategorized:"/amrabad-total-report"
      }
  return (
    <div className="gap-4 md:gap-8 w-full p-3 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <h2 className="text-base md:text-lg font-medium mb-2">Total Transactions</h2>
        <div className="bg-[#A7D3FF] text-[#404040] font-semibold rounded-xl px-3 md:px-4 py-2 text-sm md:text-base shadow-sm flex items-center">
          Total Transactions&nbsp;
          <Link
            to={`/amrabad-not-generated-report?package=${packageName || ''}&house=${house || ''}&mobileNumber=${mobileNumber || ''}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&subCategory=`}
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

      {/* Chart and Table Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center justify-between">
        {/* Pie Chart */}
        <div className="w-full lg:flex-1 lg:w-[60%] xl:w-[70%]">
          <div ref={chartRef} className="h-[300px] sm:h-[350px] md:h-[400px] w-full max-w-full" />
        </div>
        
        {/* Table Section */}
        {data.length > 0 && (
          <div className="w-full lg:min-w-[300px] xl:min-w-[340px] lg:w-[40%] xl:w-[30%]">
            <div className="border-l-[#B7B7B7] border-r-[#B7B7B7] overflow-x-auto">
              <table className="w-full min-w-[280px]">
                <thead>
                  <tr className="bg-[#D9E4FF]">
                    <th className="text-left px-2 md:px-4 py-2 text-[#205375] font-semibold text-xs md:text-sm">
                      Reasons
                    </th>
                    <th className="text-right px-2 md:px-4 py-2 text-[#205375] font-semibold text-xs md:text-sm">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 md:px-3 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                        <div className="flex items-start gap-1 md:gap-2">
                          <div
                            className="w-2 md:w-3 h-2 md:h-3 rounded-full shrink-0 mt-1"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <Link 
                          to={`/amrabad-not-generated-report?package=${packageName || ''}&house=${house || ''}&mobileNumber=${mobileNumber || ''}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&subCategory=${encodeURIComponent(item.subCategory || '')}`}

                          className="text-[#000] hover:underline text-xs md:text-sm break-words max-w-[120px] md:max-w-[150px] lg:max-w-[200px] leading-tight"
                          onClick={() => {
                            setInnerFilters({
                              ...innerFilters,
                              status: item.mainCategory,
                              subCategory: item.subCategory,
                              package: packageName,
                              house: house,
                              mobileNumber: mobileNumber,
                              fromDate: fromDate,
                              toDate: toDate,
                            });
                          }}
                          title={item.failureReason || item.location || item.paymentCategory || item.subCategory}
                          >
                            {item.failureReason || item.location || item.paymentCategory || item.subCategory}
                          </Link>
                        </div>
                      </td>
                      <td className="px-2 md:px-3 py-2 text-right border border-b-[#B7B7B7]">
                        <Link
                         to={`/amrabad-not-generated-report?package=${packageName || ''}&house=${house || ''}&mobileNumber=${mobileNumber || ''}&fromDate=${fromDate || ''}&toDate=${toDate || ''}&subCategory=${encodeURIComponent(item.subCategory || '')}`}
                         onClick={() => {
                          setInnerFilters({
                            ...innerFilters,
                            status: item.mainCategory,
                            subCategory: item.subCategory,
                            package: packageName,
                            house: house,
                            mobileNumber: mobileNumber,
                            fromDate: fromDate,
                            toDate: toDate,
                          });
                        }}
                          className="text-[#4A90E2] font-semibold hover:underline text-xs md:text-sm"
                        >
                          {item.reasonCount || item.count || item.subCategoryCount || 0}
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

export default AmrabadNotGeneratedChart;
