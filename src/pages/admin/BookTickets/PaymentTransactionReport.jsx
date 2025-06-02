import React, { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { useEntityTypesStore } from "../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../store/masters/departmentTypesStore";
import Select from "react-select";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";
import Swal from "sweetalert2";

function PaymentTransactionReport() {
  const [openModal, setOpenModal] = useState(false);
  const [reGenerateData, setreGenerateData] = useState({});
  
  const {
    isTransactionPaymentReportsLoading,
    allTransactionPaymentReports,
    fetchPaymentTransactions,
    FetchReGenerateTicket,
    isReGenerateTicketLoading,
  } = useBookingsStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    typeOfBooking: "",
    phoneNumber: "",
    entityId: null,
    departmentId: null,
  };

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);

  useEffect(() => {
    fetchPaymentTransactions({
      startDate: getCurrentDate(),
      endDate: getCurrentDate(),
      currentTransactionStatus: null,
      phoneNumber: null,
      parkId: null,
    });
  }, [fetchPaymentTransactions]);

  const onSubmit = (values, { resetForm }) => {
    fetchPaymentTransactions({
      startDate: values.fromDate,
      endDate: values.toDate,
      departmentId: values.departmentId,
      entityTypeId: values.entityId,
      currentTransactionStatus: values.typeOfBooking
        ? values.typeOfBooking
        : null,
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
      parkId: null,
    });
  };

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "orderId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "phonE_NUMBER",
      headerName: "Mobile No.",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "confirmedTxnAmount",
      headerName: "Amount Initiated",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "createdDate",
      headerName: "Payment Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => formatToStandardDate(params.value) || "N/A",
    },
    {
      field: "currentTransactionStatus",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    // {
    //   field: "refundStatus",
    //   headerName: "Refund Status",
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) => params.value || "N/A",
    // },
    {
      field: "Re-grnerateTicket",
      headerName: "Re-grnerate Ticket",
      maxWidth: 160,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        return (
          <div className="flex justify-center">
            <span
              onClick={() => {
                setOpenModal(true);
                setreGenerateData({
                  paymentOrderId: params.data.orderId,
                  mobileNumber: params.data.phonE_NUMBER,
                });
              }}
            >
              <HiArrowPathRoundedSquare className="text-[24px] text-green-400  mt-2.5 " />
            </span>
          </div>
        );
      },
    },
  ]);

  const handleReGenerateTicket = async () => {
   
    try {
      const res = await FetchReGenerateTicket(reGenerateData);
      console.log(res)
      if (res.response.data.status == 200) {
        setOpenModal(false)
        Swal.fire({
          title: "Success!",
          html: `Ticket Re-generated Succesusfully`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-custom-btn",
          },
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Call the API after the SweetAlert modal closes
        });
      } else {
         setOpenModal(false)
        Swal.fire({
          title: "Failed!",
          text: `Regeneration failed. Please try again.`,
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
         
        });
      }
    } catch {
       setOpenModal(false)
      Swal.fire({
        title: "Failed!",
        text: `Regeneration failed. Please try again.`,
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
       
      });
    }
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Payment Transactions
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        <div className="mb-8">
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
                <div>
                  <label className="block text-sm font-medium">
                    Payment Status
                  </label>
                  <Field
                    as="select"
                    name="typeOfBooking"
                    className={` block w-full px-2 py-1 border border-gray-300
             rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="INITIATE">Initiate</option>
                    <option value="INPROCESS">In Process</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="FAILED">Failed</option>
                  </Field>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="phoneNumber"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter phone number"
                    onKeyPress={(e) => {
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault(); // Prevent non-numeric characters
                      }
                    }}
                  />
                </div>
                {/* department */}
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Department
                  </label>

                  <Select
                    name="departmentId"
                    value={
                      allDepartmentTypes
                        ?.filter((dept) => dept.isActive)
                        .map((dept) => ({
                          value: dept.departmentId,
                          label: dept.departmentName,
                        }))
                        .find(
                          (option) => option.value === values.departmentId
                        ) || null // Set the selected value
                    }
                    options={allDepartmentTypes
                      ?.filter((dept) => dept.isActive)
                      .map((dept) => ({
                        value: dept.departmentId,
                        label: dept.departmentName,
                      }))}
                    onChange={(selectedOption) =>
                      setFieldValue(
                        "departmentId",
                        selectedOption?.value || null
                      )
                    }
                    isClearable
                    placeholder="Department"
                    className="mt-[4px] text-sm"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        outline: "none",
                        boxShadow: "none",
                        borderColor: "#ced4da",
                        borderRadius: "6px",
                        height: "30px",
                        minHeight: "33px",
                      }),

                      menu: (base) => ({
                        ...base,
                        // padding: "4px 0",
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        fontSize: "0.775rem",
                        backgroundColor: isFocused ? "#F8F8F8" : "white",
                        color: isFocused ? "#0C3771" : "#000",
                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>
                {/* location category */}
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Location Category
                  </label>

                  <Select
                    name="entityId"
                    value={
                      allEntityTypes
                        ?.filter((dept) => dept.isActive)
                        .map((dept) => ({
                          value: dept.entityTypeId,
                          label: dept.entityTypeName,
                        }))
                        .find((option) => option.value === values.entityId) ||
                      null // Use values.entityId
                    }
                    options={allEntityTypes
                      ?.filter((entity) => entity.isActive)
                      .map((entity) => ({
                        value: entity.entityTypeId,
                        label: entity.entityTypeName,
                      }))}
                    onChange={(selectedOption) =>
                      setFieldValue("entityId", selectedOption?.value || null)
                    }
                    isClearable
                    placeholder="Location Category"
                    className="mt-[4px] text-sm"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        outline: "none",
                        boxShadow: "none",
                        borderColor: "#ced4da",
                        borderRadius: "6px",
                        height: "30px",
                        minHeight: "33px",
                      }),

                      menu: (base) => ({
                        ...base,
                        // padding: "4px 0",
                      }),
                      option: (base, { isFocused }) => ({
                        ...base,
                        fontSize: "0.775rem",
                        backgroundColor: isFocused ? "#F8F8F8" : "white",
                        color: isFocused ? "#0C3771" : "#6D7072",
                        cursor: "pointer",
                      }),
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
            ExportName="Payment Transactions"
            isFetchLoading={isTransactionPaymentReportsLoading}
            rowData={allTransactionPaymentReports || []}
            columnDefs={columnDefs}
            // onPageChange={handlePageChange}
            // totalRecords={totalEntityBookingRecords}
            enableAdvancedFilter={true}
          />
        </div>
        <PopupModal
          popupModalId="first-modal"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white"
          defaultBodyPadding={true}
        >
          <div className="px-10 py-14">
            <h1 className="text-blue-v1 font-semibold">
              Are you sure you want to regenerate the ticket for this booking?
            </h1>

            <div className="flex justify-center gap-8 mt-4 z-30">
              <button
                onClick={async () => {
                  await handleReGenerateTicket();
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
                {isReGenerateTicketLoading ? (
                  <span className="px-8">
                    <l-tailspin
                      size="15"
                      stroke="5"
                      speed="0.9"
                      color="white"
                    ></l-tailspin>
                  </span>
                ) : (
                  "Proceed"
                )}
              </button>

              <button
                onClick={() => setOpenModal(false)}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Deny
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </AdminLayout>
  );
}

export default PaymentTransactionReport;
