import React, { useState, useEffect, useRef } from "react";
import { AgCharts } from "ag-charts-enterprise";
import { useAmrabadDashboardStore } from "./store/amarabadDashboardStore";
import { usePackagesStore } from "../../../store/amrabad/masters/packagesStore";

const GraphicalRepresentationDashboard = () => {
  const [activeTab, setActiveTab] = useState("package");
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedPackageForPackageLevel, setSelectedPackageForPackageLevel] =
    useState("all");
  const [selectedDataField, setSelectedDataField] =
    useState("totalBookingItems");
  const [selectedFieldValue, setSelectedFieldValue] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [selectedHouseDataField, setSelectedHouseDataField] = useState("totalBookingItems");
  const {
    isFetchAmrabadDashboardBookingsSummaryDataLoading,
    amrabadDashboardBookingsFullSummaryData,
  } = useAmrabadDashboardStore();

  const { AllPackages, getPackages, AllHouses, getHouses } = usePackagesStore();
  const {
    fetchPackagesDataById,
  } = useAmrabadDashboardStore();
  const combinePackageData = (data, groupByKey = "packageName") => {
    if (!data || !Array.isArray(data)) return [];
    const combinedMap = new Map();

    data.forEach((item) => {
      const key = item[groupByKey];
      if (!key) {
        return;
      }

      if (combinedMap.has(key)) {
        const existing = combinedMap.get(key);
        Object.keys(item).forEach((prop) => {
          if (typeof item[prop] === "number") {
            existing[prop] = (existing[prop] || 0) + item[prop];
          }
        });
      } else {
        combinedMap.set(key, { ...item });
      }
    });

    const result = Array.from(combinedMap.values());
    return result;
  };

  // Helper function to combine room data for house level
  const combineRoomData = (data, groupByKey = "roomName") => {
    if (!data || !Array.isArray(data)) return [];
    const combinedMap = new Map();

    data.forEach((item) => {
      const key = item[groupByKey];
      if (!key) {
        return;
      }

      if (combinedMap.has(key)) {
        // Combine numeric values for duplicate room keys
        const existing = combinedMap.get(key);
        Object.keys(item).forEach((prop) => {
          if (typeof item[prop] === "number") {
            existing[prop] = (existing[prop] || 0) + item[prop];
          }
        });
      } else {
        combinedMap.set(key, { ...item });
      }
    });

    const result = Array.from(combinedMap.values());
    return result;
  };
  const filterDataByPackage = (data, packageId) => {
    if (!data || !Array.isArray(data) || !packageId) return data;
    if (packageId === "all") return data;
    return data.filter((item) => item.packageId === parseInt(packageId));
  };

  const filterDataByHouse = (data, roomId) => {
    if (!data || !Array.isArray(data) || !roomId) return data;
    if (roomId === "all") return data;
    return data.filter((item) => item.roomId === parseInt(roomId));
  };
  const filterDataByFieldValue = (data, fieldName, fieldValue) => {
    if (!data || !Array.isArray(data) || !fieldName || !fieldValue) return data;
    if (fieldValue === "all") return data;
    return data.filter((item) => {
      const itemValue = item[fieldName];
      if (typeof itemValue === "number") {
        return itemValue === parseFloat(fieldValue);
      }
      return itemValue === fieldValue;
    });
  };

  const getDataFieldOptions = () => {
    if (
      !amrabadDashboardBookingsFullSummaryData?.detailed ||
      amrabadDashboardBookingsFullSummaryData.detailed.length === 0
    ) {
      return [];
    }

    const sampleItem = amrabadDashboardBookingsFullSummaryData.detailed[0];
    const numericFields = Object.keys(sampleItem).filter(
      (key) =>
        typeof sampleItem[key] === "number" &&
        key !== "packageId" &&
        key !== "roomId"
    );
    const options = numericFields.map((field) => ({
      value: field,
      label: field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
    }));
    return options.sort((a, b) => {
      // Put totalBookingItems first
      if (a.value === "totalBookingItems") return -1;
      if (b.value === "totalBookingItems") return 1;
      return a.label.localeCompare(b.label);
    });
  };
  useEffect(() => {
    getPackages();
  }, [getPackages]);
  useEffect(() => {
    if (AllPackages && AllPackages.length > 0) {
      if (!selectedPackage || selectedPackage === "") {
        setSelectedPackage("all");
      }
      if (!selectedPackageForPackageLevel) {
        setSelectedPackageForPackageLevel("all");
      }
    }
  }, [AllPackages, selectedPackage, selectedPackageForPackageLevel]);
  useEffect(() => {
    if (selectedPackage && selectedPackage !== "all") {
      fetchPackagesDataById(selectedPackage);
      getHouses(selectedPackage);
      setSelectedHouse("all");
    } else if (selectedPackage === "all") {
      setSelectedHouse("all");
    }
    setSelectedHouseDataField("totalBookingItems");
  }, [selectedPackage, fetchPackagesDataById, getHouses]);
  useEffect(() => {
    setSelectedFieldValue("all");
  }, [selectedDataField]);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 max-h-full overflow-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl text-gray-800 mt-2 font-semibold">Graphical Representation</h3>
      </div>

      {/* Tab Navigation */}
      <div className="relative mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row">
          <button
            onClick={() => setActiveTab("package")}
            className={`px-4 sm:px-6 py-3 sm:py-3 text-sm font-medium transition-colors relative w-full sm:w-auto touch-manipulation active:scale-95 ${
              activeTab === "package"
                ? "text-blue-700 border-b-2 border-b-blue-700 bg-blue-50 sm:bg-transparent"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 sm:hover:bg-transparent"
            }`}
          >
            Package Level
          </button>
          <button
            onClick={() => setActiveTab("house")}
            className={`px-4 sm:px-6 py-3 sm:py-3 text-sm font-medium transition-colors relative w-full sm:w-auto touch-manipulation active:scale-95 ${
              activeTab === "house"
                ? "text-blue-700 border-b-2 border-b-blue-700 bg-blue-50 sm:bg-transparent"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 sm:hover:bg-transparent"
            }`}
          >
            Houses Level
          </button>
        </div>
        {/* Half line under tabs */}
        <div className="w-1/2 h-px bg-gray-300 mt-0 hidden sm:block"></div>
      </div>

      {/* Package Level Content */}
      {activeTab === "package" && (
        <div className="space-y-6">
          {/* Package Selection for Package Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package
              </label>
              <select
                value={selectedPackageForPackageLevel}
                onChange={(e) =>
                  setSelectedPackageForPackageLevel(e.target.value)
                }
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2.5 sm:py-2 touch-manipulation`}
                disabled={!AllPackages || AllPackages.length === 0}
              >
                {!AllPackages || AllPackages.length === 0 ? (
                  <option value="">Loading packages...</option>
                ) : (
                  <>
                    <option value="all">All Packages</option>
                    {AllPackages.map((item) => (
                      <option key={item.packageId} value={item.packageId}>
                        {item.packageName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Field
              </label>
              <select
                value={selectedDataField}
                onChange={(e) => setSelectedDataField(e.target.value)}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2.5 sm:py-2 touch-manipulation`}
                disabled={
                  !amrabadDashboardBookingsFullSummaryData?.detailed ||
                  amrabadDashboardBookingsFullSummaryData.detailed.length === 0
                }
              >
                {!amrabadDashboardBookingsFullSummaryData?.detailed ||
                amrabadDashboardBookingsFullSummaryData.detailed.length ===
                  0 ? (
                  <option value="">Loading data fields...</option>
                ) : (
                  getDataFieldOptions().map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {isFetchAmrabadDashboardBookingsSummaryDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Package vs Room Analysis */}
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Package Level Pie Chart */}
                <div className="bg-[#F8F8F8] rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 overflow-hidden">
                  {amrabadDashboardBookingsFullSummaryData?.detailed &&
                  amrabadDashboardBookingsFullSummaryData.detailed.length >
                    0 ? (
                    <DetailedPackagePieChart
                      data={combinePackageData(
                        filterDataByFieldValue(
                          filterDataByPackage(
                            amrabadDashboardBookingsFullSummaryData.detailed,
                            selectedPackageForPackageLevel
                          ),
                          selectedDataField,
                          selectedFieldValue
                        ),
                        "packageName"
                      )}
                      title={`Package Distribution by ${selectedDataField
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}`}
                      angleKey={selectedDataField}
                      calloutLabelKey="packageName"
                    />
                  ) : (
                    <div className="flex justify-center items-center h-48 sm:h-64">
                      <p className="text-gray-500 text-sm sm:text-base">
                        No detailed data available
                      </p>
                    </div>
                  )}
                </div>

                {/* Room Level Bar Chart */}
                <div className="bg-[#F8F8F8] rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-64 sm:h-72 lg:h-80">
                    {amrabadDashboardBookingsFullSummaryData?.detailed &&
                    amrabadDashboardBookingsFullSummaryData.detailed.length >
                      0 ? (
                      (() => {
                        const filteredByPackage = filterDataByPackage(
                          amrabadDashboardBookingsFullSummaryData.detailed,
                          selectedPackageForPackageLevel
                        );
                        const filteredByField = filterDataByFieldValue(
                          filteredByPackage,
                          selectedDataField,
                          selectedFieldValue
                        );
                        const combinedData = combinePackageData(
                          filteredByField,
                          "packageName"
                        );
                        
                        // Ensure all packages are shown by filling missing ones with zero values
                        let finalData = [...combinedData];
                        if (AllPackages && AllPackages.length > 0) {
                          const existingPackageNames = new Set(combinedData.map(item => item.packageName));
                          const missingPackages = AllPackages.filter(pkg => !existingPackageNames.has(pkg.packageName));
                          
                          if (missingPackages.length > 0) {
                            const missingData = missingPackages.map(pkg => ({
                              packageName: pkg.packageName,
                              [selectedDataField]: 0,
                              packageId: pkg.packageId
                            }));
                            finalData = [...combinedData, ...missingData];
                          }
                        }
                        return (
                          <DetailedRoomBarChart
                            data={finalData}
                            title={`Package Analysis by ${selectedDataField
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}`}
                            valueKey={selectedDataField}
                            labelKey="packageName"
                            yAxisLabel={selectedDataField
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          />
                        );
                      })()
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500 text-sm sm:text-base">
                          No detailed data available for package chart
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* House Level Content */}
      {activeTab === "house" && (
        <div className="space-y-6">
          {/* Package, House, and Data Field Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2.5 sm:py-2 touch-manipulation`}
                disabled={!AllPackages || AllPackages.length === 0}
              >
                {!AllPackages || AllPackages.length === 0 ? (
                  <option value="">Loading packages...</option>
                ) : (
                  <>
                    <option value="all">All Packages</option>
                    {AllPackages.map((item) => (
                      <option key={item.packageId} value={item.packageId}>
                        {item.packageName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select House
              </label>
              <select
                value={selectedHouse}
                onChange={(e) => setSelectedHouse(e.target.value)}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2.5 sm:py-2 touch-manipulation`}
                disabled={selectedPackage === "all" || !AllHouses || AllHouses.length === 0}
              >
                {selectedPackage === "all" ? (
                  <option value="">All packages selected - showing all houses</option>
                ) : !AllHouses || AllHouses.length === 0 ? (
                  <option value="">Loading houses...</option>
                ) : (
                  <>
                    <option value="all">All Houses</option>
                    {AllHouses.map((item) => (
                      <option key={item.roomId} value={item.roomId}>
                        {item.roomName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Field
              </label>
              <select
                value={selectedHouseDataField}
                onChange={(e) => setSelectedHouseDataField(e.target.value)}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm px-3 py-2.5 sm:py-2 touch-manipulation`}
                disabled={
                  !amrabadDashboardBookingsFullSummaryData?.detailed ||
                  amrabadDashboardBookingsFullSummaryData.detailed.length === 0
                }
              >
                {!amrabadDashboardBookingsFullSummaryData?.detailed ||
                amrabadDashboardBookingsFullSummaryData.detailed.length ===
                  0 ? (
                  <option value="">Loading data fields...</option>
                ) : (
                  getDataFieldOptions().map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {isFetchAmrabadDashboardBookingsSummaryDataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          ) : amrabadDashboardBookingsFullSummaryData?.detailed &&
            amrabadDashboardBookingsFullSummaryData.detailed.length > 0 ? (
              <div className="flex flex-col gap-4 sm:gap-6">
              {/* Package Level Pie Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 overflow-hidden">
                <HousePieChart
                  data={combineRoomData(
                    selectedPackage === "all" 
                      ? amrabadDashboardBookingsFullSummaryData.detailed
                      : filterDataByHouse(
                          filterDataByPackage(
                            amrabadDashboardBookingsFullSummaryData.detailed,
                            selectedPackage
                          ),
                          selectedHouse
                        ),
                    "roomName"
                  )}
                  title={`House Distribution by ${selectedHouseDataField
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}`}
                  angleKey={selectedHouseDataField}
                  calloutLabelKey="roomName"
                />
              </div>

              {/* Total Amount Bar Chart */}
              <div className="bg-[#F8F8F8] rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"></div>
                <div className="h-64 sm:h-72 lg:h-80">
                  <HouseBarChart
                    data={combineRoomData(
                      selectedPackage === "all" 
                        ? amrabadDashboardBookingsFullSummaryData.detailed
                        : filterDataByHouse(
                            filterDataByPackage(
                              amrabadDashboardBookingsFullSummaryData.detailed,
                              selectedPackage
                            ),
                            selectedHouse
                          ),
                      "roomName"
                    )}
                    title={`House Distribution by ${selectedHouseDataField
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}`}
                    valueKey={selectedHouseDataField}
                    labelKey="roomName"
                    yAxisLabel={selectedHouseDataField === "totalAmount" ? "Amount in ₹" : "Count"}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">
                {selectedPackage === "all"
                  ? "No data available for all packages"
                  : selectedPackage
                  ? "No data available for selected package"
                  : "Please select a package to view house level data"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// House Level Pie Chart Component using MetroTotalTransactionChart pattern
const HousePieChart = ({ data, title, angleKey, calloutLabelKey }) => {
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
            fontSize: window.innerWidth < 640 ? 8 : 10,
            color: "black",
            maxWidth: window.innerWidth < 640 ? 100 : 150,
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const text = datum[calloutLabelKey] || "";
              const wrapLength = window.innerWidth < 640 ? 15 : 20;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${datum[angleKey] || 0}`;
            },
            offset: window.innerWidth < 640 ? 10 : 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: window.innerWidth < 640 ? 8 : 10,
            fontWeight: "bold",
            color: "#000",
            formatter: ({ datum, angleKey }) => {
              const total = data.reduce((sum, item) => sum + item[angleKey], 0);
              const percentage = (datum[angleKey] / total) * 100;
              return `${datum[angleKey].toLocaleString(
                "en-US"
              )} (${percentage}%)`;
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
    <div className="gap-4 sm:gap-6 lg:gap-8 w-full">
      <div className="flex flex-row gap-2 items-center justify-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-medium text-center">{title}</h2>
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6 items-start">
        {/* Pie Chart */}
        <div className="flex justify-center flex-1 w-full lg:w-auto">
          <div ref={chartRef} className="w-full max-w-sm sm:max-w-md lg:max-w-lg" />
        </div>

        {/* Legend/List View Toggle */}
        <div className="flex-1 w-full lg:max-w-sm xl:max-w-md">
          <div className="flex justify-center mb-3">
            <div className="flex bg-gray-100 rounded-lg p-1"></div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="border border-[#B7B7B7] rounded-lg overflow-hidden min-w-[280px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#D9E4FF]">
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2 text-[#205375] font-semibold text-xs sm:text-sm">
                      Rooms
                    </th>
                    <th className="text-right px-2 sm:px-3 md:px-4 py-2 text-[#205375] font-semibold text-xs sm:text-sm">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 sm:px-3 md:px-4 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                        <div className="flex items-start gap-1 sm:gap-2">
                          <div
                            className="w-2 sm:w-3 h-2 sm:h-3 rounded-full shrink-0 mt-1"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <div className="text-[#000] text-xs sm:text-sm break-words max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] leading-tight">
                            {item[calloutLabelKey]}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 text-right border border-b-[#B7B7B7]">
                        <span className="text-[#4A90E2] font-semibold text-xs sm:text-sm">
                          {item[angleKey]?.toLocaleString("en-US") || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
        fontWeight: "bold",
      },
      padding: {
        top: 20,
        right: 20,
        bottom: 80,
        left: 60,
      },
      series: [
        {
          data: data,
          type: "bar",
          xKey: labelKey,
          yKey: valueKey,
          fill: "#3B82F6",
          stroke: "#1E40AF",
          strokeWidth: 1,
          cornerRadius: 4,
          minBarHeight: 2, // Ensure minimum height for small values
          shadow: {
            enabled: true,
            color: "rgba(0, 0, 0, 0.1)",
            offset: [2, 2],
            blur: 4,
          },
          highlightStyle: {
            fill: "#60A5FA",
            stroke: "#3B82F6",
            strokeWidth: 2,
          },
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => {
              const value = datum[yKey] || 0;
              return {
                title: datum[xKey] || "Room",
                content: `${yKey}: ${value.toLocaleString("en-US")}`,
              };
            },
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: {
            text: "Room",
            fontSize: 12,
          },
          label: {
            rotation: -45,
            fontSize: 10,
            maxWidth: 120,
            formatter: ({ value }) => {
                // Truncate long room names and add ellipsis if needed
                if (value && value.length > 15) {
                  return value.substring(0, 15) + "...";
                }
              return value;
            },
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: yAxisLabel,
            fontSize: 12,
          },
          min: 0,
          nice: true,
          label: {
            fontSize: 10,
            color: "#6B7280",
            formatter: ({ datum, value }) => {
              return value?.toLocaleString("en-US") || "0";
            },
          },
        },
      ],
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        class: "ag-chart-tooltip",
        tracking: true,
        delay: 0,
        hideDelay: 200,
        position: {
          type: "pointer",
          xOffset: 10,
          yOffset: 10,
        },
        formatter: ({ datum, xKey, yKey }) => {
          const value = datum[yKey] || 0;
          return {
            title: datum[xKey] || "Room",
            content: `${yKey}: ${value.toLocaleString("en-US")}`,
          };
        },
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

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

// Detailed Analysis Chart Components

// Detailed Package Pie Chart Component
const DetailedPackagePieChart = ({
  data,
  title,
  angleKey,
  calloutLabelKey,
}) => {
  const chartRef = useRef(null);
  const colors = ["#4A90E2", "#002147", "#5A6F8F", "#205375", "#D9E4FF"];

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

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
            fontSize: window.innerWidth < 640 ? 8 : 10,
            color: "black",
            maxWidth: window.innerWidth < 640 ? 100 : 120,
            formatter: ({ datum, angleKey, calloutLabelKey }) => {
              const text = datum[calloutLabelKey] || "";
              const wrapLength = window.innerWidth < 640 ? 15 : 20;
              const wrappedText = text.replace(
                new RegExp(`(.{1,${wrapLength}})(\\s|$)`, "g"),
                "$1\n"
              );
              return `${wrappedText.trim()}\n${datum[angleKey] || 0}`;
            },
            offset: window.innerWidth < 640 ? 10 : 15,
            minAngle: 0,
          },
          sectorLabel: {
            enabled: true,
            fontSize: window.innerWidth < 640 ? 7 : 9,
            fontWeight: "bold",
            color: "#000",
            formatter: ({ datum, angleKey }) => {
              const total = data.reduce(
                (sum, item) => sum + (item[angleKey] || 0),
                0
              );
              const percentage =
                total > 0
                  ? Math.round(((datum[angleKey] || 0) / total) * 100)
                  : 0;
              return `${datum[angleKey] || 0} (${percentage}%)`;
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
    <div className="gap-4 sm:gap-6 lg:gap-8 w-full">
      <div className="flex flex-row gap-2 items-center justify-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-medium text-center">{title}</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between">
        {/* Pie Chart */}
        <div className="w-full lg:flex-1 lg:w-[60%] xl:w-[70%]">
          <div ref={chartRef} className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto" />
        </div>

        {/* Legend/List View Toggle */}
        <div className="w-full lg:max-w-sm xl:max-w-md">
          <div className="w-full overflow-x-auto">
            <div className="border border-[#B7B7B7] rounded-lg overflow-hidden min-w-[280px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#D9E4FF]">
                    <th className="text-left px-2 sm:px-3 md:px-4 py-2 text-[#205375] font-semibold text-xs sm:text-sm">
                      Packages
                    </th>
                    <th className="text-right px-2 sm:px-3 md:px-4 py-2 text-[#205375] font-semibold text-xs sm:text-sm">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 sm:px-3 md:px-4 py-2 border border-b-[#B7B7B7] border-r-[#B7B7B7]">
                        <div className="flex items-start gap-1 sm:gap-2">
                          <div
                            className="w-2 sm:w-3 h-2 sm:h-3 rounded-full shrink-0 mt-1"
                            style={{
                              backgroundColor: colors[index % colors.length],
                            }}
                          />
                          <div className="text-[#000] text-xs sm:text-sm break-words max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] leading-tight">
                            {item[calloutLabelKey]}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 md:px-4 py-2 text-right border border-b-[#B7B7B7]">
                        <span className="text-[#4A90E2] font-semibold text-xs sm:text-sm">
                          {item[angleKey]?.toLocaleString("en-US") || 0}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed Room Bar Chart Component
const DetailedRoomBarChart = ({
  data,
  title,
  valueKey,
  labelKey,
  yAxisLabel,
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    const sortedData = [...data].sort((a, b) => {
      const nameA = a[labelKey] || '';
      const nameB = b[labelKey] || '';
      return nameA.localeCompare(nameB);
    });
    const options = {
      container: chartRef.current,
      title: {
        text: title,
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
      },
      series: [
        {
          data: sortedData,
          type: "bar",
          xKey: labelKey, // Use labelKey for X-axis (package names)
          yKey: valueKey, // Use valueKey for Y-axis (values)
          fill: "#007aff",
          stroke: "#007aff",
          strokeWidth: 1,
          cornerRadius: 4,
          minBarHeight: 2, // Ensure minimum height for small values
          highlightStyle: {
            fill: "#4A90E2",
            stroke: "#007aff",
            strokeWidth: 2,
          },
          tooltip: {
            enabled: true,
            class: "ag-chart-tooltip",
            tracking: true,
            delay: 0,
            hideDelay: 200,
            renderer: ({ datum, xKey, yKey }) => {
              const value = datum[yKey] || 0;
              return {
                title: datum[xKey] || "Package", // Package name
                content: `${yAxisLabel}: ${value.toLocaleString("en-US")}`, // Value with proper formatting
              };
            },
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom", // X-axis at bottom for package names
          title: {
            text: labelKey === "packageName" ? "Packages" : "Rooms",
            fontSize: 12,
            color: "#374151",
          },
          label: {
            rotation: -45, // Diagonal labels for better visibility
            fontSize: 10,
            color: "#6B7280",
            maxWidth: 120,
            formatter: ({ value }) => {
              // Truncate long names and add ellipsis if needed
              if (value && value.length > 15) {
                return value.substring(0, 15) + "...";
              }
              return value;
            },
          },
        },
        {
          type: "number",
          position: "left", // Y-axis at left for values
          title: {
            text: yAxisLabel,
            fontSize: 12,
            color: "#374151",
          },
          min: 0,
          nice: true,
          label: {
            fontSize: 10,
            color: "#6B7280",
          },
        },
      ],
      legend: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        class: "ag-chart-tooltip",
        tracking: true,
        delay: 0,
        hideDelay: 200,
        position: {
          type: "pointer",
          xOffset: 10,
          yOffset: 10,
        },
      },
      background: {
        fill: "transparent",
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 80, // Increased bottom padding for diagonal labels
        left: 10, // Normal left padding since we're using vertical bars
      },
    };
    const chart = AgCharts.create(options);

    return () => {
      chart.destroy();
    };
  }, [data, title, valueKey, labelKey, yAxisLabel]);

  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: "100%", 
        height: "100%"
      }} 
    />
  );
};

export default GraphicalRepresentationDashboard;
