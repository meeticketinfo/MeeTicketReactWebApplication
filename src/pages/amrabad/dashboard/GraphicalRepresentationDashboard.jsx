import React, { useState, useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-enterprise';
import { formatThousands } from '../../../utils/Utils';

const GraphicalRepresentationDashboard = () => {
  const [activeTab, setActiveTab] = useState('package');
  const [selectedPackage, setSelectedPackage] = useState('Munnanur Tiger Reserve');

  // Package Level Data
  const packageLevelData = [
    {
      packageName: "Domalapenta Akkamaha Devi Stay Package",
      totalBookings: 18954,
      totalAmount: 1137240
    },
    {
      packageName: "Munnanur Jungle Resort - Tiger Stay Package",
      totalBookings: 12567,
      totalAmount: 752020
    }
  ];

  // House Level Data for different packages
  const houseLevelData = {
    "Munnanur Tiger Reserve": [
      {
        houseType: "Chital and Other",
        totalBookings: 1012,
        totalAmount: 312000
      },
      {
        houseType: "Chenchu Hut",
        totalBookings: 6178,
        totalAmount: 279180
      },
      {
        houseType: "Farha - Tree House",
        totalBookings: 2165,
        totalAmount: 190000
      },
      {
        houseType: "Dhuva & Sambai - Mud Houses",
        totalBookings: 1200,
        totalAmount: 230808
      },
      {
        houseType: "Standard Room",
        totalBookings: 8945,
        totalAmount: 445200
      }
    ],
    "Domalapenta Akkamaha Devi Stay Package": [
      {
        houseType: "Luxury Suite",
        totalBookings: 8500,
        totalAmount: 680000
      },
      {
        houseType: "Deluxe Room",
        totalBookings: 6500,
        totalAmount: 325000
      },
      {
        houseType: "Standard Room",
        totalBookings: 3854,
        totalAmount: 132248
      }
    ]
  };

  const packageOptions = Object.keys(houseLevelData);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6">
      <h3 className="text-xl text-gray-800 mt-2">
          Graphical Representation
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="relative mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('package')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'package'
                ? 'text-blue-700 border-b-2 border-b-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Package Level
          </button>
          <button
            onClick={() => setActiveTab('house')}
            className={`px-6 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'house'
                ? 'text-blue-700 border-b-2 border-b-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Houses Level
          </button>
        </div>
        {/* Half line under tabs */}
        <div className="w-1/2 h-px bg-gray-300 mt-0"></div>
      </div>

      {/* Package Level Content */}
      {activeTab === 'package' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Bookings Pie Chart */}
            <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
              <PackagePieChart
                data={packageLevelData}
                title="Total Bookings"
                angleKey="totalBookings"
                calloutLabelKey="packageName"
              />
            </div>

            {/* Total Amount Bar Chart */}
            <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="h-80">
                <PackageBarChart
                  data={packageLevelData}
                  title="Total Amount"
                  valueKey="totalAmount"
                  labelKey="packageName"
                  yAxisLabel="Amount in Rupees (₹)"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* House Level Content */}
      {activeTab === 'house' && (
        <div className="space-y-6">
          {/* Package Selection */}
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className={`mt-1 block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
            >
              {packageOptions.map((packageName) => (
                <option key={packageName} value={packageName}>
                  {packageName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Bookings Pie Chart */}
            <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
              <HousePieChart
                data={houseLevelData[selectedPackage]}
                title="Total Bookings"
                angleKey="totalBookings"
                calloutLabelKey="houseType"
              />
            </div>

            {/* Total Amount Bar Chart */}
            <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200 relative">
              {/* Highlight border for the bar chart */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"></div>
              <div className="h-80">
                <HouseBarChart
                  data={houseLevelData[selectedPackage]}
                  title="Total Amount"
                  valueKey="totalAmount"
                  labelKey="houseType"
                  yAxisLabel="Amount in ₹"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Package Level Pie Chart Component using MetroTotalTransactionChart pattern
const PackagePieChart = ({ data, title, angleKey, calloutLabelKey }) => {
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount = data?.reduce((sum, item) => sum + item[angleKey], 0) || 0;

  // Define colors for the pie chart
  const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

  useEffect(() => {
    if (!chartRef.current) return;

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
            maxWidth: 150,
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 25;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${formatThousands(datum[angleKey])} (${percentage}%)`;
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
              return `${formatThousands(datum[angleKey])} (${percentage}%)`;
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
  }, [data, angleKey, calloutLabelKey]);

  return (
    <div className="gap-8 w-full">
      <div className="flex flex-row gap-2 items-center justify-center mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        {/* Pie Chart */}
        <div className="flex-1 ">
          <div ref={chartRef} className="" />
        </div>
       
      </div>
    </div>
  );
};

// House Level Pie Chart Component using MetroTotalTransactionChart pattern
const HousePieChart = ({ data, title, angleKey, calloutLabelKey }) => {
  const chartRef = useRef(null);

  // Calculate total count
  const totalCount = data?.reduce((sum, item) => sum + item[angleKey], 0) || 0;

  // Define colors for the pie chart
  const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

  useEffect(() => {
    if (!chartRef.current) return;

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
            maxWidth: 150,
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = ((datum[angleKey] / total) * 100).toFixed(2);
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 25;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${formatThousands(datum[angleKey])} (${percentage}%)`;
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
              return `${formatThousands(datum[angleKey])} (${percentage}%)`;
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
  }, [data, angleKey, calloutLabelKey]);

  return (
    <div className="gap-8 w-full">
      <div className="flex flex-row gap-2 items-center justify-center mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        {/* Pie Chart */}
        <div className="flex-1 w-[90%]">
          <div ref={chartRef} className="" />
        </div>
      </div>
    </div>
  );
};

// Package Level Bar Chart Component
const PackageBarChart = ({ data, title, valueKey, labelKey, yAxisLabel }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const options = {
      container: chartRef.current,
      title: {
        text: title,
        fontSize: 16,
        fontWeight: 'bold'
      },
      series: [{
        data: data,
        type: "bar",
        xKey: labelKey,
        yKey: valueKey,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 1,
      }],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: 'Packages',
            fontSize: 12
          },
          label: {
            rotation: 0,
          }
        },
        {
          type: "number",
          position: "left",
          title: {
            text: yAxisLabel,
            fontSize: 12
          },
          label: {
            formatter: (params) => {
              return `₹${formatThousands(params.value)}`;
            }
          }
        }
      ],
      legend: {
        enabled: false,
      },
      background: {
        fill: "transparent",
      },
      
    };

    const chart = AgCharts.create(options);

    return () => {
      chart.destroy();
    };
  }, [data, title, valueKey, labelKey, yAxisLabel]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

// House Level Bar Chart Component
const HouseBarChart = ({ data, title, valueKey, labelKey, yAxisLabel }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const options = {
      container: chartRef.current,
      title: {
        text: title,
        fontSize: 16,
        fontWeight: 'bold'
      },
      series: [{
        data: data,
        type: "bar",
        xKey: labelKey,
        yKey: valueKey,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 1,
      }],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: 'House Type',
            fontSize: 12
          },
          label: {
            rotation: 0,
          }
        },
        {
          type: "number",
          position: "left",
          title: {
            text: yAxisLabel,
            fontSize: 12
          },
          label: {
            formatter: (params) => {
              return `₹${formatThousands(params.value)}`;
            }
          }
        }
      ],
      legend: {
        enabled: false,
      },
      background: {
        fill: "transparent",
      },
    };

    const chart = AgCharts.create(options);

    return () => {
      chart.destroy();
    };
  }, [data, title, valueKey, labelKey, yAxisLabel]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default GraphicalRepresentationDashboard; 