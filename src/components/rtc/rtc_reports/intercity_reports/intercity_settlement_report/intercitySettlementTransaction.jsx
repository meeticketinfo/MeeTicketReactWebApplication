import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { useSearchParams } from "react-router-dom";
import IntercitySettlementReportForm from "./intercitySettlementReportForm.jsx";
import { cleanString } from "../../../../../utils/Helper";
import { useRtcRefundStore } from "../../../../../store/rtc/RtcRefundTransactionStore";
import IntercitySettlementChart from "../../bus_pass_reports/buspass_refund/charts/intercitySettlementChart.jsx";
import { useIntercitySettlementStore } from "../../../../../store/rtc/intercitySettlementStore";
function IntercitySettlementTransaction() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    isIntercitySettlementTransactionsLoading,
    allIntercitySettlementTransactions,
    fetchIntercitySettlementTransactions
  } = useIntercitySettlementStore();


  // Support object-shaped response under .data
  const settlementSummary = allIntercitySettlementTransactions?.data ?? null;

  // Transform settlement data for the chart
  const chartData = settlementSummary
    ? [
        {
          status: "Settled",
          count: Number(settlementSummary.settlementCount) || 0,
        },
        {
          status: "Not Settled",
          count: Number(settlementSummary.notSettledCount) || 0,
        },
      ].filter((item) => item.count >= 0)
    : [];

  console.log(chartData);
  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-full ">
            <IntercitySettlementReportForm/>
        </div>

        {/* Transactions by reason chart */}
        <div className="col-span-full uppercase xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
          <div className="flex">
            <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isIntercitySettlementTransactionsLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <IntercitySettlementChart
                data={chartData}
                // data={totalCount !== 0 ? allBusPassPaymentTransactions.Summary : []}
                title="Intercity Settlement Transactions"
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

export default IntercitySettlementTransaction;