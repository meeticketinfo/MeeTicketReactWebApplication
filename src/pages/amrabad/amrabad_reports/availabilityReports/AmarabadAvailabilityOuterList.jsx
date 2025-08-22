import React, { useEffect, useState } from "react";
import AmarabadAvailabilityInnerForm from "./AmarabadAvailabilityInnerForm";
import { useAmarabadAvailabilityReportsStore } from "./store/AmarabadAvailabilityReportsStore";
import { usePackagesStore } from "../../../../store/amrabad/masters/packagesStore";
import {
  formatToCurrency,
  formatToStandardDate,
} from "../../../../utils/TypographyHelper";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { NavLink, useNavigate } from "react-router-dom";
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

  const savedFilters = JSON.parse(
    localStorage.getItem("amarabad_availability_filters")
  );

  // Calculate next month date for default to date
  const getNextMonthDate = () => {
    const currentDate = new Date();
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split("T")[0];
  };

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
            headerName: "No of rooms booked",
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
                        fontWeight: roomsBooked > 0 ? "bold" : "normal",
                      }}
                      onClick={() => {
                        if (roomsBooked > 0) {
                          navigate("/amrabad-availability-inner-report", {
                            state: {
                              bookingDate: rowData.bookingDate,
                              fromDate:
                                savedFilters?.fromDate ?? getCurrentDate(),
                              toDate:
                                savedFilters?.toDate ?? getNextMonthDate(),
                              packageId: packageId,
                              packageName: packageName,
                              roomId: roomData.roomId,
                              roomName: roomName,
                              roomsBooked: roomsBooked,
                              roomsAvailable: roomData.roomsAvailable || 0,
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
            headerName: "No of rooms available",
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
            headerName: "Total rooms",
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
                    <span
                    >
                      {totalRooms}
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

  useEffect(() => {
    // Load saved filters and make initial API call
    const loadSavedFiltersAndFetch = () => {
      const savedFilters = JSON.parse(
        localStorage.getItem("amarabad_availability_filters")
      );

      if (savedFilters) {
        fetchAmarabadAvailabilityOuterReports({
          startDate: savedFilters.fromDate || getCurrentDate(),
          endDate: savedFilters.toDate || getNextMonthDate(),
          month: savedFilters.month || "",
          year: savedFilters.year || "",
         PageIndex: currentPage + 1,
          pageSize: PAGE_LIMIT,
        });
      } else {
        // Use default values if no saved filters
        fetchAmarabadAvailabilityOuterReports({
          startDate: getCurrentDate(),
          endDate: getNextMonthDate(),
          month: "",
          year: "",
         PageIndex: currentPage + 1,
          pageSize: PAGE_LIMIT,
        });
      }
    };

    // loadSavedFiltersAndFetch();
  }, [currentPage, PAGE_LIMIT]); // Only run once when component mounts

  useEffect(() => {
    // Only fetch when page changes, not when filters change
    if (savedFilters) {
      fetchAmarabadAvailabilityOuterReports({
        startDate: savedFilters.fromDate ?? getCurrentDate(),
        endDate: savedFilters.toDate ?? getNextMonthDate(),
        month: savedFilters.month ?? "",
        year: savedFilters.year ?? "",
        PageIndex: currentPage + 1,
        pageSize: PAGE_LIMIT,
      });
    }
  }, [currentPage, PAGE_LIMIT]);

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div>
      <AmarabadAvailabilityOuterForm
        PageIndex={1}
        pageSize={PAGE_LIMIT}
        SetcurrentPage={(page) => {
          // Reset to page 0 when filters change
          setCurrentPage(page);
        }}
        fromDate={savedFilters?.fromDate}
        toDate={savedFilters?.toDate}
        month={savedFilters?.month}
        year={savedFilters?.year}
        onFiltersChange={() => setCurrentPage(0)}
      />
      <div>
        <AgGridTable
          ExportName="Availability Outer Report"
          rowData={groupedData || []}
          columnDefs={columnDefs}
          isFetchLoading={isFetchAmarabadAvailabilityOuterReportsLoading}
          isPagination={false}
          tableHeight={(groupedData?.length || 0) > 10 ? 560 : 330}
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
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
