import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable";
import { useDashboardStore } from "../../../store/dashboard/dashboardStore";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import { Field, Form, Formik } from "formik";

function FacilityBookings() {
  const {
    fetchAllFacilityBookingsByFilters,
    AllFacilityBookings,
    isFetchFacilityBookingsLoading,
  } = useDashboardStore();

  useEffect(() => {
    fetchAllFacilityBookingsByFilters({
      fromDate: getCurrentDate(),
      toDate: getCurrentDate(),
    });
  }, []);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
  };

  const onSubmit = (values) => {
    fetchAllFacilityBookingsByFilters({
      fromDate: values.fromDate,
      toDate: values.toDate,
    });
  };

  /** ✅ **Precompute totals before passing to the table** */
  const processedBookings = useMemo(() => {
    return AllFacilityBookings.map((row) => {
      const updatedRow = { ...row };

      row.facilities?.forEach((facility) => {
        const category = facility.facilityName?.trim().toLowerCase();
        const subcategory = facility.serviceVariantName?.trim().toLowerCase();

        if (!category || !subcategory) return;

        const quantityKey = `${category} - ${subcategory} Quantity`;
        const totalAmountKey = `${category} - ${subcategory} Total Amount`;

        updatedRow[quantityKey] =
          (updatedRow[quantityKey] || 0) + (facility.quantity || 0);
        updatedRow[totalAmountKey] =
          (updatedRow[totalAmountKey] || 0) + (facility.totalAmount || 0);
      });

      return updatedRow;
    });
  }, [AllFacilityBookings]);

  /** ✅ **Compute Total Footer Row** */
  const totalRow = useMemo(() => {
    const totals = {
      transactionId: "Total",
      bookingID: " ",
      status: " ",
      mobileNumber: " ",
      paymentType: " ",
      totaL_AMOUNT: 0, // ✅ Ensure it's a number
    };

    // ✅ Sum the "Total Amount" column from the original data
    AllFacilityBookings.forEach((row) => {
      totals["totaL_AMOUNT"] += Number(row.totaL_AMOUNT) || 0;
    });

    // ✅ Sum dynamic columns from processedBookings
    processedBookings.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key.includes("Quantity") || key.includes("Total Amount")) {
          totals[key] = (totals[key] || 0) + (Number(row[key]) || 0);
        }
      });
    });

    return [totals]; // ✅ This ensures no "S.No" is applied
  }, [processedBookings, AllFacilityBookings]);

  /** ✅ **Generate dynamic column definitions** */
  const getFacilityColumns = (data) => {
    const facilityGroups = {};

    data?.forEach((row) => {
      row.facilities?.forEach((facility) => {
        const category = facility.facilityName;
        const subcategory = facility.serviceVariantName;

        if (!facilityGroups[category]) {
          facilityGroups[category] = new Set();
        }
        facilityGroups[category].add(subcategory);
      });
    });

    return Object.entries(facilityGroups).map(([category, subcategories]) => ({
      headerName: category,
      headerClass: "text-blue-v2 text-center",
      children: [
        ...Array.from(subcategories).map((subcategory) => ({
          field: `${category.toLowerCase()} - ${subcategory.toLowerCase()} Quantity`,
          headerName: subcategory,
          width: 130,
          headerClass: "text-blue-v2 capitalize",
        })),

        {
          field: `${category} - Total Amount`,
          width: 120,
          headerName: "Total Amount",
          headerClass: "text-blue-v2 capitalize",
          valueGetter: (params) => {
            const totalAmount = params.data.facilities
              ?.filter((item) => item.facilityName === category)
              .reduce((sum, item) => sum + item.totalAmount, 0);
            return totalAmount;
          },
          valueFormatter: (params) =>
            params.value
              ? formatToCurrency(params.value, "INR", "en-IN")
              : "₹0",
        },
      ],
    }));
  };

  /** ✅ **Base Columns** */
  const baseColumns = [
    {
      headerName: "S.No",
      valueGetter: (params) =>
        params.data.transactionId === "Total" ? "" : params.node.rowIndex + 1,
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionId",
      headerName: "Transaction Id",
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
    {
      field: "bookingID",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
    },
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
    },
    { field: "mobileNumber", headerName: "Phone", headerClass: "text-blue-v2" },
    {
      field: "paymentType",
      headerName: "Payment Mode",
      headerClass: "text-blue-v2",
    },
  ];

  const columnDefs = [
    ...baseColumns,
    ...getFacilityColumns(AllFacilityBookings),
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
                    className="{`mt-1 block w-full px-2 py-1 border
             border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}"
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
                    className="{`mt-1 block w-full px-2 py-1 border
             border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}"
                  />
                </div>
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
          //   pinnedBottomRowData={totalRow}
        />
      </div>
    </AdminLayout>
  );
}

export default FacilityBookings;
