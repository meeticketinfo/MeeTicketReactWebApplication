import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import AgGridTable from "../../../components/tables/AgGridTable";

const WalkersPassSummaryReport = () => {

    const today = new Date();

    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        passType: "",
    });
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

    const handleSearch = async () => {
        try {
            setLoading(true);



           const today = new Date();

const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 6);

const payload = {
    fromDate:
        filters.fromDate ||
        lastWeek.toISOString().split("T")[0],

    toDate:
        filters.toDate ||
        today.toISOString().split("T")[0],

    passType: filters.passType,
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

            const filteredRows = filters.passType
                ? rows.filter(
                    (item) => item.passType === filters.passType
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
    const maxDate = new Date().toISOString().split("T")[0];
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
                <div className="bg-white shadow rounded-lg p-5 border mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                From Date
                            </label>
                            <input
                                type="date"
                                name="fromDate"
                                value={filters.fromDate}
                                onChange={handleChange}
                                max={maxDate}
                                className="w-full border rounded px-3 py-2"
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                To Date
                            </label>
                            <input
                                type="date"
                                name="toDate"
                                value={filters.toDate}
                                onChange={handleChange}
                                min={filters.fromDate || ""}
                                max={maxDate}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Type of Pass
                            </label>
                            <select
                                name="passType"
                                value={filters.passType}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2"
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

                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-[#09094D] hover:bg-[#07073D] text-white px-6 py-2 rounded"
                            >
                                {loading ? "Loading..." : "Search"}
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