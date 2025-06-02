import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import AgGridTable from "../../tables/AgGridTable";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { TbMessage } from "react-icons/tb";
import PopupModal from "../../utils/popup_modal/PopupModal";
import Chat from "../Chat";
import { GriveanceReportStore } from "../../../store/reports/GrievanceStore";
import { ToastContainer, toast } from "react-toastify";
import { bouncy } from "ldrs";
import { FaImage } from "react-icons/fa6";
import { IoMdImages } from "react-icons/io";

bouncy.register();

function GrievanceIncidentReport() {
  const [openModal, setOpenModal] = useState(false);
  const [ImgopenModal, setImgopenModal] = useState(false);
  const [openComplaintModal, setopenComplaintModal] = useState(false);

  const [record, setRecord] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const {
    fetchOverAllReports,
    OverAllReports,
    isFetchOverAllReportsLoading,
    UpdateStatus,
    isStatusLoading,
  } = GriveanceReportStore();
  const storedUser = localStorage.getItem("OverAllFilters");
  const userObject = storedUser ? JSON.parse(storedUser) : "";
  useEffect(() => {
    fetchOverAllReports({
      fromDate: userObject ? userObject.fromDate : getCurrentDate(),
      toDate: userObject ? userObject.toDate : getCurrentDate(),
      active: false,
    });
  }, [fetchOverAllReports]);

  const parsedResponse = OverAllReports.map((ticket) => ({
    ...ticket,
    comments: JSON.parse(ticket.comments), // Convert stringified JSON to an array
  }));
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "ticketUniqueId",
      headerName: "Ticket ID",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "userMobileNumber",
      headerName: "User mobile Number",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "locationCategory",
      headerName: "Location category",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },

    {
      field: "locationName",
      headerName: "Location Name",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      field: "complaintDescription",
      headerName: " Complaint Description",
      width: 300,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "0" : params.value,
    },
    {
      field: "ticketGeneratedDate",
      headerName: "Incident Generated Date ",
      maxWidth: "160",

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
      field: "ticketUpdatedDate",
      headerName: "Incident Updated Date",

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
      headerName: "Uploaded Image",
      // field: "image",
       maxWidth: "140",
      cellRenderer: (params) => (
        
        params.data.imageUrl?<div className="flex items-center justify-center gap-3">
          <button
            className=" mt-1.5"
            onClick={() => {
              setRecord(params.data);
              setImgopenModal(true);
            }}
          >
            <span className="">
              
              <IoMdImages className="text-[24px] text-blue-600 " />
            </span>
          </button>
        </div>:<span className="flex items-center justify-center gap-3">N/A</span>
      ),
      // flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "status",
      headerName: "Status ",
      maxWidth: "100",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        const statusMap = {
          1: { label: "Open", color: "bg-green-500 text-white" },
          2: { label: "Pending", color: "bg-yellow-500 text-black" },
          3: { label: "ReOpen", color: "bg-blue-500 text-white" },
          4: { label: "Closed", color: "bg-red-500 text-white" },
        };

        const status = statusMap[params.value] || {
          label: "N/A",
          color: "bg-gray-500 text-white",
        };

        return (
          <span
            className={`px-2 py-0.5 shadow-lg rounded-md text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
        );
      },
    },

    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center gap-3">
          <button
            className="btn-edit mt-1.5"
            onClick={() => {
              setRecord(params.data);
              setOpenModal(true);
            }}
          >
            <span className="">
              <TbMessage className="text-[24px] text-blue-600 " />
            </span>
          </button>

          <button
            className={` text-white ${
              params.data.status == 4 ? "bg-red-400" : "bg-green-400"
            } leading-normal px-4 py-1 mt-1.5 rounded-md`}
            disabled={params.data.status == 4}
            onClick={() => {
              setSelectedRecord(params.data);
              setopenComplaintModal(true);
            }}
          >
            {params.data.status == 4 ? "Closed" : "Close"}
          </button>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  const initialValues = {
    fromDate: userObject ? userObject.fromDate : getCurrentDate(),
    toDate: userObject ? userObject.toDate : getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchOverAllReports({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
    localStorage.setItem(
      "OverAllFilters",
      JSON.stringify({
        fromDate: values.fromDate,
        toDate: values.toDate,
      })
    );
  };

  const handleCloseComplaint = async () => {
    if (!selectedRecord) {
      console.error("No record selected");
      return;
    }
    const payload = {
      id: selectedRecord.grievanceTrackingId,
      status: 4,
    };

    try {
      const res = await UpdateStatus(payload);
      if (res.data.status === 200) {
        toast.success(res.data.message);
        fetchOverAllReports({
          fromDate: userObject.fromDate || getCurrentDate(),
          toDate: userObject.toDate || getCurrentDate(),
          active: false,
        });
        setopenComplaintModal(false);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, setValues }) => (
          <>
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
              <div className="flex items-end gap-4">
                <button
                  type="submit"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  // disabled={isFetchAllMetroSummaryReportsLoading}
                >
                  Search
                </button>
                <button
                  type="button"
                  className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  // disabled={isFetchAllMetroSummaryReportsLoading}
                  onClick={() => {
                    localStorage.removeItem("OverAllFilters");

                    setValues({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                    });

                    fetchOverAllReports({
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      active: false,
                    });
                  }}
                >
                  Reset
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <AgGridTable
        ExportName="Grievance Incident"
        rowData={parsedResponse}
        columnDefs={columnDefs}
        isFetchLoading={isFetchOverAllReportsLoading}
      />

      <PopupModal
        popupModalId="first-modal"
        isOpen={openModal}
        overFlow={false}
        onClose={() => setOpenModal(false)}
        title={"Greviance"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        // defaultBodyPadding={true}
      >
        <div className=" px-1 ">
          <Chat Record={record} setOpenModal={setOpenModal} />
        </div>
      </PopupModal>
      {/* complint */}
      <PopupModal
        popupModalId="first-modal"
        isOpen={openComplaintModal}
        onClose={() => setopenComplaintModal(false)}
        // title={"Add Sub-Facility"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
      >
        <div className="px-10 py-14">
          <h1 className="text-blue-v1 font-semibold">
            Are you sure You want to close the Complaint
          </h1>
          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={handleCloseComplaint}
              className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 shadow-md rounded-md"
            >
              {isStatusLoading ? (
                <span className="px-12 py-1">
                  <l-bouncy size="25" speed="1.75" color="white"></l-bouncy>
                </span>
              ) : (
                "Close Complaint"
              )}
            </button>
            <button
              onClick={() => {
                setopenComplaintModal(false);
              }}
              className="bg-red-700 hover:bg-red-800 text-white px-5 py-1 shadow-md rounded-md"
            >
              Deny
            </button>
          </div>
        </div>
      </PopupModal>
      {/* image */}

      <PopupModal
        popupModalId="first-modal"
        isOpen={ImgopenModal}
        onClose={() => setImgopenModal(false)}
        title={"Uploaded Image"}
        size="small"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        defaultBodyPadding={true}
        titleColour="text-blue-v1"
      >
        <div className="px-4 py-2 ">
          {/* <h1 className="text-blue-v1 font-semibold text-center uppercase">Uploaded Image</h1> */}
          <div className="">
            <img className="" src={record.imageUrl} />
          </div>
        </div>
      </PopupModal>
    </div>
  );
}

export default GrievanceIncidentReport;
