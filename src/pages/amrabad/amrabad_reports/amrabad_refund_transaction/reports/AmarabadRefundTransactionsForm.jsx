import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { useSearchParams } from "react-router-dom";
import { useAmrabadConsolidatedStore } from "../../../../../store/amrabad/reports/ConsolidatedStore";
import { cleanString, getEndOfCurrentDay, getStartOfCurrentDay } from "../../../../../utils/Helper";
import { usePackagesStore } from "../../../../../store/amrabad/masters/packagesStore";
import { useAmrabadRefundStore } from "../../../../../store/amrabad/reports/RefundTransactionStore";

const AmarabadRefundTransactionsForm = () => {
    const [searchParams, setSearchParams] = useSearchParams();
     const {
      amrabadRefundTransactions,
      isFetchAmrabadRefundTransactions,
      fetchAmrabadRefundTransactions
      } = useAmrabadRefundStore();
    const startOfDay = getStartOfCurrentDay();
    const endOfDay = getEndOfCurrentDay();

    useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("RefundStatus");
        setSearchParams(newSearchParams);
    }, [searchParams]);
    const { AllPackages, getPackages, getHouses, AllHouses } = usePackagesStore();

    // Load packages on component mount
    useEffect(() => {
        getPackages();
    }, [getPackages]);

    // Load houses if packageId is present in search params
    useEffect(() => {
        const packageId = searchParams.get("packageId");
        if (packageId) {
            getHouses(packageId);
        }
    }, [searchParams, getHouses]);


    const initialValues = {
        fromDate: cleanString(searchParams.get("fromDate"), "_", ":") || startOfDay,
        toDate: cleanString(searchParams.get("toDate"), "_", ":") || endOfDay,
        mobileNumber: searchParams.get("mobileNumber") || "",
        packageId: searchParams.get("packageId") || "",
        roomId: searchParams.get("roomId") || "",
    };

    const overAllOnSubmit = (values) => {
        // Update URL search params with form values
        const newSearchParams = new URLSearchParams();
        Object.keys(values).forEach((key) => {
            if (values[key]) {
                newSearchParams.set(key, cleanString(values[key], ":", "_"));
            }
        });
        setSearchParams(newSearchParams);
        localStorage.setItem("amrabadRefundInnerTransactionSearchParams", newSearchParams);

        const payload = {
            fromDate: values.fromDate,
            toDate: values.toDate,
            packageId: values.packageId,
            roomId: values.roomId,
            mobileNumber: values.mobileNumber,
        };

        fetchAmrabadRefundTransactions(payload);
    };

    const resetForm = (setValues) => {
        const payload = {
            fromDate: startOfDay,
            toDate: endOfDay,
            packageId: "",
            roomId: "",
            mobileNumber: "",
        };

        // Clear URL search params
        setSearchParams(new URLSearchParams());

        localStorage.setItem("amrabadRefundInnerTransactionSearchParams", "");
        setValues(payload);
        fetchAmrabadRefundTransactions(payload);
    };

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                onSubmit={overAllOnSubmit}
            >
                {({ values, setFieldValue, setValues }) => (
                    <Form>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 gap-x-3 py-3">
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
                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    onChange={(e) => {
                                        const fromDateValue = e.target.value;
                                        setFieldValue("fromDate", fromDateValue);
                                        if (new Date(fromDateValue) > new Date(values.toDate)) {
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
                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                    onChange={(e) => {
                                        const toDateValue = e.target.value;
                                        setFieldValue("toDate", toDateValue);
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
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        setFieldValue("mobileNumber", e.target.value);
                                    }}
                                />
                            </div>
                            {/* Packages */}
                            <div>
                                <label
                                    htmlFor="packageId"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    Packages
                                </label>
                                <Field
                                    as="select"
                                    name="packageId"
                                    placeholder="Select Package"
                                    onChange={(e) => {
                                        const packageId = e.target.value;
                                        setFieldValue("packageId", packageId);
                                        // Clear house selection when package changes
                                        setFieldValue("roomId", "");
                                        if (packageId) {
                                            getHouses(packageId);
                                        }
                                    }}
                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                >
                                    <option value="">Select Package</option>
                                    {AllPackages.map((item) => (
                                        <option key={item.packageId} value={item.packageId}>
                                            {item.packageName}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            {/* Houses */}
                            <div>
                                <label
                                    htmlFor="roomId"
                                    className="block text-xs font-medium text-gray-700"
                                >
                                    House
                                </label>
                                <Field
                                    as="select"
                                    name="roomId"
                                    placeholder="Select House"
                                    disabled={values.packageId == ""}
                                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                >
                                    <option value="">Select House</option>
                                    {AllHouses.map((item) => (
                                        <option key={item.roomId} value={item.roomId}>
                                            {item.roomName}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            <div className="flex gap-2 items-end">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                                    disabled={isFetchAmrabadRefundTransactions}
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                                    onClick={() => resetForm(setValues)}
                                    disabled={isFetchAmrabadRefundTransactions}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default AmarabadRefundTransactionsForm;
