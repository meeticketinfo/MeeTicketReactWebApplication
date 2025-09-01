import React, { useEffect, useState, useRef } from "react";
import AmarabadAvailabilityInnerForm from "./AmarabadAvailabilityInnerForm";
import { useAmarabadAvailabilityReportsStore } from "./store/AmarabadAvailabilityReportsStore";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import { formatToStandardDate } from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { getCurrentDate } from "../../../../utils/TypographyHelper";

// Helper function to get date exactly one month after a given date
const getNextMonthDate = (dateString) => {
  const date = new Date(dateString);
  const nextMonth = new Date(date);
  nextMonth.setMonth(date.getMonth() + 1);
  return nextMonth.toISOString().split("T")[0];
};
import { useNavigate } from "react-router-dom";
import AmarabadAvailabilityOuterForm from "./AmarabadAvailabilityOuterForm";

const AmarabdAvailabilityOuterList = () => {
  const navigate = useNavigate();
  const {
    amrabadAvailabilityOuterReports,
    isFetchAmarabadAvailabilityOuterReportsLoading,
    fetchAmarabadAvailabilityOuterReports,
  } = useAmarabadAvailabilityReportsStore();

  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const [columnDefs, setColumnDefs] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [groupedTotalCount, setGroupedTotalCount] = useState(0);
  const initialLoadDone = useRef(false);

  // Helper function to get saved filters
  const getSavedFilters = () => {
    try {
      const savedFilters = localStorage.getItem(
        "amarabad_availability_form_values"
      );
      return savedFilters ? JSON.parse(savedFilters) : null;
    } catch (error) {
      return null;
    }
  };

  // Initial load effect
  useEffect(() => {
    if (!initialLoadDone.current) {
      const filters = getSavedFilters();
      if (filters) {
        const searchParams = {
          ...filters,
          PageIndex: 1,
          pageSize: PAGE_LIMIT,
        };

        // Determine search type based on saved values
        if (filters.fromDate && filters.toDate) {
          searchParams.startDate = filters.fromDate;
          searchParams.endDate = filters.toDate;
          searchParams.searchType = "dateRange";
        } else if (filters.month && filters.year) {
          searchParams.month = filters.month;
          searchParams.year = filters.year;
          searchParams.searchType = "monthYear";
        }

        fetchAmarabadAvailabilityOuterReports(searchParams);
      } else {
        // If no saved filters, call API with default date range (current date to next month)
        const defaultSearchParams = {
          startDate: getCurrentDate(),
          endDate: getNextMonthDate(getCurrentDate()),
          searchType: "dateRange",
          PageIndex: 1,
          pageSize: PAGE_LIMIT,
        };

        // Save default values to localStorage for consistency
        localStorage.setItem(
          "amarabad_availability_form_values",
          JSON.stringify({
            fromDate: getCurrentDate(),
            toDate: getNextMonthDate(getCurrentDate()),
            month: "",
            year: "",
            lastUpdated: new Date().toISOString(),
          })
        );

        fetchAmarabadAvailabilityOuterReports(defaultSearchParams);
      }
      initialLoadDone.current = true;
    }
  }, [fetchAmarabadAvailabilityOuterReports, PAGE_LIMIT]);

  // Group data by booking date
  const groupDataByDate = (data) => {
    if (!data || data.length === 0) return [];

    const grouped = {};

    data.forEach((item) => {
      const bookingDate = item.bookingDate;
      if (!grouped[bookingDate]) {
        grouped[bookingDate] = {
          bookingDate: bookingDate,
          packages: {},
        };
      }

      const packageId = item.packageId;
      const roomName = item.roomName;

      if (!grouped[bookingDate].packages[packageId]) {
        grouped[bookingDate].packages[packageId] = {
          packageId: packageId,
          packageName: item.packageName,
          rooms: {},
        };
      }

      if (!grouped[bookingDate].packages[packageId].rooms[roomName]) {
        grouped[bookingDate].packages[packageId].rooms[roomName] = {
          roomName: roomName,
          roomId: item.roomId,
          roomsBooked: 0,
          roomsAvailable: 0,
          totalRooms: 0,
        };
      }

      // Aggregate the values
      grouped[bookingDate].packages[packageId].rooms[roomName].roomsBooked +=
        item.roomsBooked || 0;
      grouped[bookingDate].packages[packageId].rooms[roomName].roomsAvailable +=
        item.roomsAvailable || 0;
      grouped[bookingDate].packages[packageId].rooms[roomName].totalRooms +=
        item.totalRooms || 0;
    });

    return Object.values(grouped);
  };

  // Generate dynamic columns based on response data
  const generateDynamicColumns = (data) => {
    const baseColumns = [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
        minWidth: 80,
        maxWidth: 80,
        headerClass: "text-blue-v2",
      },
      {
        field: "bookingDate",
        headerName: "Date",
        flex: 1,
        minWidth: 80,
        maxWidth: 120,
        headerClass: "text-blue-v2",
        valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
      },
    ];

    if (!data || data.length === 0) return baseColumns;

    const packageColumns = [];
    const uniquePackages = [...new Set(data.map((item) => item.packageId))];

    uniquePackages.forEach((packageId) => {
      const packageData = data.find((item) => item.packageId === packageId);
      const packageName = packageData?.packageName || `Package ${packageId}`;

      const packageRooms = data.filter((item) => item.packageId === packageId);
      const uniqueRoomNames = [
        ...new Set(packageRooms.map((room) => room.roomName)),
      ];

      // Create columns for each room type with "Available", "Booked", and "Total" as sub-columns
      const roomColumns = uniqueRoomNames.map((roomName) => ({
        headerName: roomName,
        headerClass: "text-blue-v2 whitespace-normal break-words",
        children: [
          {
            field: `package_${packageId}_room_${roomName}_booked`,
            headerName: "No of houses booked",
            flex: 1,
            minWidth: 120,
            headerClass: "text-blue-v2 whitespace-normal break-words",
            cellRenderer: (params) => {
              const rowData = params.data;
              if (
                rowData &&
                rowData.packages &&
                rowData.packages[packageId] &&
                rowData.packages[packageId].rooms[roomName]
              ) {
                const roomData = rowData.packages[packageId].rooms[roomName];
                const roomsBooked = roomData.roomsBooked || 0;

                return (
                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        color: roomsBooked > 0 ? "#3B82F6" : "inherit",
                        cursor: roomsBooked > 0 ? "pointer" : "default",
                        fontWeight: roomsBooked > 0 ? "600" : "normal",
                      }}
                      onClick={() => {
                        if (roomsBooked > 0) {
                          const filters = getSavedFilters();
                          navigate("/amrabad-availability-inner-report", {
                            state: {
                              bookingDate: rowData.bookingDate,
                              fromDate: filters?.fromDate ?? getCurrentDate(),
                              toDate:
                                filters?.toDate ??
                                getNextMonthDate(getCurrentDate()),
                              packageId: packageId,
                              packageName: packageName,
                              roomId: roomData.roomId,
                              roomName: roomName,
                              roomsBooked: roomsBooked,
                              roomsAvailable: roomData.roomsAvailable || 0,
                              // Pass the outer filters for restoration when returning
                              outerFilters: {
                                fromDate: filters?.fromDate || "",
                                toDate: filters?.toDate || "",
                                month: filters?.month || "",
                                year: filters?.year || "",
                              },
                            },
                          });
                        }
                      }}
                    >
                      {roomsBooked}
                    </span>
                  </div>
                );
              }
              return (
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "inherit" }}>0</span>
                </div>
              );
            },
          },
          {
            field: `package_${packageId}_room_${roomName}_available`,
            headerName: "No of houses available",
            flex: 1,
            minWidth: 120,
            headerClass: "text-blue-v2 whitespace-normal break-words",
            cellRenderer: (params) => {
              const rowData = params.data;
              if (
                rowData &&
                rowData.packages &&
                rowData.packages[packageId] &&
                rowData.packages[packageId].rooms[roomName]
              ) {
                const roomData = rowData.packages[packageId].rooms[roomName];
                const roomsAvailable = roomData.roomsAvailable || 0;

                return (
                  <div style={{ textAlign: "center" }}>
                    <span style={{ color: "inherit" }}>{roomsAvailable}</span>
                  </div>
                );
              }
              return (
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "inherit" }}>0</span>
                </div>
              );
            },
          },
          {
            field: `package_${packageId}_room_${roomName}_total`,
            headerName: "Total houses",
            flex: 1,
            minWidth: 120,
            headerClass: "text-blue-v2 whitespace-normal break-words",
            cellRenderer: (params) => {
              const rowData = params.data;
              if (
                rowData &&
                rowData.packages &&
                rowData.packages[packageId] &&
                rowData.packages[packageId].rooms[roomName]
              ) {
                const roomData = rowData.packages[packageId].rooms[roomName];
                const totalRooms = roomData.totalRooms || 0;

                return (
                  <div style={{ textAlign: "center" }}>
                    <span>{totalRooms}</span>
                  </div>
                );
              }
              return (
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "inherit" }}>0</span>
                </div>
              );
            },
          },
        ],
      }));

      packageColumns.push({
        headerName: packageName,
        headerClass: "text-blue-v2 font-bold",
        children: roomColumns,
      });
    });

    return [...baseColumns, ...packageColumns];
  };

  // Update columns when data changes
  useEffect(() => {
    if (
      amrabadAvailabilityOuterReports?.data &&
      amrabadAvailabilityOuterReports?.data.length > 0
    ) {
      const columns = generateDynamicColumns(
        amrabadAvailabilityOuterReports?.data
      );
      setColumnDefs(columns);

      // Group the data by date
      const grouped = groupDataByDate(amrabadAvailabilityOuterReports?.data);
      setGroupedData(grouped);

      // Calculate total count based on grouped data (unique booking dates)
      setGroupedTotalCount(grouped.length);
    } else {
      // Set default columns when no data
      const columns = generateDynamicColumns([]);
      setColumnDefs(columns);
      setGroupedData([]);
      setGroupedTotalCount(0);
    }
  }, [amrabadAvailabilityOuterReports, currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    const newPage = selectedItem.selected;
    setCurrentPage(newPage);

    // Call the API with the new page
    const filters = getSavedFilters();

    if (filters) {
      const searchParams = {
        ...filters,
        PageIndex: newPage + 1, // API expects 1-based indexing
        pageSize: PAGE_LIMIT,
      };

      // Determine search type based on saved values
      if (filters.fromDate && filters.toDate) {
        searchParams.startDate = filters.fromDate;
        searchParams.endDate = filters.toDate;
        searchParams.searchType = "dateRange";
      } else if (filters.month && filters.year) {
        searchParams.month = filters.month;
        searchParams.year = filters.year;
        searchParams.searchType = "monthYear";
      }
      fetchAmarabadAvailabilityOuterReports(searchParams);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPAGE_LIMIT(newPageSize);
    setCurrentPage(0); // Reset to first page when page size changes

    // Call the API with the new page size
    const filters = getSavedFilters();
    if (filters) {
      const searchParams = {
        ...filters,
        PageIndex: 1, // Reset to first page
        pageSize: newPageSize,
      };

      // Determine search type based on saved values
      if (filters.fromDate && filters.toDate) {
        searchParams.startDate = filters.fromDate;
        searchParams.endDate = filters.toDate;
        searchParams.searchType = "dateRange";
      } else if (filters.month && filters.year) {
        searchParams.month = filters.month;
        searchParams.year = filters.year;
        searchParams.searchType = "monthYear";
      }

      fetchAmarabadAvailabilityOuterReports(searchParams);
    }
  };

  // Create a key for the form to force re-render when filters change
  const formKey = JSON.stringify(getSavedFilters() || {});

  return (
    <div>
      <AmarabadAvailabilityOuterForm
        key={formKey}
        PageIndex={currentPage + 1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={setCurrentPage}
      />
      <div className="mt-10">
        <AgGridTable
          ExportName="Availability Outer Report"
          rowData={groupedData || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAmarabadAvailabilityOuterReportsLoading}
          isPagination={false}
          tableHeight={(groupedData?.length || 0) > 10 ? 560 : 330}
          IsReactPaginate={true}
          setPageLimit={handlePageSizeChange}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          SetcurrentPage={setCurrentPage}
          totalCount={amrabadAvailabilityOuterReports.totalCount || 0}
          showTotalCount={true}
          showSearch={false}
        />
      </div>
    </div>
  );
};

export default AmarabdAvailabilityOuterList;
