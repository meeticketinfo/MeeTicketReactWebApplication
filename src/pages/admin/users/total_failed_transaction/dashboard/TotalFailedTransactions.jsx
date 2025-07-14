import React, { useEffect } from "react";
import { superballs } from "ldrs";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import { useSearchParams } from "react-router-dom";
import TotalFailedTransactionsForm from "./TotalFailedTransactionsForm";
import TotalFailedTransactionsChart from "../charts/TotalFailedTransactionsChart";


function TotalFailedTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    PaymentFailedTransactionSummaryPieChartData,
    isPaymentFailedTransactionSummaryPieChartLoading,
    fetchPaymentFailedTransactionSummaryPieChartData,
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
    fetchPaymentFailedTransactionSummaryPieChartData(payload);
  }, []);

  // overAll on submit
  const totalCount =
    PaymentFailedTransactionSummaryPieChartData?.reduce(
      (sum, item) => sum + item.subCategoryCount,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <TotalFailedTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isPaymentFailedTransactionSummaryPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TotalFailedTransactionsChart
                data={totalCount !== 0 ? PaymentFailedTransactionSummaryPieChartData : []}
                angleKey="subCategoryCount"
                calloutLabelKey="subCategory"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalFailedTransactions;
