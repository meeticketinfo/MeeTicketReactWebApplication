import React, { useEffect, useRef, useMemo } from "react";
import { AgCharts } from "ag-charts-community";
import { Link } from "react-router-dom";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";

// Static color palette
const colorPalette = ["#002147", "#4A90E2", "#5A6F8F", "#205375", "#D9E4FF"];

const getRandomColorData = (data, palette) => {
  const shuffledColors = [...palette].sort(() => 0.5 - Math.random());
  return data?.map((item, index) => ({
    ...item,
    color: shuffledColors[index % shuffledColors.length],
  }));
};

const TransactionDepartment = ({ data = [], angleKey, calloutLabelKey, title, filters }) => {
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const { setIsTotalTransactionPage } = userFailureTransaction();
  const chartRef = useRef(null);

  // Assign random colors only once using useMemo
  const coloredData = useMemo(() => getRandomColorData(data, colorPalette), [data]);

  useEffect(() => {
    const options = {
      container: chartRef.current,
      autoSize: true,
      title: {
        text: title,
        fontSize: 16,
        // fontWeight: "bold",
        spacing: 10,
      },
      data: coloredData,
      series: [
        {
          type: "donut",
          angleKey,
          calloutLabelKey,
          calloutLabel: {
            // Truncate the callout label if it exceeds 20 characters for better readability
            formatter: ({ datum }) => `${datum[calloutLabelKey]}\n(${datum[angleKey]})`,
            fontSize: 9,
            color: "black",
          },
          sectorLabel: {
            enabled: false,
          },
          fills: coloredData.map((d) => d.color),
          strokes: coloredData.map(() => "#fff"),
          innerRadiusRatio: 0.7,
          sectorSpacing: 2,
        },
      ],
      legend: {
        enabled: false,
      },
    };

    const chart = AgCharts.create(options);
    return () => chart.destroy();
  }, [coloredData, angleKey, calloutLabelKey, title]);

  return (
    <div className="m-2 pb-3 bg-white rounded-xl p-2 shadow-md">
      <div ref={chartRef} className="w-full h-[300px]" />
      <div className="flex flex-wrap gap-2 mt-5">
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
                JSON.stringify({ ...UserTransactionReportFilter, resultMsg: "", category: "", locationId: "", departmentId: "", categoryId: "", status: "Failed"   })
              )
            }}
          >
            <span className="font-semibold text-sm text-[#57a4d8] ml-2 underline">
              {String(data?.reduce((sum, item) => sum + item.failedCount, 0)).padStart(2, "0")}
            </span>
          </Link>
        </div>
        {coloredData.map((item) => (
          <div
            key={item[calloutLabelKey]}
            className="flex items-center gap-2 bg-[#F5F6F8] rounded-md px-3 py-2 text-xs font-thin"
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs">{item[calloutLabelKey]}</span>
            <span className="ml-auto text-[#3399FF] font-semibold text-sm underline">
              <Link  
                to={"/failed-transactions"} 
                onClick={() => {
                  setIsTotalTransactionPage(false)
                  localStorage.setItem("transactionPayload", 
                    JSON.stringify({...UserTransactionReportFilter, resultMsg: "", parkId: "", departmentId: item?.departmentId ?? "", categoryId: item?.entityTypeId ?? "", status: "Failed" }))
                }}
              >{String(item[angleKey]).padStart(2, "0")}</Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionDepartment;
