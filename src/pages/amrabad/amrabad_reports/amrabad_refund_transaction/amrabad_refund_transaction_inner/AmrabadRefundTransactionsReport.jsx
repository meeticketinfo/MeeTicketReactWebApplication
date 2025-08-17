import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AgGridTable from "../../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../../layouts/AdminLayout";
import { formatToCurrency } from "../../../../../utils/TypographyHelper";
import Breadcrumb from "../../../../../components/Breadcrumb";
import AmrabadRefundTransactionsReportForm from "./AmrabadRefundTransactionsReportForm";
const AmrabadRefundTransactionsReport = () => {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(0);
    const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);

    const refundTransactionSearchParams =
        localStorage.getItem("refundMetroTransactionSearchParams") || "";

    // Dummy data replacing API/store integration
    const DUMMY_REFUND_TRANSACTIONS = [
        {
            createdDate: "2025-07-01T09:15:00Z",
            refundStatus: "Payment Success, Ticket Not Generated",
            mobileNumber: "9876543210",
            fromStationName: "Amrabad",
            toStationName: "Central",
            amount: 150,
            noOfTickets: 2,
            paymentMode: "UPI",
            orderId: "ORD-001",
            bookingID: "BK-1001",
        },
        {
            createdDate: "2025-07-01T10:45:00Z",
            refundStatus: "Refund Initiated",
            mobileNumber: "9123456780",
            fromStationName: "Amrabad",
            toStationName: "North Gate",
            amount: 75,
            noOfTickets: 1,
            paymentMode: "Card",
            orderId: "ORD-002",
            bookingID: "BK-1002",
        },
        {
            createdDate: "2025-07-02T11:20:00Z",
            refundStatus: "Refund Failed",
            mobileNumber: "9012345678",
            fromStationName: "South Park",
            toStationName: "Amrabad",
            amount: 210,
            noOfTickets: 3,
            paymentMode: "NetBanking",
            orderId: "ORD-003",
            bookingID: "BK-1003",
        },
        {
            createdDate: "2025-07-02T12:10:00Z",
            refundStatus: "Refund Success",
            mobileNumber: "9090909090",
            fromStationName: "West End",
            toStationName: "Amrabad",
            amount: 300,
            noOfTickets: 4,
            paymentMode: "UPI",
            orderId: "ORD-004",
            bookingID: "BK-1004",
        },
        {
            createdDate: "2025-07-03T08:05:00Z",
            refundStatus: "Payment Success, Ticket Not Generated",
            mobileNumber: "8800555353",
            fromStationName: "Amrabad",
            toStationName: "Old Town",
            amount: 120,
            noOfTickets: 2,
            paymentMode: "Wallet",
            orderId: "ORD-005",
            bookingID: "BK-1005",
        },
        {
            createdDate: "2025-07-03T14:40:00Z",
            refundStatus: "Refund Initiated",
            mobileNumber: "9988776655",
            fromStationName: "City Center",
            toStationName: "Amrabad",
            amount: 90,
            noOfTickets: 1,
            paymentMode: "Card",
            orderId: "ORD-006",
            bookingID: "BK-1006",
        },
        {
            createdDate: "2025-07-04T16:25:00Z",
            refundStatus: "Refund Success",
            mobileNumber: "7777777777",
            fromStationName: "Amrabad",
            toStationName: "Harbor",
            amount: 60,
            noOfTickets: 1,
            paymentMode: "UPI",
            orderId: "ORD-007",
            bookingID: "BK-1007",
        },
        {
            createdDate: "2025-07-05T09:55:00Z",
            refundStatus: "Refund Failed",
            mobileNumber: "6666666666",
            fromStationName: "East Side",
            toStationName: "Amrabad",
            amount: 180,
            noOfTickets: 3,
            paymentMode: "NetBanking",
            orderId: "ORD-008",
            bookingID: "BK-1008",
        },
        {
            createdDate: "2025-07-05T18:10:00Z",
            refundStatus: "Payment Success, Ticket Not Generated",
            mobileNumber: "7000000001",
            fromStationName: "Amrabad",
            toStationName: "West End",
            amount: 110,
            noOfTickets: 2,
            paymentMode: "Wallet",
            orderId: "ORD-009",
            bookingID: "BK-1009",
        },
        {
            createdDate: "2025-07-06T07:30:00Z",
            refundStatus: "Refund Success",
            mobileNumber: "7000000002",
            fromStationName: "Amrabad",
            toStationName: "Central",
            amount: 95,
            noOfTickets: 1,
            paymentMode: "Card",
            orderId: "ORD-010",
            bookingID: "BK-1010",
        },
        {
            createdDate: "2025-07-06T19:45:00Z",
            refundStatus: "Refund Initiated",
            mobileNumber: "7000000003",
            fromStationName: "North Gate",
            toStationName: "Amrabad",
            amount: 205,
            noOfTickets: 3,
            paymentMode: "UPI",
            orderId: "ORD-011",
            bookingID: "BK-1011",
        },
        {
            createdDate: "2025-07-07T13:05:00Z",
            refundStatus: "Refund Success",
            mobileNumber: "7000000004",
            fromStationName: "Amrabad",
            toStationName: "South Park",
            amount: 130,
            noOfTickets: 2,
            paymentMode: "Wallet",
            orderId: "ORD-012",
            bookingID: "BK-1012",
        },
    ];

    const isLoading = false;

    const totalCount = DUMMY_REFUND_TRANSACTIONS.length;
    const columnDefs = [
        {
            headerName: "S.No",
            valueGetter: (params) =>
                currentPage * PAGE_LIMIT + params.node.rowIndex + 1,
            maxWidth: "80",
            headerClass: "text-blue-v2",
        },

        {
            field: "createdDate",
            headerName: "Date and Time of Transaction",
            maxWidth: "180",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => {
                if (!params.value) return "N/A";
                const date = new Date(params.value);
                return date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
            },
        },
        {
            field: "refundStatus",
            headerName: "Action",
            maxWidth: "130",
            headerClass: "text-blue-v2",
            valueFormatter: (params) =>
                params.value || params.value === " " ? params.value : "N/A",
        },
        {
            field: "mobileNumber",
            headerName: "Mobile Number",
            minWidth: 100,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => `${params.value} ` || "N/A",
        },
        {
            field: "refundStatus",
            headerName: "Package",
            maxWidth: "130",
            headerClass: "text-blue-v2",
            valueFormatter: (params) =>
                params.value || params.value === " " ? params.value : "N/A",
        },
        {
            field: "refundStatus",
            headerName: "House name ",
            maxWidth: "130",
            headerClass: "text-blue-v2",
            valueFormatter: (params) =>
                params.value || params.value === " " ? params.value : "N/A",
        },
        {
            field: "amount",
            headerName: "Amount",
            maxWidth: "100",
            headerClass: "text-blue-v2",
            valueFormatter: (params) =>
                formatToCurrency(params.value, "INR", "en-IN") || "00:00",
        },

        {
            field: "noOfTickets",
            headerName: "No.of Tickets booked",
            maxWidth: "120",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "fromStationName",
            headerName: "Mode of Booking ",
            maxWidth: "140",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "fromStationName",
            headerName: "Mode of Payment",
            maxWidth: "140",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "toStationName",
            headerName: "Transaction Status",

            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "orderId",
            headerName: "Order ID",
            Width: "390",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value ?? "N/A",
        },
        {
            field: "bookingID",
            headerName: "Booking ID",
            Width: "260",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value ?? "N/A",
        },

        {
            field: "paymentMode",
            headerName: "Refund Status",
            maxWidth: "130",
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value ?? "N/A",
        },


    ];

    // No-op loader retained for parity with pagination UI; data is static
    const loadRefundTransactionsReport = () => { };

    const handlePageClick = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };

    const breadcrumbItems = [
        {
            label: "Refund Transactions",
            path: `/metro-refund-transactions?${refundTransactionSearchParams}`,
        },
        {
            label: `Refund Transactions Report ${searchParams.get("RefundStatus")
                ? `(${searchParams.get("RefundStatus")})`
                : ""
                }`,
            isLast: true,
        },
    ];

    return (
        <>
            <AdminLayout>
                <ToastContainer />
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                    <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
                    <div className="sm:flex sm:justify-between sm:items-center mb-2">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                                Refund Transactions Report{" "}
                                {searchParams.get("RefundStatus")
                                    ? `(${searchParams.get("RefundStatus")})`
                                    : ""}
                            </h1>
                        </div>
                        <div className="">
                            <Link
                                to={`/amrabad-refund-transaction-report?${refundTransactionSearchParams}`}
                                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                    <div>
                        <AmrabadRefundTransactionsReportForm
                            pageNumber={currentPage + 1}
                            pageSize={PAGE_LIMIT}
                            setCurrentPage={setCurrentPage}
                        />
                        <AgGridTable
                            ExportName="RefundTransactionsReport"
                            rowData={DUMMY_REFUND_TRANSACTIONS}
                            columnDefs={columnDefs}
                            isFetchLoading={isLoading}
                            tableHeight={
                                DUMMY_REFUND_TRANSACTIONS?.length > 10 ? 560 : 330
                            }
                            isPagination={false}
                            IsReactPaginate={true}
                            setPageLimit={setPAGE_LIMIT}
                            pageLimit={PAGE_LIMIT}
                            handlePageClick={handlePageClick}
                            currentPage={currentPage}
                            showTotalCount={true}
                            totalCount={totalCount}
                            SetcurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
                {/* Initiate Refund */}
                {/* <PopupModal
          popupModalId="first-modal"
          isOpen={InitiatRefundModal}
          onClose={() => setInitiatRefundModal(false)}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white"
          defaultBodyPadding={true}
        >
          <div className="px-10 py-14">
            <h1 className="text-blue-v1 font-semibold">
              Are you sure you want to proceed with the refund?
            </h1>

            <div className="flex justify-center gap-8 mt-4 z-30">
              <button
                onClick={async () => {
                  await handleInitiateRefund();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                {isInitiateRefund ? (
                  <span className="px-8">
                    <l-tailspin
                      size="15"
                      stroke="5"
                      speed="0.9"
                      color="white"
                    ></l-tailspin>
                  </span>
                ) : (
                  "Proceed"
                )}
              </button>

              <button
                onClick={() => setInitiatRefundModal(false)}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Deny
              </button>
            </div>
          </div>
        </PopupModal> */}
            </AdminLayout>
        </>
    );
};

export default AmrabadRefundTransactionsReport;
