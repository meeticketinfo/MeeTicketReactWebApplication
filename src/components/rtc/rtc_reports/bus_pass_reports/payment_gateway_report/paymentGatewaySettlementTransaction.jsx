import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { useSearchParams } from "react-router-dom";
import PaymentGatewayReportForm from "./paymentGatewayReportForm";
import { cleanString } from "../../../../../utils/Helper";
import { useRtcRefundStore } from "../../../../../store/rtc/RtcRefundTransactionStore";
import PaymentGatewayReportChart from "../buspass_refund/charts/paymentGatewayReportChart.jsx";
import { useBuspassPaymentTransactionStore } from "../../../../../store/rtc/buspassPaymentTransactionStore";
function PaymentGatewaySettlementTransaction() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    isBusPassPaymentTransactionsLoading,
    allBusPassPaymentTransactions,
    fetchBusPassPaymentTransactions
  } = useBuspassPaymentTransactionStore();



  const totalCount = allBusPassPaymentTransactions?.Summary?.[0]?.TotalCount || 0;

  // Transform settlement data for the chart
  const chartData = allBusPassPaymentTransactions?.Summary?.[0] ? [
    {
      status: "Settled",
      count: allBusPassPaymentTransactions.Summary[0].SettledCount || 0
    },
    {
      status: "Not Settled", 
      count: allBusPassPaymentTransactions.Summary[0].NotSettledCount || 0
    }
  ].filter(item => item.count >= 0) : [];

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
            <PaymentGatewayReportForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isBusPassPaymentTransactionsLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <PaymentGatewayReportChart
                data={chartData}
                // data={totalCount !== 0 ? allBusPassPaymentTransactions.Summary : []}
                title="Payment Gateway Settlement Transactions"
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

export default PaymentGatewaySettlementTransaction;