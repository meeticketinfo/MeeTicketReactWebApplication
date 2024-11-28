import React, { useState } from "react";

const NestedTable = ({ data }) => {
  return (
    <div className="container mx-auto bg-white shadow-lg rounded-md p-4">
      <table className="table-auto w-full border-collapse">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">S.No</th>
            <th className="p-3 text-left">Facility Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <AccordionRow key={index} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AccordionRow = ({ row }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer bg-blue-50 hover:bg-blue-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td className="p-3 text-center">{isExpanded ? "-" : "+"}</td>
        <td className="p-3">{row.name}</td>
        <td className="p-3">{row.weight}</td>
        <td className="p-3">{row.dimensions}</td>
        <td className="p-3">{row.value}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="7" className="p-3 bg-gray-100">
            <table className="table-auto w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Part Number</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Order Number</th>
                  <th className="p-2 text-left">Qty Shipped</th>
                  <th className="p-2 text-left">Weight</th>
                  <th className="p-2 text-left">Total Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {row.subRows.map((subRow, subIndex) => (
                  <tr key={subIndex} className="hover:bg-gray-50">
                    <td className="p-2">{subRow.partNumber}</td>
                    <td className="p-2">{subRow.description}</td>
                    <td className="p-2">{subRow.orderNumber}</td>
                    <td className="p-2">{subRow.qtyShipped}</td>
                    <td className="p-2">{subRow.weight}</td>
                    <td className="p-2">{subRow.totalValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

export default NestedTable;
