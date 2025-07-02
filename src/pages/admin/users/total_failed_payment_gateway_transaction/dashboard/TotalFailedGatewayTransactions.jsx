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
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
          <TotalFailedGatewayTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isPaymentFailedGatewayTransactionSummaryPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TotalFailedGatewayTransactionsChart
                data={totalCount !== 0 ? PaymentFailedGatewayTransactionSummaryPieChartData : []}
                angleKey="reasonCount"
                calloutLabelKey="failureReason"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TotalFailedGatewayTransactions;
