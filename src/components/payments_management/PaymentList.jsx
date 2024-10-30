import React, { useState } from "react"
import AgGridTable from "../tables/AgGridTable"

const PaymentList = () => {
    const [rowData] = useState([
        { date: "2024-10-01", paymentId: "PAY123456", amount: 150.00, status: "Completed", method: "Credit Card" },
        { date: "2024-10-02", paymentId: "PAY123457", amount: 75.50, status: "Pending", method: "Debit Card" },
        { date: "2024-10-03", paymentId: "PAY123458", amount: 200.00, status: "Failed", method: "Bank Transfer" },
        { date: "2024-10-04", paymentId: "PAY123459", amount: 100.00, status: "Completed", method: "Credit Card" },
        { date: "2024-10-05", paymentId: "PAY123460", amount: 300.75, status: "Completed", method: "PayPal" },
        { date: "2024-10-06", paymentId: "PAY123461", amount: 50.00, status: "Pending", method: "Cash" },
        { date: "2024-10-07", paymentId: "PAY123462", amount: 125.00, status: "Completed", method: "Credit Card" },
        { date: "2024-10-08", paymentId: "PAY123463", amount: 80.25, status: "Failed", method: "Debit Card" },
        { date: "2024-10-09", paymentId: "PAY123464", amount: 110.00, status: "Completed", method: "Credit Card" },
        { date: "2024-10-10", paymentId: "PAY123465", amount: 250.00, status: "Pending", method: "Bank Transfer" },
        { date: "2024-10-11", paymentId: "PAY123466", amount: 60.00, status: "Completed", method: "Cash" },
        { date: "2024-10-12", paymentId: "PAY123467", amount: 175.75, status: "Completed", method: "Credit Card" },
        { date: "2024-10-13", paymentId: "PAY123468", amount: 90.00, status: "Failed", method: "PayPal" },
        { date: "2024-10-14", paymentId: "PAY123469", amount: 145.50, status: "Completed", method: "Debit Card" },
        { date: "2024-10-15", paymentId: "PAY123470", amount: 200.00, status: "Pending", method: "Credit Card" }
    ]


    )
    const [columnDefs] = useState([
        {
            headerName: "S.No",
            valueGetter: "node.rowIndex + 1",
            width: 100,
            headerClass: "text-blue-v2",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "paymentId",
            headerName: "Payment Id",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "method",
            headerName: "Method",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: () => <button>View</button>,
            flex: 1,
            headerClass: "text-blue-v2",
        },
    ]);
    return (
        <>
            {/* <DashboardCard07> */}
            <AgGridTable rowData={rowData} columnDefs={columnDefs} />
            {/* </DashboardCard07> */}
        </>
    );
};
export default PaymentList;
