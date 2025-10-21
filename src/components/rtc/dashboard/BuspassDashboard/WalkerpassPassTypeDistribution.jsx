import React, { useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-community";
import { useBuspassDashboardStore } from "./store/buspassDashboardStore";

const WalkerpassPassTypeDistribution = () => {
  const { buspassDashboard, isFetchBuspassDashboardLoading } = useBuspassDashboardStore();
  const chartRef = useRef(null);

  // Get pass type distribution data from the store
  const passTypeDistribution = buspassDashboard?.data?.passTypeDistribution || [];

  // Dummy data for demonstration
  const dummyData = [
    { type: "Ordinary Pass", percentage: 45 },
    { type: "Metro Deluxe Pass", percentage: 25 },
    { type: "Metro Express Pass", percentage: 15 },
    { type: "Green Metro Luxury AC", percentage: 10 },
    { type: "Pushpak A/C Pass", percentage: 5 }
  ];

  // Use dummy data if no real data is available
  const dataToUse = passTypeDistribution.length > 0 ? passTypeDistribution : dummyData;

  // Transform data for AgCharts
  const chartData = dataToUse.map((item) => ({
    passTypeName: item.type,
    percentage: item.percentage
  }));

  // Define colors for the pie chart
  const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

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
            fontSize: 10,
            color: "black",
            maxWidth: 120,
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 20;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${datum[angleKey] || 0}%`;
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
              return `${datum[angleKey] || 0}%`;
            },
          },
          fills: colors,
          stroke: "transparent",
          strokeWidth: 0,
          calloutLine: {
            colors: colors,
          },
        },
      ],
      legend: { enabled: false },
      background: {
        fill: "transparent",
      },
    });

    return () => chart.destroy();
  }, [chartData]);

  return (
    <div className="col-span-full">
      <div className="mb-4 sm:mb-2 mt-4">
        <h2 className="text-xl sm:text-xl font-bold text-gray-800">Pass Type Distribution</h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-gray-200">
        {isFetchBuspassDashboardLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length > 0 ? (
          <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-lg">No pass type distribution data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkerpassPassTypeDistribution;
