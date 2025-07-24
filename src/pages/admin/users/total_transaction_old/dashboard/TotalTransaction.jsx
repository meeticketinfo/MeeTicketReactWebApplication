import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import { Field, Form, Formik } from "formik";
import DashboardCard07 from "../../../../../partials/dashboard/DashboardCard07";
import { useParkStore } from "../../../../../store/masters/parksStore";
import { useEntityTypesStore } from "../../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../../store/masters/departmentTypesStore";
import Select from "react-select";
import { cleanString, getDateRange, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { useTransactionsStore } from "../../../../../store/userTransaction/TransactionsStore";
import TransactionByLocation from "../../../userFailedTransactions/piecharts/TransactionByLocation";
import TotalTransactionsChart from "../charts/TotalTransactionsChart";
import TicketNotGenerated from "../charts/TicketNotGenerated";
import TotalTransactionsForm from "./TotalTransactionsForm";
import { useSearchParams } from "react-router-dom";

function TotalTransactions() {
  superballs.register();
  const [searchParams] = useSearchParams();

  const {
    PaymentTransactionPieChartData,
    isPaymentTransactionPieChartLoading,
    fetchPaymentTransactionPieChartData,
    SuccessButNotConfirmedPieChartData,
    isSuccessButNotConfirmedPieChartLoading,
    fetchSuccessButNotConfirmedPieChartData,
  } = useTransactionsStore();
  const startOfDay = getStartOfCurrentDay();
  const endOfDay = getEndOfCurrentDay();
  
  useEffect(() => {
    const payload = {
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
      locationId: searchParams.get("locationId") || "",
      categoryId: +searchParams.get("entityId") || "",
      departmentId: +searchParams.get("departmentId") || "",
      phoneNumber: searchParams.get("phoneNumber") || "",
    };

    fetchPaymentTransactionPieChartData(payload);
    fetchSuccessButNotConfirmedPieChartData(payload);
  }, []);

  // overAll on submit
  const totalCount =
    PaymentTransactionPieChartData?.reduce(
      (sum, item) => sum + item.count,
      0
    ) || 0;

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <TotalTransactionsForm/>
        </div>

        {/* Transactions by reason chart */}
        <DashboardCard07>
          <div className="flex">
            <div className="flex-1 p-1 m-1 rounded-lg overflow-hidden shadow-md relative">
              {/* <Loader/> */}

              {isPaymentTransactionPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TotalTransactionsChart
                data={totalCount !== 0 ? PaymentTransactionPieChartData : []}
                title="Total Transactions"
                angleKey="count"
                calloutLabelKey="category"
              />
            </div>

            <div className="flex-1  p-1 m-1 rounded-lg overflow-hidden shadow-md relative">
              {isSuccessButNotConfirmedPieChartLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TicketNotGenerated
                data={SuccessButNotConfirmedPieChartData}
                title="Payment Success and Ticket not generated"
                angleKey="count"
                calloutLabelKey="subCategory"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default TotalTransactions;
