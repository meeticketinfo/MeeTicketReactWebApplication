import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useSearchParams } from "react-router-dom";
import AmarabadRefundTransactionsChart from "../charts/AmarabadRefundTransactionsChart";
import AmarabadRefundTransactionsForm from "./AmarabadRefundTransactionsForm";
import { useAmrabadRefundStore } from "../../../../../store/amrabad/reports/RefundTransactionStore";

function AmarabadRefundTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();
  const {
  amrabadRefundTransactions,
  isFetchAmrabadRefundTransactions,
  fetchAmrabadRefundTransactions
  } = useAmrabadRefundStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    localStorage.removeItem("amrabadRefundInnerTransactionSearchParams");
    const payload = {
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
      packageId: searchParams.get("packageId") || "",
      roomId: +searchParams.get("roomId") || "",
      mobileNumber: +searchParams.get("mobileNumber") || "",
    };
    fetchAmrabadRefundTransactions(payload);
  }, []);

  // overAll on submit
  const totalCount =
    amrabadRefundTransactions?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <AmarabadRefundTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isFetchAmrabadRefundTransactions && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <AmarabadRefundTransactionsChart
                data={totalCount !== 0 ? amrabadRefundTransactions : []}
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

export default AmarabadRefundTransactions;