import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AgGridTable from "../../../../tables/AgGridTable";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";
import { useBookingsStore } from "../../../../../store/masters/bookingsStore";
import { formatDateTime } from "../../../../../utils/Helper";
import Breadcrumb from "../../../../Breadcrumb";
import { useBusPassTotalTransactionStore } from "../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";

const SimpleModal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 min-w-[350px] max-w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer"
        >×</button>
        {children}
      </div>
    </div>
  );
};

const BusPassUserTransactionsOrderTracker = () => {
  const location = useLocation();
  const { orderId, mobileNo, typeOfBusPass, houseNames, date, amount, bookingId, backTitle } = location.state || {};
  const { fetchCurrentBookingDetailsByBookingId } = useBookingsStore();
  const userBusPassReportSearchParams = localStorage.getItem("userBusPassReportSearchParams");
  const userDetailedBusPassReportSearchParams = localStorage.getItem("userDetailedBusPassReportSearchParams");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [bookingDetailsResponse, setBookingDetailsResponse] = useState(null);

  const fetchQRsForBooking = async (bookingId) => {
    try {
      const result = await fetchCurrentBookingDetailsByBookingId(bookingId);
      if (result && result.data && result.data.status === 200) {
        setBookingDetails(result.data.data.data.bookingDetails);
        setBookingDetailsResponse(result.data.data.data);
        setIsModalOpen(true);
      } else {
        toast.error("Unexpected response from the server.");
      }
    } catch (xhr) {
      handleApiError(xhr);
    }
  };
  const {
    fetchRtcTransactionTrackingStatusByOrderId,
    RtcTransactionTrackingStatusByOrderIdData,
    isFetchRtcTransactionTrackingStatusByOrderId,
  } = useBusPassTotalTransactionStore();
  const [columnDefs] = useState([
    {
      field: "sno",
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "requestTimestamp",
      maxWidth: "200",
      headerName: "Request Time Stamp",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "";
        return formatDateTime(params.value);
      },
    },
    {
      field: "responseTimestamp",
      maxWidth: "200",
      headerName: "Response Time Stamp",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return " ";
        return formatDateTime(params.value);
      },
    },
    {
      field: "bpTransactionStatus",
      flex: 1,
      headerName: "Transaction Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value == "INITIATE" ? "Request Sent"
        : params.value == "INPROCESS" ? "Deep Link Status"
          : params.value == "FINAL_STATUS" ? params.data.resultStatus : "Payment Status Check",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value == "INITIATE" ? "Request Sent"
            : params.value == "INPROCESS" ? "Deep Link Status"
              : params.value == "FINAL_STATUS" ? params.data.resultStatus : "Payment Status Check"}
        </span>
      ),
    },
    {
      field: "resultMsg",
      flex: 1,
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>
          {params.value}
        </span>
      ),
    },
  ]);

  useEffect(() => {
    fetchRtcTransactionTrackingStatusByOrderId(orderId);
  }, [orderId]);

  const breadcrumbItems = [
    {
      label: 'User Report',
      path: `/bus-pass-user-report?${userBusPassReportSearchParams}`
    },
    {
      label: 'User Detailed Report',
      path: `/bus-pass-user-detailed-report?${userDetailedBusPassReportSearchParams}`
    },
    {
      label: 'User Transaction Order Tracking Report',
      isLast: true
    },
  ];

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Transaction Order Tracking Report
              </h1>
            </div>
            <div className="">
              <Link
                to={`/bus-pass-user-detailed-report?${userDetailedBusPassReportSearchParams}`}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </Link>
            </div>
          </div>

          {/* Transaction Details Cards */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Date</h3>
              <p className="text-sm font-semibold text-gray-900">
                {formatDateTime(date) || 'N/A'}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Order ID</h3>
              <p className="text-sm font-semibold text-gray-900">
                {orderId || 'N/A'}
                {/* {orderId && orderId != "Not Generated" && (
                  <NavLink
                    end
                    to={`/amrabad-admin/ticket-view-details/${orderId}`}
                    className="ml-2 text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>View Ticket Details</span>
                  </NavLink>
                )} */}
              </p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Booking ID</h3>
              <p className="text-sm font-semibold text-gray-900">{bookingId || 'N/A'}</p>

            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Mobile Number</h3>
              <p className="text-sm font-semibold text-gray-900">{mobileNo || 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Amount</h3>
              <p className="text-sm font-semibold text-gray-900">{amount ? formatToCurrency(amount) : 'N/A'}</p>
            </div>
            <div className="bg-white p-1.5 px-3 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xs font-medium text-gray-500 mb-1">Type of Bus pass</h3>
              <p className="text-sm font-semibold text-gray-900">{typeOfBusPass || 'N/A'}</p>
            </div>

          </div>

          <div>
            <AgGridTable
              showSearch={false}
              ExportName="UserStatusTransactionReport"
              rowData={RtcTransactionTrackingStatusByOrderIdData}
              columnDefs={columnDefs}
              isFetchLoading={isFetchRtcTransactionTrackingStatusByOrderId}
            />
          </div>
        </div>
      </AdminLayout>
      <SimpleModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {bookingDetailsResponse && (
          <div className="text-center max-h-[500px] overflow-y-auto">
            <img
              src={`data:image/png;base64,${bookingDetailsResponse.binaryQRCode}`}
              alt="Booking QR"
              className="w-[250px] mx-auto"
            />
            <div className="mt-2 text-left">
              <b>Booking Date</b>: {bookingDetailsResponse.bookingDate}<br />
              <b>Booking ID</b>: {bookingDetailsResponse.id}
            </div>
            <div className="mt-2 text-left">
              {bookingDetails.map((item, idx) => (
                <>
                  <div key={idx} className="mb-2.5">
                    <b>Facility</b>: {item.facilityName}<br />
                    <b>Ticket Type</b>: {item.serviceVariantName}<br />
                    <b>Qty</b>: {item.quantity}<br />
                    <b>Total</b>: ₹{item.totalAmount.toFixed(2)}
                  </div>
                  {idx !== bookingDetails.length - 1 && <hr className="my-2" />}
                </>
              ))}
              <div className="font-bold bg-gray-200 p-1.5">
                Grand Total: ₹{bookingDetailsResponse.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </SimpleModal>
    </>
  );
};

export default BusPassUserTransactionsOrderTracker;
