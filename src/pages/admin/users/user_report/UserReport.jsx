import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import UserReportForm from "./UserReportForm";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../utils/Helper";
import { userReports } from "../../../../store/userTransaction/UserReports";

const UserReport = () => {
  const [searchParams] = useSearchParams();
  const fromDate = getStartOfCurrentDay();
  const toDate = getEndOfCurrentDay();
  const {
    userReport,
    isFetchUserReport,
    fetchUserReport
  } = userReports();

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "phoneNumber",
      maxWidth: "120",
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "createdDate",
      maxWidth: "200",
      headerName: "Registration Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "viewTransaction",
      headerName: "Action",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 hover:bg-blue-v2-hover text-white px-3 py-2 rounded-md"
          to={`/user-detailed-report?phoneNumber=${params.data.phoneNumber}&fromDate=${searchParams?.get("fromDate") || fromDate}&toDate=${searchParams?.get("toDate") || toDate }`}>
          View Transaction
        </Link>
      ),
    },
  ]);

  useEffect(() => {
    fetchUserReport({
      fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || fromDate,
      toDate: cleanString(searchParams.get("toDate"), "_", ":") || toDate,
      phoneNumber: searchParams.get("phoneNumber") || "",
    });
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Report
              </h1>
            </div>
          </div>
          <div>
            <UserReportForm />
            <div className="max-w-[650px]">
              <AgGridTable
                ExportName="UserStatusTransactionReport"
                rowData={userReport}
                columnDefs={columnDefs}
                isFetchLoading={isFetchUserReport}
              />
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UserReport;
