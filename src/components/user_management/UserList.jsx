import React, { useState } from "react";
import AgGridTable from "../tables/AgGridTable";

const UserList = () => {
  const rowData = [
    {
      username: "john_doe",
      email: "john.doe@example.com",
      role: "Admin",
      createdAt: "2023-01-15",
    },
    {
      username: "jane_smith",
      email: "jane.smith@example.com",
      role: "User",
      createdAt: "2023-02-20",
    },
    {
      username: "michael_brown",
      email: "michael.brown@example.com",
      role: "Editor",
      createdAt: "2023-03-10",
    },
    {
      username: "sarah_white",
      email: "sarah.white@example.com",
      role: "User",
      createdAt: "2023-04-05",
    },
    {
      username: "emily_jones",
      email: "emily.jones@example.com",
      role: "Admin",
      createdAt: "2023-05-18",
    },
    {
      username: "kevin_jackson",
      email: "kevin.jackson@example.com",
      role: "User",
      createdAt: "2023-06-11",
    },
    {
      username: "laura_taylor",
      email: "laura.taylor@example.com",
      role: "Moderator",
      createdAt: "2023-07-07",
    },
    {
      username: "chris_anderson",
      email: "chris.anderson@example.com",
      role: "User",
      createdAt: "2023-08-19",
    },
    {
      username: "lisa_martin",
      email: "lisa.martin@example.com",
      role: "Editor",
      createdAt: "2023-09-01",
    },
    {
      username: "daniel_clark",
      email: "daniel.clark@example.com",
      role: "Admin",
      createdAt: "2023-10-20",
    },
    {
      username: "stephanie_lee",
      email: "stephanie.lee@example.com",
      role: "User",
      createdAt: "2023-11-12",
    },
    {
      username: "paul_walker",
      email: "paul.walker@example.com",
      role: "Moderator",
      createdAt: "2023-12-03",
    },
    {
      username: "nancy_harris",
      email: "nancy.harris@example.com",
      role: "User",
      createdAt: "2024-01-08",
    },
    {
      username: "george_miller",
      email: "george.miller@example.com",
      role: "Editor",
      createdAt: "2024-02-15",
    },
    {
      username: "amanda_turner",
      email: "amanda.turner@example.com",
      role: "User",
      createdAt: "2024-03-07",
    },
    {
      username: "david_wilson",
      email: "david.wilson@example.com",
      role: "Admin",
      createdAt: "2024-04-22",
    },
    {
      username: "susan_moore",
      email: "susan.moore@example.com",
      role: "User",
      createdAt: "2024-05-25",
    },
    {
      username: "robert_thomas",
      email: "robert.thomas@example.com",
      role: "Moderator",
      createdAt: "2024-06-30",
    },
    {
      username: "anna_james",
      email: "anna.james@example.com",
      role: "Editor",
      createdAt: "2024-07-17",
    },
    {
      username: "mark_jones",
      email: "mark.jones@example.com",
      role: "User",
      createdAt: "2024-08-03",
    },
  ];

  const columnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    { field: "role", headerName: "Role", flex: 1, headerClass: "text-blue-v2" },
    {
      field: "createdAt",
      headerName: "Registered On",
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
  ];
  return (
    <>
      <AgGridTable rowData={rowData} columnDefs={columnDefs} />
    </>
  );
};

export default UserList;
