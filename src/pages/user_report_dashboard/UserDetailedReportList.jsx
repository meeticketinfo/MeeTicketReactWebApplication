import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import AgGridTable from "../../components/tables/AgGridTable";
import { formatToCurrency } from "../../utils/TypographyHelper";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { useParkStore } from "../../store/masters/parksStore";
import { getDateRange } from "../../utils/Helper";
import { userDashboardStore } from "../../store/userDashboard/userDashboardStore";
const UserDetailedReportList = () => {
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const range = localStorage.getItem("range-filter");
  const { fromDate, toDate } = getDateRange(range);
  const { allParks, fetchAllParks } = useParkStore();
  const [DepartmentId, setdepartmentId] = useState(
    UserTransactionReportFilter.departmentId || ""
  );
  const [parkId, setparkId] = useState(
    UserTransactionReportFilter.parkId || ""
  );
  const [LocationCatgoryId, setLocationCatgoryId] = useState(
    UserTransactionReportFilter.categoryId || ""
  );
  const {
    isUserDetailedTransactionReportLoading,
    fetchUserDetailedTransactionReport,
    UserDetailedTransactionReportData,
 
  } = userDashboardStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "createdDate",
      maxWidth: "480",
      headerName: "Date and Time of Transaction",
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
      field: "action",
      maxWidth: "180",
      headerName: "Actions",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => (
        <Link
          className="bg-blue-v2 text-white py-1.5 px-2.5 leading-none rounded-lg text-sm"
          to={"/transactions-order-tracker"}
          state={{
            orderId: params.data.orderId,
            date: params.data.date,
            mobileNumber: params.data.mobileNumber,
            parkName: params.data.parkName,
            status: params.data.status,
            amount: params.data.amount,
          }}
        >
          View Track Order
        </Link>
      ),
    },
    {
      field: "phonE_NUMBER",
      headerName: "Mobile Number of user",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "entityTypeName",
      headerName: "Location Category",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "locationName",
      headerName: "Location name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "confirmedTxnAmount",
      headerName: "Amount",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "resultStatus",
      headerName: "Transaction Status",
      width: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "resultStatus",
      headerName: "Ticket Status",
      width: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "transactionId",
      headerName: "Order ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingId",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "resultMsg",
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
      cellRenderer: (params) => (
        <span title={params.value}>{params.value ?? "N/A"}</span>
      ),
    },
  ]);
 const initialValues = {
    fromDate: UserTransactionReportFilter?.fromDate || fromDate,
    toDate: UserTransactionReportFilter?.toDate || toDate,
    parkId: UserTransactionReportFilter?.parkId || "",
    departmentId: UserTransactionReportFilter?.departmentId || "",
    entityTypeId: UserTransactionReportFilter?.entityTypeId || "",
    mobileNumber: UserTransactionReportFilter?.mobileNumber || "",
  };
  useEffect(() => {
    fetchUserDetailedTransactionReport({
      fromDate: UserTransactionReportFilter?.fromDate || fromDate,
      toDate: UserTransactionReportFilter?.toDate || toDate,
      parkId: UserTransactionReportFilter.parkId || parkId,
      departmentId: UserTransactionReportFilter?.departmentId || "",
      entityTypeId: UserTransactionReportFilter?.entityTypeId || "",
      mobileNumber: UserTransactionReportFilter?.mobileNumber || "",
    });
  }, []);

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);

 

  const onSubmit = (values) => {
    fetchUserDetailedTransactionReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      parkId: values.parkId,
      departmentId: values.departmentId,
      entityTypeId: values.entityTypeId,
      mobileNumber: values.mobileNumber,
    });
    localStorage.setItem(
      "transactionPayload",
      JSON.stringify({
        ...UserTransactionReportFilter,
        fromDate: values.fromDate,
        toDate: values.toDate,
        mobileNumber: values.mobileNumber,
      })
    );
  };
  return (
    <>
      <div>
        <div>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block text-xs font-medium text-gray-700"
                  >
                    From Date
                  </label>
                  <Field
                    type="datetime-local"
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
                    type="datetime-local"
                    name="toDate"
                    className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    // min={values.fromDate || getCurrentDateStartTime()}
                    onChange={(e) => {
                      const toDateValue = e.target.value;
                      setFieldValue("toDate", toDateValue);
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
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "departmentId",
                        selectedOption?.value || ""
                      );
                      setdepartmentId(selectedOption?.value || "");
                    }}
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
                    onChange={(selectedOption) => {
                      setFieldValue("entityId", selectedOption?.value || ""),
                        setLocationCatgoryId(selectedOption?.value || "");
                    }}
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
                {/* location */}
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Location
                  </label>

                  <Select
                    name="ParkId"
                    value={
                      allParks
                        ?.filter((park) => park.isActive)
                        .map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))
                        .find((option) => option.value === values.ParkId) ||
                      null
                    }
                    options={allParks
                      ?.filter((park) => park.isActive)
                      .map((park) => ({
                        value: park.id,
                        label: park.name,
                      }))}
                    onChange={(selectedOption) =>
                      setFieldValue("ParkId", selectedOption?.value || "")
                    }
                    isClearable
                    placeholder="Location"
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
                {/* mobile number */}
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <Field
                    type="text"
                    maxLength="10"
                    name="mobileNumber"
                    className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                    placeholder="Enter phone number"
                    onKeyPress={(e) => {
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault(); // Prevent non-numeric characters
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                    disabled={isUserDetailedTransactionReportLoading}
                  >
                    Search
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <AgGridTable
            ExportName="UserStatusTransactionReport"
            rowData={UserDetailedTransactionReportData}
            columnDefs={columnDefs}
            isFetchLoading={isUserDetailedTransactionReportLoading}
          />
        </div>
      </div>
    </>
  );
};

export default UserDetailedReportList;
