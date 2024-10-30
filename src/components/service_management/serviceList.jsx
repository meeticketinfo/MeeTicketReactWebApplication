import React, { useState } from "react"
import AgGridTable from "../tables/AgGridTable"

const ServiceList = () => {
    const [rowData] = useState([
        { serviceName: "Web Development", description: "Building responsive websites", price: 500, status: "Active" },
        { serviceName: "SEO Optimization", description: "Improving website search engine ranking", price: 300, status: "Inactive" },
        { serviceName: "Graphic Design", description: "Creating logos and visuals", price: 250, status: "Active" },
        { serviceName: "Digital Marketing", description: "Managing social media ads", price: 400, status: "Active" },
        { serviceName: "Content Writing", description: "Producing quality blog posts", price: 200, status: "Inactive" },
        { serviceName: "Mobile App Development", description: "Developing cross-platform apps", price: 600, status: "Active" },
        { serviceName: "Email Marketing", description: "Crafting email campaigns", price: 150, status: "Active" },
        { serviceName: "Video Editing", description: "Editing video content", price: 450, status: "Inactive" },
        { serviceName: "Social Media Management", description: "Handling social media profiles", price: 350, status: "Active" },
        { serviceName: "3D Modeling", description: "Creating 3D models", price: 700, status: "Inactive" },
        { serviceName: "UX/UI Design", description: "Designing user interfaces", price: 550, status: "Active" },
        { serviceName: "Web Hosting", description: "Providing hosting services", price: 100, status: "Inactive" },
        { serviceName: "Photography", description: "Professional photography services", price: 400, status: "Active" },
        { serviceName: "Illustration", description: "Creating illustrations and artwork", price: 300, status: "Inactive" },
        { serviceName: "Consulting", description: "Business consulting services", price: 800, status: "Active" }
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
          field: "serviceName",
          headerName: "Service Name",
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
          field: "price",
          headerName: "Price",
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
    export default ServiceList;
