import React, { useState } from "react"
import AgGridTable from "../tables/AgGridTable"

const ServiceVarientList = () => {
    const [rowData] = useState([
        { variantName: "Basic", description: "Standard package", additionalPrice: 50, availability: "In Stock" },
        { variantName: "Premium", description: "Extended features", additionalPrice: 100, availability: "Out of Stock" },
        { variantName: "Gold", description: "Gold-level features", additionalPrice: 150, availability: "In Stock" },
        { variantName: "Silver", description: "Budget-friendly", additionalPrice: 30, availability: "In Stock" },
        { variantName: "Enterprise", description: "Enterprise solutions", additionalPrice: 200, availability: "Out of Stock" },
        { variantName: "Starter", description: "Beginner package", additionalPrice: 20, availability: "In Stock" },
        { variantName: "Advanced", description: "Advanced features", additionalPrice: 120, availability: "In Stock" },
        { variantName: "Custom", description: "Customized options", additionalPrice: 180, availability: "Out of Stock" },
        { variantName: "Family", description: "Family-friendly version", additionalPrice: 70, availability: "In Stock" },
        { variantName: "Student", description: "Discounted for students", additionalPrice: 40, availability: "In Stock" },
        { variantName: "Professional", description: "For professionals", additionalPrice: 130, availability: "Out of Stock" },
        { variantName: "Exclusive", description: "Exclusive features", additionalPrice: 250, availability: "In Stock" },
        { variantName: "Trial", description: "Trial period access", additionalPrice: 10, availability: "In Stock" },
        { variantName: "VIP", description: "VIP access and support", additionalPrice: 300, availability: "Out of Stock" },
        { variantName: "Limited Edition", description: "Special edition", additionalPrice: 275, availability: "In Stock" }
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
            field: "variantName",
            headerName: "Varient Name",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "additionalPrice",
            headerName: " Additional Price",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "availability",
            headerName: "Availability",
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
export default ServiceVarientList;
