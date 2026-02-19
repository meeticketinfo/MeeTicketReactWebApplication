import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable";
import { useDashboardStore } from "../../../store/dashboard/dashboardStore";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import { Field, Form, Formik } from "formik";
import useAuthStore from "../../../store/authStore";

function FacilityBookings() {
  const [isBookingDate, setIsBookingDate] = useState(false);
  const {
    fetchAllFacilityBookingsByFilters,
    AllFacilityBookings,
    isFetchFacilityBookingsLoading,
  } = useDashboardStore();
  const { decodedTokenData } =
    useAuthStore();
  const parkId = decodedTokenData?.data?.ParkId;
  useEffect(() => {
    fetchAllFacilityBookingsByFilters({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
      bookingDateFrom: isBookingDate ? getCurrentDate() : "",
      bookingDateTo: isBookingDate ? getCurrentDate() : "",
      bookingSource: "",
      bookingsByCounter: "",
    });
  }, []);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    bookingDateFrom: isBookingDate ? getCurrentDate() : "",
    bookingDateTo: isBookingDate ? getCurrentDate() : "",
    bookingSource: "",
    bookingsByCounter: "",
  };

  const onSubmit = (values) => {
    console.log("values", values);
    fetchAllFacilityBookingsByFilters({
      fromDate: !isBookingDate ? values.fromDate : "",
      toDate: !isBookingDate ? values.toDate : "",
      bookingDateFrom: isBookingDate ? values.fromDate : "",
      bookingDateTo: isBookingDate ? values.toDate : "",
      bookingSource: values.bookingSource,
      bookingsByCounter: values.bookingsByCounter,
    });
  };

  /** ✅ **Precompute totals before passing to the table** */
  const processedBookings = useMemo(() => {
    return AllFacilityBookings.map((row) => {
      const updatedRow = { ...row };

      row.facilities?.forEach((facility) => {
        const {
          facilityName,
          serviceName,
          serviceVariantName,
          quantity,
          totalAmount,
        } = facility;

        if (!facilityName || !serviceVariantName) return;

        // If Facility Name and Service Name are the same, use a 2-level structure
        if (facilityName === serviceName) {
          const quantityKey = `${facilityName} - ${serviceVariantName} Quantity`;
          const totalAmountKey = `${facilityName} - Total Amount`;

          updatedRow[quantityKey] =
            (updatedRow[quantityKey] || 0) + (quantity || 0);
          updatedRow[totalAmountKey] =
            (updatedRow[totalAmountKey] || 0) + (totalAmount || 0);
        } else {
          // Use a 3-level structure when Facility Name and Service Name are different
          const quantityKey = `${facilityName} - ${serviceName} - ${serviceVariantName} Quantity`;
          const totalAmountKey = `${facilityName} - ${serviceName} - Total Amount`;

          updatedRow[quantityKey] =
            (updatedRow[quantityKey] || 0) + (quantity || 0);
          updatedRow[totalAmountKey] =
            (updatedRow[totalAmountKey] || 0) + (totalAmount || 0);
        }
      });

      return updatedRow;
    });
  }, [AllFacilityBookings]);

  /** ✅ **Generate dynamic column definitions** */
  const getFacilityColumns = (data) => {
    const facilityGroups = {};

    data?.forEach((row) => {
      row.facilities?.forEach((facility) => {
        const { facilityName, serviceName, serviceVariantName } = facility;

        if (!facilityName || !serviceVariantName) return;

        if (!facilityGroups[facilityName]) {
          facilityGroups[facilityName] = {};
        }

        if (facilityName === serviceName) {
          if (!facilityGroups[facilityName]["direct"]) {
            facilityGroups[facilityName]["direct"] = new Set();
          }
          facilityGroups[facilityName]["direct"].add(serviceVariantName);
        } else {
          if (!facilityGroups[facilityName][serviceName]) {
            facilityGroups[facilityName][serviceName] = new Set();
          }
          facilityGroups[facilityName][serviceName].add(serviceVariantName);
        }
      });
    });

    return Object.entries(facilityGroups).map(([facilityName, services]) => {
      return {
        headerName: facilityName,
        headerClass: "text-blue-v2 text-center",
        cellStyle: { textAlign: "center" },
        children: Object.entries(services).flatMap(
          ([serviceName, serviceVariants]) =>
            serviceName === "direct"
              ? // **2-Level Hierarchy** (Facility → Service Variant)
              [
                ...Array.from(serviceVariants).map((serviceVariantName) => ({
                  field: `${facilityName} - ${serviceVariantName} Quantity`,
                  headerName: serviceVariantName,
                  width: 130,
                  headerClass: "text-blue-v1 capitalize  ",
                })),
                {
                  field: `${facilityName} - Total Amount`,
                  width: 120,
                  headerName: "Total Amount",
                  headerClass: "text-blue-v2 capitalize",
                  valueGetter: (params) =>
                    params.data[`${facilityName} - Total Amount`] || 0,
                  valueFormatter: (params) =>
                    params.value
                      ? formatToCurrency(params.value, "INR", "en-IN")
                      : "₹0",
                },
              ]
              : // **3-Level Hierarchy** (Facility → Service → Service Variant)
              [
                {
                  headerName: serviceName,
                  headerClass: "text-blue-v2 text-center",
                  children: [
                    ...Array.from(serviceVariants).map(
                      (serviceVariantName) => ({
                        field: `${facilityName} - ${serviceName} - ${serviceVariantName} Quantity`,
                        headerName: serviceVariantName,
                        width: 130,
                        headerClass: "text-blue-v2 capitalize ",
                      })
                    ),
                    {
                      field: `${facilityName} - ${serviceName} - Total Amount`,
                      width: 120,
                      headerName: "Total Amount",
                      headerClass: "text-blue-v2 capitalize",
                      valueGetter: (params) =>
                        params.data[
                        `${facilityName} - ${serviceName} - Total Amount`
                        ] || 0,
                      valueFormatter: (params) =>
                        params.value
                          ? formatToCurrency(params.value, "INR", "en-IN")
                          : "₹0",
                    },
                  ],
                },
              ]
        ),
      };
    });
  };

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        params.data.transactionId === "Total" ? "" : params.node.rowIndex + 1,
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "bookingSource",
      
      headerName: "Creacted By",
      headerClass: "text-blue-v2",
    },
    {
      field: "createD_BY",
      minwidth: "50",
      headerName: "Creacted Mobile no",
      headerClass: "text-blue-v2",
    },
    {
      field: "bookingID",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
    },
    {
      field: "paymentType",
      maxWidth: "130",
      headerName: "Payment Mode",
      headerClass: "text-blue-v2",
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return " ";
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
      field: "bookinG_DATE",
      headerName: "Booking Date",
      width: 100,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return " ";
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


    { field: "mobileNumber", maxWidth: "120", headerName: "Phone", headerClass: "text-blue-v2" },
    {
      field: "transactionId",
      headerName: "Transaction Id",
      headerClass: "text-blue-v2",
    },

    ...getFacilityColumns(AllFacilityBookings),
    {
      field: "totaL_AMOUNT",
      headerName: "Total Amount (Rs.)",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? formatToCurrency(params.value, "INR", "en-IN") : "₹0",
    },
    {
      field: "status",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        return params.value ? (
          <span className=" ">{params.value}</span>
        ) : (
          <span className="text-gray-900">N/A</span>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Facility Bookings
            </h1>
          </div>
        </div>
        <div className="">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ values, setFieldValue }) => (
              <Form className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Booking/Purchase Date
                  </label>
                  <select
                    onChange={(e) => {
                      setIsBookingDate(e.target.value === "true");
                    }}
                    name="bookingDate"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="false">Purchase Date</option>
                    <option value="true">Booking Date</option>
                  </select>
                </div>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Created By
                  </label>
                  <Field
                    as="select"
                    name="bookingSource"
                    className={` block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Created By</option>

                    <option value="MeeTicketApp">MeeTicket App</option>
                    <option value="Counter">All Counters</option>
                    <option value="NehruZooPark@gmail.com">NehruZooPark@gmail.com</option>
                    <option value="NehruZooPark1@gmail.com">NehruZooPark1@gmail.com</option>
                    <option value="NehruZooPark2@gmail.com">NehruZooPark2@gmail.com</option>
                  </Field>
                </div>
                {/* {parkId === "100" && <div>
                  <label className="block text-sm font-medium">
                    Counters
                  </label>
                  <Field
                    as="select"
                    name="bookingsByCounter"
                    className={` block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                  >
                    <option value="">Select Counter</option>
                    <option value="NehruZooPark@gmail.com">NehruZooPark@gmail.com</option>
                    <option value="NehruZooPark1@gmail.com">NehruZooPark1@gmail.com</option>
                    <option value="NehruZooPark2@gmail.com">NehruZooPark2@gmail.com</option>
                  </Field>
                </div>} */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                  >
                    Search
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <AgGridTable
          rowData={processedBookings}
          columnDefs={columnDefs}
          isFetchLoading={isFetchFacilityBookingsLoading}
          ExportName="Facility Bookings"
        //   pinnedBottomRowData={totalRow}
        />
      </div>
    </AdminLayout>
  );
}

export default FacilityBookings;
