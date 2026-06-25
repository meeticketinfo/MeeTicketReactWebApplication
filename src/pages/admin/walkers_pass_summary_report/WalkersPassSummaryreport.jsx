import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import AgGridTable from "../../../components/tables/AgGridTable";

const formatDateForInput = (date) => date.toISOString().split("T")[0];

const getDefaultFilters = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    return {
        fromDate: formatDateForInput(lastWeek),
        toDate: formatDateForInput(today),
        passType: "",
    };
};

const WalkersPassSummaryReport = () => {

    const [filters, setFilters] = useState(getDefaultFilters);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [summary, setSummary] = useState({
        netQuantity: 0,
        netTotalAmount: 0,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };

            // Clear To Date if From Date becomes later
            if (
                name === "fromDate" &&
                updated.toDate &&
                updated.toDate < value
            ) {
                updated.toDate = "";
            }

            return updated;
        });
    };

    const handleSearch = async (searchFilters = filters) => {
        try {
            setLoading(true);

            const appliedFilters = searchFilters?.target ? filters : searchFilters;
            const defaultFilters = getDefaultFilters();
            const payload = {
                fromDate: appliedFilters.fromDate || defaultFilters.fromDate,
                toDate: appliedFilters.toDate || defaultFilters.toDate,
                passType: appliedFilters.passType || "",
            };

            console.log("Final Payload:", payload);

            const response = await apiService.post(
                API_ENDPOINTS.MASTERS.WALKERS_PASS.WALKER_PASS_SUMMARY_REPORT,
                payload
            );

            console.log("FULL RESPONSE:", response);
            console.log("RESPONSE DATA:", response?.data);
            console.log("RESPONSE DATA.DATA:", response?.data?.data);
            console.log("IS ARRAY:", Array.isArray(response?.data?.data));

            const rows = response?.data?.data || [];

            const filteredRows = appliedFilters.passType
                ? rows.filter(
                    (item) => item.passType === appliedFilters.passType
                )
                : rows;

            console.log("ROWS TO GRID:", filteredRows);

            setReportData(filteredRows);
            setSummary(
                response?.data?.summary || {
                    netQuantity: 0,
                    netTotalAmount: 0,
                }
            );
        } catch (error) {
            console.error("Error fetching summary report:", error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        const defaultFilters = getDefaultFilters();
        setFilters(defaultFilters);
        await handleSearch(defaultFilters);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const columnDefs = [
        {
            field: "sno",
            headerName: "S.No",
            maxWidth: 100,
            valueGetter: (params) => {
                if (params.node?.rowPinned) {
                    return "";
                }
                return params.node.rowIndex + 1;
            },
            headerClass: "text-blue-v2",
        },
        {
            field: "passType",
            headerName: "Pass Type",
            flex: 1,
            headerClass: "text-blue-v2",
            cellStyle: (params) =>
                params.node?.rowPinned
                    ? { fontWeight: "bold" }
                    : null,
        },
        {
            field: "totalTicketsSold",
            headerName: "Total Tickets Sold",
            flex: 1,
            headerClass: "text-blue-v2",
            cellStyle: (params) =>
                params.node?.rowPinned
                    ? { fontWeight: "bold" }
                    : null,
        },
        {
            field: "ticketCost",
            headerName: "Each Ticket Cost",
            flex: 1,
            headerClass: "text-blue-v2",
            cellStyle: (params) =>
                params.node?.rowPinned
                    ? { fontWeight: "bold" }
                    : null,
            valueFormatter: (params) => {
                if (params.node?.rowPinned) {
                    return params.value;
                }

                return params.value
                    ? `₹${Number(params.value).toLocaleString()}`
                    : "";
            },
        },
        {
            field: "soldTicketsAmount",
            headerName: "Sold Tickets Amount",
            flex: 1,
            headerClass: "text-blue-v2",
            cellStyle: (params) =>
                params.node?.rowPinned
                    ? { fontWeight: "bold" }
                    : null,
            valueFormatter: (params) =>
                params.value
                    ? `₹${Number(params.value).toLocaleString()}`
                    : "",
        },
    ];
    const footerRow =
        reportData.length > 0
            ? [
                {
                    sno: " ",
                    passType: "Net Quantity",
                    totalTicketsSold: summary.netQuantity,
                    ticketCost: "Net Total Amount",
                    soldTicketsAmount: summary.netTotalAmount,
                },
            ]
            : [];
    console.log("Current reportData:", reportData);
    const maxDate = formatDateForInput(new Date());
    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Walker's Pass Summary Report
                    </h2>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 py-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                From Date
                            </label>
                            <input
                                type="date"
                                name="fromDate"
                                value={filters.fromDate}
                                onChange={handleChange}
                                max={maxDate}
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />

                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                To Date
                            </label>
                            <input
                                type="date"
                                name="toDate"
                                value={filters.toDate}
                                onChange={handleChange}
                                min={filters.fromDate || ""}
                                max={maxDate}
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700">
                                Type of Pass
                            </label>
                            <select
                                name="passType"
                                value={filters.passType}
                                onChange={handleChange}
                                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                            >
                                <option value="">All</option>
                                <option value="Monthly Walker's Pass">
                                    Monthly Walker's Pass
                                </option>
                                <option value="Monthly Senior Citizen">
                                    Monthly Senior Citizen
                                </option>
                                <option value="Annual Walker's Pass">
                                    Annual Walker's Pass
                                </option>
                                <option value="Annual Senior Citizen">
                                    Annual Senior Citizen
                                </option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={loading}
                                className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-600 border border-gray-500 hover:border-gray-600"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ag Grid Table */}
                <AgGridTable
                    ExportName="Walkers Pass Summary Report"
                    rowData={reportData}
                    columnDefs={columnDefs}
                    pinnedBottomRowData={footerRow}
                    isFetchLoading={loading}
                    isPagination={false}
                    showSearch={false}
                    tableHeight={reportData.length > 10 ? 550 : 300}
                />


            </div>
        </AdminLayout>
    );

}
export default WalkersPassSummaryReport;