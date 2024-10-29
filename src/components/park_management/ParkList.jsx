import React, { useState } from "react";
import AgGridTable from "../tables/AgGridTable";

const ParkList = () => {
  const rowData = [
    {
      name: "Central Park",
      location: "New York",
      areaSize: "843,000",
      status: "Open",
    },
    {
      name: "Golden Gate Park",
      location: "San Francisco",
      areaSize: "1,017,000",
      status: "Open",
    },
    {
      name: "Millennium Park",
      location: "Chicago",
      areaSize: "319,000",
      status: "Open",
    },
    {
      name: "Balboa Park",
      location: "San Diego",
      areaSize: "1,200,000",
      status: "Open",
    },
    {
      name: "Chapultepec Park",
      location: "Mexico City",
      areaSize: "1,695,000",
      status: "Closed",
    },
    {
      name: "Hyde Park",
      location: "London",
      areaSize: "350,000",
      status: "Open",
    },
    {
      name: "Stanley Park",
      location: "Vancouver",
      areaSize: "1,001,000",
      status: "Open",
    },
    {
      name: "Griffith Park",
      location: "Los Angeles",
      areaSize: "4,310,000",
      status: "Open",
    },
    {
      name: "Phoenix Park",
      location: "Dublin",
      areaSize: "1,752,000",
      status: "Closed",
    },
    {
      name: "Lumphini Park",
      location: "Bangkok",
      areaSize: "142,000",
      status: "Open",
    },
    {
      name: "Royal Botanic Gardens",
      location: "Sydney",
      areaSize: "190,000",
      status: "Open",
    },
    {
      name: "Ueno Park",
      location: "Tokyo",
      areaSize: "133,000",
      status: "Closed",
    },
    {
      name: "Parc des Buttes-Chaumont",
      location: "Paris",
      areaSize: "61,000",
      status: "Open",
    },
    {
      name: "Retiro Park",
      location: "Madrid",
      areaSize: "350,000",
      status: "Open",
    },
    {
      name: "Englischer Garten",
      location: "Munich",
      areaSize: "1,500,000",
      status: "Closed",
    },
    {
      name: "Prospect Park",
      location: "Brooklyn",
      areaSize: "585,000",
      status: "Open",
    },
    {
      name: "Gorky Park",
      location: "Moscow",
      areaSize: "300,000",
      status: "Open",
    },
    {
      name: "Bosque de Chapultepec",
      location: "Mexico City",
      areaSize: "1,600,000",
      status: "Open",
    },
    {
      name: "Bicentennial Park",
      location: "Sydney",
      areaSize: "500,000",
      status: "Closed",
    },
    {
      name: "Hibiya Park",
      location: "Tokyo",
      areaSize: "161,000",
      status: "Open",
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
      field: "name",
      headerName: "Park Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "areaSize",
      headerName: "Area Size (sq ft)",
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
  ];
  return (
    <>
      <AgGridTable rowData={rowData} columnDefs={columnDefs} />
    </>
  );
};

export default ParkList;
