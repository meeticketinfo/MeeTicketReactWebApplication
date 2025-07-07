import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { useSearchParams } from "react-router-dom";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import MetroRefundTransactionsChart from "../charts/MetroRefundTransactionsChart";
import MetroRefundTransactionsForm from "../../metro_refunds/dashboard/MetroRefundTransactionsForm";
import { userReports } from "../../../../store/userTransaction/UserReports";
import { metroRefundReports } from "../../../../store/metro_refund_reports_store/MetroRefundReportStore";
function MetroRefundTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();
 const {
    metroRefundTransactionsReport,
    isFetchRefundTransactionsReport,
    fetchMetroRefundTransactionsReport,
  } = metroRefundReports();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    localStorage.removeItem("refundMetroTransactionSearchParams");
    const payload = {
      startDate: cleanString(searchParams.get("startDate"), "_", ":") || startOfDay,
      endDate: cleanString(searchParams.get("endDate"), "_", ":") || endOfDay,
      mobileNumber: searchParams.get("mobileNumber") || "",
    };
    fetchMetroRefundTransactionsReport(payload);
  }, []);

  // overAll on submit
  const totalCount =
    metroRefundTransactionsReport?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <MetroRefundTransactionsForm />
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isFetchRefundTransactionsReport && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <MetroRefundTransactionsChart
                data={totalCount !== 0 ? metroRefundTransactionsReport : []}
                title="Payment success & Ticket Not Generated"
                angleKey="count"
                calloutLabelKey="status"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MetroRefundTransactions;