import React, { useEffect, useState } from "react";
import { getCurrentDate } from "../../../../utils/TypographyHelper";
import { useRtcReportStore } from "../../../../store/rtc/RtcReportStore";
import { Formik, Form, Field } from "formik";
import AgGridTable from "../../../tables/AgGridTable";
import PopupModal from "../../../utils/popup_modal/PopupModal";
import { toast, ToastContainer } from "react-toastify";
import { bouncy } from 'ldrs'

bouncy.register()

function PendingPassesReportList() {
  const storedUser = localStorage.getItem("PendingPassFilters");
  const userObject = storedUser ? JSON.parse(storedUser) : "";
  const {
    fetchAllPendingPassReport,
    allPendingPassReports,
    isFetchAllallPendingPassReportsLoading,
    UpdateStatus,
    isStatusLoading,
  } = useRtcReportStore();
  //   console.log("DayPassDetails", allStudentPassReports);
  useEffect(() => {
    fetchAllPendingPassReport({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, [fetchAllPendingPassReport]);
  const [UpdateStatusModal, setUpdateStatusModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchAllPendingPassReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
    localStorage.setItem(
      "PendingPassFilters",
      JSON.stringify({
        fromDate: values.fromDate,
        toDate: values.toDate,
      })
    );
  };
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionID",
      headerName: "Transaction ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },

    {
      field: "userName",
      headerName: "User Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "bookingDate",
      headerName: "Booking Date ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      field: "startTime",
      headerName: "Start Time ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      field: "endTime",
      headerName: "End Time  ",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },

    {
      field: "totalAmount",
      headerName: "Total Amount",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "paymentStatus",
      headerName: "Application Status",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value?.toLowerCase() === "approved"
                ? "bg-green-100 text-green-700 shadow-md"
                : params.value?.toLowerCase() === "pending"
                ? "bg-orange-100 text-orange-700 shadow-md"
                : params.value?.toLowerCase() === "rejected"
                ? "bg-red-200 text-red-800 shadow-md"
                : "bg-gray-500 text-white shadow-md"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded-md`}
          >
            {params.value}
          </span>
        </div>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-3">
          <button
            className={` text-white bg-green-600  leading-normal px-4 py-1 mt-1.5 rounded-md`}
            //   disabled={params.data.status == 4}
            onClick={() => {
              setSelectedRecord(params.data);
              setUpdateStatusModal(true);
            }}
          >
            {/* {params.data.status == 4 ? "Closed" : "Close"} */}
            Update Status
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  const handleUpdateStatus = async (approve) => {
    console.log("approve", approve);
    if (!selectedRecord) {
      console.error("No record selected");
      return;
    }
    const payload = {
      ApplicationId: selectedRecord.applicationID,
      Status: approve ? "Approved" : "Rejected",
    };

    try {
      const res = await UpdateStatus(payload);

      if (res.data.status === 200) {
        console.log("res", res.data.status);
        toast.success(res.data.message);
        fetchAllPendingPassReport({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
        });
        setUpdateStatusModal(false);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
            border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                // min={getCurrentDate()}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    // Automatically update toDate if it's earlier than fromDate
                    setFieldValue("toDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
               border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                // disabled={isFetchAllMetroSummaryReportsLoading}
              >
                Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        rowData={allPendingPassReports}
        columnDefs={columnDefs}
        isFetchLoading={isFetchAllallPendingPassReportsLoading}
      />
      <PopupModal
        popupModalId="first-modal"
        isOpen={UpdateStatusModal}
        onClose={() => setUpdateStatusModal(false)}
        // title={"Add Sub-Facility"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        {true ? (
          <div className="px-10 py-24 flex justify-center ">
            {" "}
            <l-bouncy size="65" speed="1.75" color="gray"></l-bouncy>
          </div>
        ) : (
          <div className="px-10 py-14">
            <h1 className="text-blue-v1 font-semibold text-center">
              Update the Status
            </h1>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() => {
                  handleUpdateStatus(true);
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 shadow-md rounded-md"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(false);
                }}
                className="bg-red-700 hover:bg-green-800 text-white px-3 py-1 shadow-md rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </PopupModal>
    </>
  );
}

export default PendingPassesReportList;
