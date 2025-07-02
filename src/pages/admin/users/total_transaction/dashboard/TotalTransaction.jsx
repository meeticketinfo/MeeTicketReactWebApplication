import React, { useEffect } from "react";
import { superballs } from "ldrs";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import TotalTransactionsChart from "../charts/TotalTransactionsChart";
import TotalTransactionsForm from "./TotalTransactionsForm";
import { useSearchParams } from "react-router-dom";

function TotalTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    PaymentTransactionSummaryPieChartData,
    isPaymentTransactionSummaryPieChartLoading,
    fetchPaymentTransactionSummaryPieChartData,
  } = useTransactionsStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    const payload = {
      startDate: cleanString(searchParams.get("startDate"), "_", ":") || startOfDay,
      endDate: cleanString(searchParams.get("endDate"), "_", ":") || endOfDay,
      locationId: searchParams.get("locationId") || "",
      categoryId: +searchParams.get("entityId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      phoneNumber: searchParams.get("phoneNumber") || "",
    };
    fetchPaymentTransactionSummaryPieChartData(payload);
  }, []);

  // overAll on submit
  const totalCount =
    PaymentTransactionSummaryPieChartData?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <TotalTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isPaymentTransactionSummaryPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TotalTransactionsChart
                data={totalCount !== 0 ? PaymentTransactionSummaryPieChartData : []}
                title="Total Transactions"
                angleKey="count"
                calloutLabelKey="paymentCategory"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalTransactions;
