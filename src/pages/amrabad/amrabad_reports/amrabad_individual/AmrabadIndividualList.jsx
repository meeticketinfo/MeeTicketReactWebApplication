import { useEffect, useState, useMemo, useCallback } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import {
  formatToCurrency,
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import { useDashboardStore } from "../../../../store/dashboard/dashboardStore";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { useAmrabadConsolidatedStore } from "../../../../store/amrabad/reports/ConsolidatedStore";
import AmrabadIndividualForm from "./AmrabadIndividualForm";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import { useAmrabadHouseWiseReportStore } from "./store/amarabadHouseWiseReportStore";

export default function AdminBookings() {
  const { fetchAmrabadIndividualReports, allAmrabadIndividualReports ,isAmrabadIndividualReportsLoading} =
    useAmrabadConsolidatedStore();
  const { allAmrabadHouseWiseReports, fetchAllAmrabadHouseWiseReports, isFetchAllAmrabadHouseWiseReportsLoading, totalCount } = useAmrabadHouseWiseReportStore();
  
  const savedFilters = JSON.parse(
    localStorage.getItem("amrabad-individual-report-filters")
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  useEffect(() => {
    fetchAllAmrabadHouseWiseReports({
      startDate: savedFilters?.fromDate ?? getCurrentDate(),
      endDate: savedFilters?.toDate ?? getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking ?? "Purchase",
      package: savedFilters?.package ? savedFilters.package : "",
      houses: savedFilters?.houses ? savedFilters.houses : "",
      orderId: savedFilters?.orderId ? savedFilters.orderId : "",
      paymentStatus: savedFilters?.paymentStatus ? savedFilters.paymentStatus : "",
      modeOfBooking: savedFilters?.modeOfBooking ? savedFilters.modeOfBooking : "",
      PageIndex: currentPage + 1, // convert zero-indexed to 1-indexed
      pageSize: PAGE_LIMIT,
    });
  }, [currentPage, PAGE_LIMIT]);

  const handleViewTicket = (ticketData) => {
    setSelectedTicketData(ticketData);
    setIsTicketModalOpen(true);
  };

  const handleCloseTicketModal = () => {
    setIsTicketModalOpen(false);
    setSelectedTicketData(null);
  };

  const columnDefs = useMemo(() => [
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: (params) => {
        // Calculate serial number based on current page and row position
        const serialNumber = currentPage * PAGE_LIMIT + params.node.rowIndex + 1;
        return serialNumber;
      },
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionID",
      headerName: "Transaction Id",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      minWidth: 150,
      maxWidth: 150,
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "userName",
      headerName: "User Name",
      // flex: 1,
      minWidth: 150,
      maxWidth: 150,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "packageName",
      headerName: "Package Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "houseName",
      headerName: "House Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "noofHouses",
      headerName: "No.of houses", 
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "purchasedDate",
      headerName: "Purchased Date",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "fromDate",
      headerName: "From Date",
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    
    {
      field: "toDate",
      headerName: "To Date",
      minWidth: 120,
      maxWidth: 120,
      // flex: 1,
      headerClass: "text-blue-v2",
      // valueFormatter: (params) => params.value || "0",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "actualAmount",
      headerName: "Actual Amount",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "discountApplicable",
      headerName: "Discount Applicable",
      minWidth: 160,
      maxWidth: 160,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "totalAmount",
      headerName: "Amount Paid (House Wise)",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      minWidth: 130,
      maxWidth: 130,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "modeofPayment",
      headerName: "Mode of Payment",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "modeofBooking",
      headerName: "Mode of Booking",
      minWidth: 150,
      maxWidth: 150,
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "orderId",
      headerName: "Order ID",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "200px" }}>
            <NavLink
              end
              to={`/amrabad-admin/ticket-view-details/${params.data.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 text-blue-v2 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm"
            >
              <span>View Ticket</span>
            </NavLink>
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
      width: 200,
    },
  ], [currentPage, PAGE_LIMIT]);
  const handlePageClick = useCallback((selectedItem) => {
    setCurrentPage(selectedItem.selected);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div>
          <AmrabadIndividualForm
            PageIndex={1}
            pageSize={PAGE_LIMIT}
            SetcurrentPage={setCurrentPage}
          />
        </div>

        <AgGridTable
          key={`ag-grid-${currentPage}-${PAGE_LIMIT}`}
          ExportName="House Wise Details"
          rowData={allAmrabadHouseWiseReports || []}
          getRowId={(params) => `${currentPage}-${params.data?.orderId || params.node.rowIndex}`}
          columnDefs={columnDefs}
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          suppressAnimationFrame={false}
          isFetchLoading={isFetchAllAmrabadHouseWiseReportsLoading}
          isPagination={false}
          tableHeight={
            (allAmrabadHouseWiseReports?.length || 0) > 10 ? 560 : 330
          }
          IsReactPaginate={true}
          setPageLimit={setPAGE_LIMIT}
          pageLimit={PAGE_LIMIT}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          totalCount={totalCount || 0}
          showTotalCount={true}
          SetcurrentPage={setCurrentPage}
          showSearch={false}
        />
      </div>
      <PopupModal
        popupModalId="ticket-details-modal"
        isOpen={isTicketModalOpen}
        onClose={handleCloseTicketModal}
        title="Ticket Details"
        size="Extralarge"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={false}
        overFlow={false}
      >
        {selectedTicketData && (
          <div className="font-manrope overflow-auto bg-gray-100 px-2 sm:px-4 py-2 sm:py-4">
            {/* Ticket Container */}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-auto">
              {/* Header with Logos */}
              <div className="flex sm:flex-row justify-between items-start px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 gap-4">
                {/* Left Logo Section */}
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
                  <img
                    src="https://via.placeholder.com/50x50" // Placeholder for logo
                    alt="Meeticket Logo"
                    className="w-[50px] sm:w-[60px] md:w-[85px]"
                  />
                  <div>
                    <h1 className="font-bold text-[#362D86] text-lg sm:text-xl md:text-2xl lg:text-3xl">
                      MEETICKET
                    </h1>
                    <p className="text-[#515151] text-[8px] sm:text-[10px] md:text-xs">
                      GOVERNMENT OF TELANGANA
                    </p>
                  </div>
                </div>

                {/* Right Logo Section */}
                <div className="text-right">
                  <div className="bg-black rounded-full flex items-center justify-center w-[80px] h-[75px] sm:w-[129px] sm:h-[125px]">
                    <img src="https://via.placeholder.com/129x125" alt="Amrabad Logo" /> {/* Placeholder for Amrabad Logo */}
                  </div>
                </div>  
              </div>

              {/* Ticket Title and QR Code */}
              <div className="text-center pb-4 sm:pb-6">
                <h2 className="text-[#348E20] font-extrabold text-xl sm:text-2xl">
                  Your Ticket
                </h2>
                <div className="w-[100px] h-[100px] sm:w-[139px] sm:h-[139px] bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="https://via.placeholder.com/139x139" // Placeholder for QR Code
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                                 <h3 className="text-lg sm:text-xl font-bold text-gray-800 px-2">
                   {selectedTicketData?.packageName || 'Package Name Not Available'}
                 </h3>
               </div>
               
               {/* Display basic ticket information */}
               <div className="px-3 sm:px-6 pb-6">
                 <div className="bg-[#E0E0E099] py-2 px-3 sm:px-4 rounded-sm shadow-md">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">Booking ID: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.bookingID || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">Guest Name: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.parkName || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">Mobile Number: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.mobileNo || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">Booking Date: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.bookingDate || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">House Name: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.departmentName || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-blue-v2 font-bold text-sm">Total Amount: </span>
                       <span className="font-medium text-black text-sm">{selectedTicketData?.totalAmount || 'N/A'}</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </PopupModal>
    </div>
  );
}
