import React, { useState, useEffect, useRef } from 'react';
import { AgCharts } from 'ag-charts-enterprise';
import { formatThousands } from '../../../utils/Utils';
import { useAmrabadDashboardStore } from './store/amarabadDashboardStore';
import { usePackagesStore } from '../../../store/amrabad/masters/packagesStore';
const GraphicalRepresentationDashboard = () => {
  const [activeTab, setActiveTab] = useState('package');
  const [selectedPackage, setSelectedPackage] = useState('');
  const {
    amrabadDashboardBookingsSummaryData,
    fetchAmrabadDashboardBookingsSummaryData,
    isFetchAmrabadDashboardBookingsSummaryDataLoading,
  } = useAmrabadDashboardStore();
  const { AllPackages,getPackages} = usePackagesStore();
  const { packagesDataById, fetchPackagesDataById, isFetchPackagesDataByIdLoading } = useAmrabadDashboardStore();

  // Fetch data on component mount
  useEffect(() => {
    const currentDate = new Date();
    const fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    fetchAmrabadDashboardBookingsSummaryData({
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: toDate.toISOString().split('T')[0]
    });
    getPackages();
  }, [fetchAmrabadDashboardBookingsSummaryData]);

  // Set default package when AllPackages loads
  useEffect(() => {
    if (AllPackages && AllPackages.length > 0 && !selectedPackage) {
      setSelectedPackage(AllPackages[0].packageId);
    }
  }, [AllPackages, selectedPackage]);

  // Fetch package data when selectedPackage changes
  useEffect(() => {
    if (selectedPackage) {
      fetchPackagesDataById(selectedPackage);
    }
  }, [selectedPackage, fetchPackagesDataById]);
 

  // House Level Data for different packages
  const houseLevelData = {
    "test3243": [
      {
        houseType: "Standard Room",
        totalBookings: 8,
        totalAmount: 1500
      },
      {
        houseType: "Deluxe Room",
        totalBookings: 4,
        totalAmount: 833
      }
    ],
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
          {isFetchAmrabadDashboardBookingsSummaryDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Bookings Pie Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
                {amrabadDashboardBookingsSummaryData && amrabadDashboardBookingsSummaryData.length > 0 ? (
                  <PackagePieChart
                    data={amrabadDashboardBookingsSummaryData}
                    title="Total Bookings"
                    angleKey="bookingCount"
                    calloutLabelKey="packageName"
                  />
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No booking data available</p>
                  </div>
                )}
              </div>

              {/* Total Amount Bar Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="h-80">
                  {amrabadDashboardBookingsSummaryData && amrabadDashboardBookingsSummaryData.length > 0 ? (
                    <div>
                      <PackageBarChart
                        data={amrabadDashboardBookingsSummaryData}
                        title="Total Amount"
                        valueKey="bookingsTotalAmount"
                        labelKey="packageName"
                        yAxisLabel="Amount in Rupees (₹)"
                      />

                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">No booking data available for bar chart</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
              className={`mt-1 block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2 min-w-[200px]`}
              disabled={!AllPackages || AllPackages.length === 0}
            >
              {!AllPackages || AllPackages.length === 0 ? (
                <option value="">Loading packages...</option>
              ) : (
                AllPackages.map((item) => (
                  <option key={item.packageId} value={item.packageId}>
                    {item.packageName}
                  </option>
                ))
              )}
            </select>
          </div>

          {isFetchPackagesDataByIdLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedPackage && packagesDataById && packagesDataById.perRoomSummary && packagesDataById.perRoomSummary.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Bookings Pie Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
                <HousePieChart
                  data={packagesDataById.perRoomSummary}
                  title="Total Bookings"
                  angleKey="totalBookingAmount"
                  calloutLabelKey="house"
                />
              </div>

              {/* Total Amount Bar Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200 relative">
                {/* Highlight border for the bar chart */}
                <div className="absolute inset-0  rounded-xl pointer-events-none"></div>
                <div className="h-80">
                  <HouseBarChart
                    data={packagesDataById.perRoomSummary}
                    title="Total Amount"
                    valueKey="totalBookingAmount"
                    labelKey="house"
                    yAxisLabel="Amount in ₹"
                  />
                </div>
              </div>
            </div>
          ) : selectedPackage && houseLevelData[selectedPackage] ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Bookings Pie Chart - Fallback to hardcoded data */}
              <div className="bg-[#F8F8F8] rounded-xl p-6 shadow-sm border border-gray-200">
                <HousePieChart
                  data={houseLevelData[selectedPackage]}
                  title="Total Bookings"
                  angleKey="totalBookings"
                  calloutLabelKey="houseType"
                />
              </div>

              {/* Total Amount Bar Chart - Fallback to hardcoded data */}
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
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">
                {selectedPackage ? 'No data available for selected package' : 'Please select a package to view house level data'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Package Level Pie Chart Component using MetroTotalTransactionChart pattern
const PackagePieChart = ({ data, title, angleKey, calloutLabelKey }) => {
  const chartRef = useRef(null);
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
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 25;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${datum[angleKey].toLocaleString('en-US')}`;
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
              const percentage = ((datum[angleKey] / total) * 100);
              return `${datum[angleKey].toLocaleString('en-US')} (${percentage}%)`;
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
              const text = datum[calloutLabelKey] || "";
              const wrapLength = 25;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${datum[angleKey].toLocaleString('en-US')}`;
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
              const percentage = ((datum[angleKey] / total) * 100);
              return `${datum[angleKey].toLocaleString('en-US')} (${percentage}%)`;
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
    if (!chartRef.current || !data || data.length === 0) return;
    


    const options = {
      container: chartRef.current,
      title: {
        text: title,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      },
      series: [{
        data: data,
        type: "bar",
        xKey: labelKey,
        yKey: valueKey,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 1,
        cornerRadius: 4,
        tooltip: {
          renderer: ({ datum, xKey, yKey }) => {
            return {
              title: datum[xKey],
              content: `${yAxisLabel}: ₹${datum[yKey].toLocaleString('en-US')}`
            };
          }
        }
      }],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: 'Packages',
            fontSize: 12,
            color: '#374151'
          },
          label: {
            rotation: 0,
            fontSize: 10,
            color: '#6B7280'
          }
        },
        {
          type: "number",
          position: "left",
          title: {
            text: yAxisLabel,
            fontSize: 12,
            color: '#374151'
          },
          min: 0,
          nice: true,
          label: {
            fontSize: 10,
            color: '#6B7280',
            formatter: (params) => {
              return `₹${params.value.toLocaleString('en-US')}`;
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
        padding: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          }
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
          min: 0,
          nice: true,
          label: {
            fontSize: 10,
            color: '#6B7280',
            formatter: (params) => {
              return `₹${params.value.toLocaleString('en-US')}`;
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