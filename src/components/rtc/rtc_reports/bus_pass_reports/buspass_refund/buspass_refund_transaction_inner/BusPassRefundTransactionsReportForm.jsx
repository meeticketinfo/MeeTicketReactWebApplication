import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../../utils/Helper";
import { useBusPassTotalTransactionStore } from "../../../../../../store/rtc_total_transaction_report_store/amarabad_Total_transaction_reports_store/BusPassTotalTransactionStore";
import { useRtcRefundStore } from "../../../../../../store/rtc/RtcRefundTransactionStore";

const BusPassRefundTransactionsReportForm = ({
    pageNumber,
    pageSize,
    setCurrentPage,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
     const {
            isFetchBusPassRefundTransactionsReport,
            fetchBusPassRefundTransactionsReport,
        } = useRtcRefundStore();
      const refundTransactionSearchParams = localStorage.getItem(
    "refundAmrabadInnerTransactionSearchParams"
  );
  
  const { fetchRtcTotalTransactions, AllBusPassesData, fetchAllBusPasses } =
    useBusPassTotalTransactionStore();

    // Load packages on component mount
    useEffect(() => {
        getPackages();
    }, [getPackages]);

    // Load houses if packageId is present in search params
    useEffect(() => {
        const packageId = searchParams.get("packageId");
        if (packageId) {
            getHouses(packageId);
        }
    }, [searchParams, getHouses]);

    const startOfDay = getStartOfCurrentDay();
    const endOfDay = getEndOfCurrentDay();

    const initialValues = {
        fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
        toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
        packageId: searchParams.get("packageId") || "",
        roomId: searchParams.get("roomId") || "",
        modeOfBooking:searchParams.get("modeOfBooking") || "",
        modeOfPayment:searchParams.get("modeOfPayment") || "",
        mobileNumber: searchParams.get("mobileNumber") || "",
        refundStatus: (searchParams.get("RefundStatus") !== "null" && searchParams.get("RefundStatus")) || "",
        // refundStaus:"Refund",
    };

    const onSubmit = (values) => {
        const newSearchParams = new URLSearchParams();
        Object.keys(values).forEach((key) => {
            if (values[key]) {
                newSearchParams.set(key, cleanString(values[key], ":", "_"));
            }
        });
        setSearchParams(newSearchParams);
        fetchBusPassRefundTransactionsReport({
            fromDate: values.fromDate,
            toDate: values.toDate,
            packageId:values.packageId,
            roomId:values.roomId,
            modeOfBooking:values.modeOfBooking,
            modeOfPayment:values.modeOfPayment,
            mobileNumber: values.mobileNumber,
            refundStatus: values.refundStatus,
            pageNumber: pageNumber,
            pageSize: pageSize,
        });
        setCurrentPage(0);
    };

    return (
        <>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
                        <div>
                            <label
                                htmlFor="fromDate"
                                className="block text-xs font-medium text-gray-700"
                            >
                                From Date
                            </label>
                            <Field
                                type="datetime-local"
                                name="fromDate"
                                className={`mt-1 block w-full px-2 py-1 border
                      border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onChange={(e) => {
                                    const fromDateValue = e.target.value;
                                    setFieldValue("fromDate", fromDateValue);
                                    if (new Date(fromDateValue) > new Date(values.toDate)) {
                                        // Automatically update toDate if it's earlier than fromDate
                                        setFieldValue("toDate", fromDateValue);
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="toDate"
                                className="block text-xs font-medium text-gray-700"
                            >
                                To Date
                            </label>
                            <Field
                                type="datetime-local"
                                name="toDate"
                                className={`mt-1 block w-full px-2 py-1 border
                         border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onChange={(e) => {
                                    const toDateValue = e.target.value;
                                    setFieldValue("toDate", toDateValue);
                                }}
                            />
                        </div>
                        {/* mobile number */}
                        <div>
                            <label
                                htmlFor="packageId"
                                className="block text-xs font-medium text-gray-700"
                            >
                                Packages
                            </label>
                            <Field
                                as="select"
                                name="packageId"
                                placeholder="Select Package"
                                onChange={(e) => {
                                    const packageId = e.target.value;
                                    setFieldValue("packageId", packageId);
                                    // Clear house selection when package changes
                                    setFieldValue("houseId", "");
                                    if (packageId) {
                                        getHouses(packageId);
                                    }
                                }}
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="">Select Package</option>
                                {AllPackages.map((item) => (
                                    <option key={item.packageId} value={item.packageId}>
                                        {item.packageName}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <div>
                            <label
                                htmlFor="roomId"
                                className="block text-xs font-medium text-gray-700"
                            >
                                House
                            </label>
                            <Field
                                as="select"
                                name="roomId"
                                placeholder="Select House"
                                 onChange={(e) => {
                                    const roomIdValue = e.target.value;
                                    setFieldValue("roomId", roomIdValue);
                                }}
                                disabled={values.packageId == ""}
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="">Select House</option>
                                {AllHouses.map((item) => (
                                    <option key={item.roomId} value={item.roomId}>
                                        {item.roomName}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Mode of booking
                            </label>
                            <Field
                                as="select"
                                name="modeOfBooking"
                                className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                            >
                                <option value="">-- Select --</option>
                                <option value="Website">Website</option>
                                <option value="Mobile">Mobile</option>
                            </Field>
                        </div>
                        <div>
                            <label
                                htmlFor="modeOfPayment"
                                className="block text-xs font-medium text-gray-700"
                            >
                                Payment Mode
                            </label>
                            <Field
                                as="select"
                                name="modeOfPayment"
                                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onChange={(e) => {
                                    setFieldValue("modeOfPayment", e.target.value);
                                }}
                            >
                                <option value="">Select Mode</option>
                                <option value="upi">UPI</option>
                                <option value="creditCard">Credit Card</option>
                                <option value="debitCard">Debit Card</option>
                                <option value="netBanking">Net Banking</option>
                            </Field>
                        </div>
                        <div>
                            <label
                                htmlFor="mobileNumber"
                                className="block text-xs font-medium text-gray-700"
                            >
                                Mobile number
                            </label>
                            <Field
                                type="text"
                                maxLength="10"
                                name="mobileNumber"
                                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                                placeholder="Enter phone number"
                                onKeyPress={(e) => {
                                    if (!/^\d$/.test(e.key)) {
                                        e.preventDefault(); // Prevent non-numeric characters
                                    }
                                }}
                                onChange={(e) => {
                                    setFieldValue("mobileNumber", e.target.value);
                                }}
                            />
                        </div>
                        {/* status */}
                        <div>
                            <label
                                htmlFor="refundStatus"
                                className="block text-xs font-medium text-gray-700"
                            >
                                Refund Status
                            </label>
                            <Field
                                as="select"
                                name="refundStatus"
                                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                onChange={(e) => {
                                    setFieldValue("refundStatus", e.target.value);
                                }}
                            >
                                <option value="">Select Mode</option>
                                <option value="Refund">Refunded</option>
                                <option value="NotRefund">Not Refunded</option>
                            </Field>
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                                disabled={isFetchAmrabadRefundTransactionsReport}
                            >
                                Search
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default BusPassRefundTransactionsReportForm;
