import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import RefundTransactionsChart from "../charts/RefundTransactionsChart";
import RefundTransactionsForm from "./RefundTransactionsForm";
import { useSearchParams } from "react-router-dom";
import { userReports } from "../../../../../store/userTransaction/UserReports";

function RefundTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    refundTransactions,
    isFetchRefundTransactions,
    fetchRefundTransactions,
  } = userReports();

  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    const payload = {
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
      locationId: searchParams.get("locationId") || "",
      locationCategoryId: +searchParams.get("entityId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      phoneNumber: searchParams.get("phoneNumber") || "",
      
    };
    fetchRefundTransactions(payload);
  }, []);

  // overAll on submit
  const totalCount =
    refundTransactions?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <RefundTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isFetchRefundTransactions && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <RefundTransactionsChart
                data={totalCount !== 0 ? refundTransactions : []}
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

export default RefundTransactions;