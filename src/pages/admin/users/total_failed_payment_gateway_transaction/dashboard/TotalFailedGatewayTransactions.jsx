import React, { useEffect } from "react";
import { superballs } from "ldrs";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import { useSearchParams } from "react-router-dom";
import TotalFailedGatewayTransactionsForm from "./TotalFailedGatewayTransactionsForm";
import TotalFailedGatewayTransactionsChart from "../charts/TotalFailedGatewayTransactionsChart";


function TotalFailedGatewayTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    PaymentFailedGatewayTransactionSummaryPieChartData,
    isPaymentFailedGatewayTransactionSummaryPieChartLoading,
    fetchPaymentFailedGatewayTransactionSummaryPieChartData,
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
    fetchPaymentFailedGatewayTransactionSummaryPieChartData(payload);
  }, []);

  // overAll on submit
  const totalCount =
    PaymentFailedGatewayTransactionSummaryPieChartData?.reduce(
      (sum, item) => sum + item.reasonCount,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Form Section */}
        <div className="col-span-1">
          <div className="bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)] p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Filter Options
            </h3>
            <TotalFailedGatewayTransactionsForm/>
          </div>
        </div>

        {/* Chart Section */}
        <div className="col-span-1">
          <div className="bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)] p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">
                Failed Transactions by Reason
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Total failed transactions: {totalCount}
              </p>
            </div>
            
            <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
              {isPaymentFailedGatewayTransactionSummaryPieChartLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg z-10">
                  <div className="loader"></div>
                </div>
              )}
              
              <div className="w-full h-full">
                <TotalFailedGatewayTransactionsChart
                  data={totalCount !== 0 ? PaymentFailedGatewayTransactionSummaryPieChartData : []}
                  angleKey="reasonCount"
                  calloutLabelKey="failureReason"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalFailedGatewayTransactions;
