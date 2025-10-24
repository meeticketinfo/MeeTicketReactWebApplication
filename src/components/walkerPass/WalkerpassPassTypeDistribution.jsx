import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { useWalkerpassStore } from "./store/walkerpassStore";

const WalkerpassPassTypeDistribution = () => {
  const { walkerPassDashboard, isFetchWalkerpassDashboardLoading } =
    useWalkerpassStore();

  const chartRef = useRef(null);

  // Get data from walkerPassDashboard response
  const apiData = walkerPassDashboard?.dashboard || [];

  // Calculate total count from API data
  const totalCount = apiData.reduce(
    (sum, item) => sum + (item.totalCount || 0),
    0
  );
 
  // Calculate percentages based on actual data
  const calculatePercentage = (count) => {
    return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  };

  // Transform data for AgCharts based on walkerPassDashboard response
  let chartData = [];

  if (Array.isArray(apiData) && apiData.length > 0 && totalCount > 0) {
    // Group by passCategory and sum total counts
    const ordinaryTotal = apiData
      .filter((item) => item.passCategory === "Ordinary Walker's Pass")
      .reduce((sum, item) => sum + (item.totalCount || 0), 0);

    const seniorCitizenTotal = apiData
      .filter((item) => item.passCategory === "Senior Citizen Walker's Pass")
      .reduce((sum, item) => sum + (item.totalCount || 0), 0);

    // Create chart data with passCategory-based grouping
    chartData = [
      {
        passTypeName: "Ordinary Walker's Pass",
        percentage: calculatePercentage(ordinaryTotal),
        count: ordinaryTotal,
      },
      {
        passTypeName: "Senior Citizen Walker's Pass",
        percentage: calculatePercentage(seniorCitizenTotal),
        count: seniorCitizenTotal,
      },
    ].filter((item) => item.count > 0); // Only show segments with data

    console.log("Chart Data:", chartData);
    console.log("Ordinary Total:", ordinaryTotal);
    console.log("Senior Citizen Total:", seniorCitizenTotal);
  } else {
    // Fallback to sample data if no walkerPassDashboard data
    chartData = [
      {
        passTypeName: "Ordinary Walker's Pass",
        percentage: 50,
        count: 50,
      },
      {
        passTypeName: "Senior Citizen Walker's Pass",
        percentage: 50,
        count: 50,
      },
    ];
  }

  // Define colors for the pie chart (different shades of blue as shown in image)
  const colors = ["#1E3A8A", "#1E40AF", "#3B82F6", "#93C5FD"];

  // Find the most popular pass type (highest count)
  const mostPopular =
    chartData.length > 0
      ? chartData.reduce((max, current) =>
          current.count > max.count ? current : max
        )
      : null;

  useEffect(() => {
    if (!chartRef.current || !chartData || chartData.length === 0) return;

    const chart = AgCharts.create({
      container: chartRef.current,
      series: [
        {
          type: "pie",
          data: chartData,
          angleKey: "percentage",
          calloutLabelKey: "passTypeName",
          calloutLabel: {
            enabled: true,
            fontSize: 12,
            color: "#374151",
            fontWeight: "500",
            maxWidth: 100,
            formatter: ({ datum, calloutLabelKey, angleKey }) => {
              const text = datum[calloutLabelKey] || "";
              const count = datum.count || 0;
              const percentage = datum[angleKey] || 0;
              return `${text}\n${count} (${percentage}%)`;
            },
            offset: 20,
            minAngle: 5,
          },
          sectorLabel: {
            enabled: false,
          },
          fills: colors,
          stroke: "transparent",
          strokeWidth: 0,
          calloutLine: {
            colors: colors,
            strokeWidth: 2,
          },
          innerRadiusRatio: 0,
        },
      ],
      legend: {
        enabled: false,
      },
      background: {
        fill: "#f9fafb",
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    });

    return () => chart.destroy();
  }, [chartData]);

  return (
    <div className="col-span-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Pass Type Distribution
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-6">
          {/* Most Popular Pass Type */}
          {mostPopular && (
            <div className="bg-blue-50 rounded-lg p-4 min-w-[200px]">
              <div className="text-sm text-blue-600 font-medium mb-2">
                Most Popular Pass Type
              </div>
              <div className="text-xl font-bold text-gray-800">
                {mostPopular.passTypeName}
              </div>
            </div>
          )}

          {/* Pie Chart */}
          <div className="flex-1">
            {isFetchWalkerpassDashboardLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : chartData.length > 0 ? (
              <div ref={chartRef} style={{ width: "100%", height: "300px" }} />
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                  No pass type distribution data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkerpassPassTypeDistribution;
