import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import AgGridTable from "../../tables/AgGridTable";
import { getCurrentDate } from "../../../utils/TypographyHelper";
import { TbMessage } from "react-icons/tb";
import PopupModal from "../../utils/popup_modal/PopupModal";
import Chat from "../Chat";

function GrievanceIncidentReport() {
  const [openModal, setOpenModal] = useState(false);
  const apiResponse = [
    {
      ticketID: 9,
      ticketUniqueId: "044120251241236",
      userMobileNumber: "8988888525",
      locationCategory: "Temples",
      locationName: "Durgam Cheruvu",
      complaintDescription: "stringstringstring",
      ticketGeneratedDate: "2025-03-04T12:40:05.043",
      ticketUpdatedDate: "2025-03-04T12:41:23.993",
      status: 1,
      comments:
        '[{"Comment":"stringstringstring","UserType":"User"},{"Comment":"ok will check","UserType":"Admin"},{"Comment":"okokokokok","UserType":"User"},{"Comment":"okk","UserType":"Admin"}]',
    },
    {
      ticketID: 10,
      ticketUniqueId: "044120251241237",
      userMobileNumber: "8988888599",
      locationCategory: "Parks",
      locationName: "Nehru Zoological Park",
      complaintDescription: "Another issue",
      ticketGeneratedDate: "2025-03-04T14:10:05.043",
      ticketUpdatedDate: "2025-03-04T14:20:23.993",
      status: 2,
      comments:
        '[{"Comment":"test comment","UserType":"User"},{"Comment":"noted","UserType":"Admin"}]',
    },
  ];

  // ✅ Map over the response array and parse the `comments` field
  const parsedResponse = apiResponse.map((ticket) => ({
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
      valueFormatter: (params) => `${params.value} ` || "N/A",
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

      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value === "null" ? "0" : params.value,
    },
    {
      field: "ticketGeneratedDate",
      headerName: "Incident Generated Date ",
      maxWidth: "160",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "ticketUpdatedDate",
      headerName: "Incident Updated Date",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "status",
      headerName: "Status ",

      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    // {
    //   field: "Recent Comments",
    //   headerName: "Recent Comments ",

    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "N/A",
    // },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <button
            className="btn-edit"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className="">
              <TbMessage className="text-[24px] text-blue-600 " />
            </span>
          </button>

          {/* <button
            className="btn-edit"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <span className="">
              <TbMessage className="text-[24px] text-blue-600 " />
            </span>
          </button> */}
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };
  const onSubmit = (values) => {
    fetchAllMetroSummaryReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };
  return (
    <div>
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
        rowData={parsedResponse}
        columnDefs={columnDefs}
        // isFetchLoading={isFetchAllMetroSummaryReportsLoading}
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
        <div className=" px-1 py-3">
          <Chat />
        </div>
      </PopupModal>
    </div>
  );
}

export default GrievanceIncidentReport;
