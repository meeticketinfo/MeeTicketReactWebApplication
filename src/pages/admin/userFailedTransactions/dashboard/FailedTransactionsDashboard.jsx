import React, { useEffect, useState } from "react";
import { superballs } from "ldrs";
import DashboardCard07 from "../../../../partials/dashboard/DashboardCard07";
import TransactionPieChart from "../piecharts/TransactionPieChart";
import TransactionGraph from "../piecharts/TransactionGraph";
import TransactionDepartment from "../piecharts/TransactionDepartment";
import { useTransactionsStore } from "../../../../store/userTransaction/TransactionsStore";
import TransactionByLocation from "../piecharts/TransactionByLocation";
import FailedTransactionsDashboardForm from "./FailedTransactionsDashboardForm";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { useSearchParams } from "react-router-dom";

function FailedTransactionsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  superballs.register();

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

    fetchFailedTransactionByReason(payload);
    fetchFailedTransactionByLocation(payload);
    fetchFailedTransactionBydepartment(payload);
    fetchFailedTransactionByLocationCategory(payload);
    fetchFailedTransactionTrendGraph(payload);
  }, []);

  const {
    fetchFailedTransactionByReason,
    isFailedTransactionByReasonLoading,
    FailedTransactionByReasonData,
    isFailedTransactionByLocationCategoryLoading,
    fetchFailedTransactionByLocation,
    isFailedTransactionByLocationLoading,
    FailedTransactionByLocationData,
    fetchFailedTransactionBydepartment,
    FailedTransactionByDepartmentData,
    isFailedTransactionByDepartmentLoading,
    fetchFailedTransactionByLocationCategory,
    FailedTransactionByLocationCategoryData,
    fetchFailedTransactionTrendGraph,
    FailedTransactionByGraphData,
    isFailedTransactionByGraphLoading,
  } = useTransactionsStore();

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full ">
          <FailedTransactionsDashboardForm />
        </div>

        {/* Transactions by reason chart */}
        <DashboardCard07>
          <div className="flex">
            <div
              className="flex-1 p-1 m-1 rounded-lg overflow-hidden shadow-md relative"
            >
              {/* <Loader/> */}
              
                { isFailedTransactionByReasonLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
              <TransactionPieChart
                data={FailedTransactionByReasonData}
                title="Failed Transactions By Reason"
                angleKey="percentage"
                calloutLabelKey="failureReason"
              />
            </div>

            <div
              className="flex-1  p-1 m-1 rounded-lg overflow-hidden shadow-md relative"
            >
              { isFailedTransactionByLocationLoading && (
                  <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                    <div className="loader"></div>
                  </div>
                )}
              <TransactionByLocation
                data={FailedTransactionByLocationData}
                title="Failed Transactions By Location "
                angleKey="percentage"
                calloutLabelKey="locationName"
              />
            </div>
          </div>
        </DashboardCard07>
        <DashboardCard07>
          <div>
            {isFailedTransactionByGraphLoading && (
              <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                <div className="loader"></div>
              </div>
            )}
            <TransactionGraph
              data={FailedTransactionByGraphData}
              title="Failed Transactions By Trends"
              angleKey="failedCount"
              calloutLabelKey="timeSlot"
            />
          </div>
        </DashboardCard07>
        {/* <DashboardCard07>
           <div className="flex justify-center items-center h-full">
              <TransactionPieChart
                data={allPassTypeData}
                title="Failed Transactions By Type Of Device"
                angleKey="totalPasses"
              />
            </div>
        </DashboardCard07> */}
        <DashboardCard07>
          <div className="flex gap-4">
            <div
              className="flex-1 relative"
            >
              {isFailedTransactionByDepartmentLoading  && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TransactionDepartment
                data={FailedTransactionByDepartmentData || []}
                title="Failed Transactions By Department"
                angleKey="failedCount"
                calloutLabelKey="departmentName"
              />
            </div>
            <div
              className="flex-1 relative"
            >
              {isFailedTransactionByLocationCategoryLoading && (
                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                  <div className="loader"></div>
                </div>
              )}
              <TransactionDepartment
                data={FailedTransactionByLocationCategoryData || []}
                title="Failed Transactions By Location category "
                angleKey="failedCount"
                calloutLabelKey="locationCategory"
              />
            </div>
          </div>
        </DashboardCard07>
      </div>
    </>
  );
}

export default FailedTransactionsDashboard;
