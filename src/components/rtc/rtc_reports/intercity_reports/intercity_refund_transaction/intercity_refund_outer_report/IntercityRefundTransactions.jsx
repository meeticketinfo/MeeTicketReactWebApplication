import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { useSearchParams } from "react-router-dom";
import IntercityRefundTransactionsChart from "../../../bus_pass_reports/buspass_refund/charts/IntercityRefundTransactionsChart.jsx";
import {
  cleanString,
  getEndOfCurrentDay,
  getStartOfCurrentDay,
} from "../../../../../../utils/Helper";
import IntercityRefundOuterReportForm from "./IntercityRefundOuterReportForm.jsx";
import { useIntercityRefundReportStore } from "../../../../../../store/intercity/reports/IntercityRefundReportStore.jsx";

function IntercityRefundTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();
  const {
    isFetchIntercityRefundTransactionsReport,
    refundIntercityTransactionsReport,
    fetchIntercityRefundTransactionsReport,
  } = useIntercityRefundReportStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();

  useEffect(() => {
    const preservedParams = localStorage.getItem(
      "intercityRefundInnerTransactionSearchParams"
    );
    if (preservedParams && !searchParams.toString()) {
      const urlParams = new URLSearchParams(preservedParams);
      const payload = {
        fromDate:
          cleanString(urlParams.get("fromDate"), "_", ":") || startOfDay,
        toDate: cleanString(urlParams.get("toDate"), "_", ":") || endOfDay,
        mobileNumber: urlParams.get("mobileNumber") || "",
        departureLocation: urlParams.get("departureLocation") || "",
        arrivalLocation: urlParams.get("arrivalLocation") || "",
      };
      fetchIntercityRefundTransactionsReport(payload);
    } else {
      const payload = {
        fromDate:
          cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
        toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
        mobileNumber: searchParams.get("mobileNumber") || "",
        departureLocation: searchParams.get("departureLocation") || "",
        arrivalLocation: searchParams.get("arrivalLocation") || "",
      };
      fetchIntercityRefundTransactionsReport(payload);
    }
  }, []);

  const totalCount =
    refundIntercityTransactionsReport?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3 ">
        <div className="col-span-full ">
          <IntercityRefundOuterReportForm />
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isFetchIntercityRefundTransactionsReport && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <IntercityRefundTransactionsChart
                data={totalCount !== 0 ? refundIntercityTransactionsReport : []}
                // data={refundIntercityTransactionsReport}
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

export default IntercityRefundTransactions;
