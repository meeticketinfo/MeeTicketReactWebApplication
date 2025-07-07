import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuClipboardEdit } from "react-icons/lu";
import { usePackagesCommonStore } from "../../../../store/amrabad/masters/packagesCommonStore";
import PopupModal from "../../../../components/utils/popup_modal/PopupModal";
import UpdatePackage from "../packages/UpdatePackage";

const PackageNestedTable = ({ data }) => {
  return (
    <div className="container mx-auto shadow-lg rounded-lg ">
      <table className="table-auto w-full border-collapse text-sm rounded-lg overflow-hidden">
        <thead className="bg-[#f8f8f8] text-blue-v1 text-sm">
          <tr>
            <th className="p-3 text-center">S.No</th>
            <th className="p-3 text-center">Package Name</th>
            <th className="p-3 text-center">Description</th>
            {/* <th className="p-3 text-center">Sequence</th> */}
            <th className="p-3 text-center">Package Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((row, index) => (
              <AccordionRow key={index} serial={index} row={row} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

const AccordionRow = ({ serial, row }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [OpenModal, setOpenModal] = useState(false);
  return (
    <>
      <tr
        className={`cursor-pointer border-b-2 hover:bg-blue-100 text-sm bg-white `}
      >
        {/* S.NO */}
        <td
          className="p-2 flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <IoIosArrowDown className={` ${isExpanded ? "rotate-180" : ""}`} />
          <div className="w-9/10 text-center">{serial + 1}</div>
        </td>
        {/* PACKAGE NAME */}
        <td className="p-2 text-center">{row.packageName || "N/A"}</td>
        {/* DESCRIPTION */}
        <td className="p-2 text-center">
          {row.description ? row.description : "N/A"}
        </td>
        {/* SEQUENCE */}
        {/* <td className="p-2 text-center">
          {row.sequenceNumber ? row.sequenceNumber : "N/A"}
        </td> */}
        {/* USER STATUS */}
        <td className="p-2 text-center">
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <span
              className={`${
                row.isActive
                  ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
              } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
            >
              {" "}
              {row.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </td>
        {/* ACTIONS */}
        <td className="p-2 text-center ">
          <div className="flex justify-center">
            <button
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && row.rooms.length > 0 && (
        <tr>
          <td colSpan="5" className="p-4 bg-blue-50">
            <table className="table-auto w-full ">
              <thead className={`bg-[#f8f8f8] text-blue-v1`}>
                <tr>
                  <th className="p-2 text-center">S.No</th>
                  <th className="p-2 text-center">Room Name</th>
                  <th className="p-2 text-center">Tarrif Per Day</th>
                  <th className="p-2 text-center">No of Rooms Available</th>
                  {/* <th className="p-3 text-center">Sequence</th> */}
                  <th className="p-2 text-center">House Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {row.rooms.map((subRow, subIndex) => (
                  <AccordionSubRow
                    key={subIndex}
                    subRow={subRow}
                    facilityId={row.id}
                    subRowSerial={serial}
                    subRowIndex={subIndex}
                  />
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}

      <PopupModal
       
        isOpen={OpenModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title={"Update Package"}
        size="Extralarge"
        overlayClassName="bg-gray-800 bg-opacity-60"
        contentClassName="bg-white"
        
        
      >
        <div>
          <UpdatePackage data={row} />
        </div>
      </PopupModal>
    </>
  );
};

const AccordionSubRow = ({ subRow, subRowSerial, subRowIndex }) => {
  const {
    currentTab,
    setCurrentTab,
    setIsHouseEditVisible,
    setSelectedSubRow,
  } = usePackagesCommonStore();

  return (
    <>
      <tr className={`bg-white `}>
        {/* S.NO */}
        <td
          className="p-2 text-center cursor-pointer flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-9/10 text-center">{`${
            subRowSerial + 1
          }.${String.fromCharCode(97 + subRowIndex)}`}</div>
        </td>
        {/* ROOM NAME */}
        <td className="p-2 text-center">{subRow.roomName ?? "N/A"}</td>
        {/* TARRIF PER DAY */}
        <td className="p-2 text-center">{subRow.tariffPerDay ?? "N/A"}</td>
        {/* NO OF ROOMS AVAILABLE */}
        <td className="p-2 text-center">
          {subRow.roomLimit ? subRow.roomLimit : "N/A"}
        </td>
        {/* SEQUENCE */}
        {/* <td className="p-2 text-center">
                {subRow.sequenceNumber ? subRow.sequenceNumber : "N/A"}
              </td> */}
        {/* HOUSE STATUS */}
        <td className="p-2 text-center">
          {" "}
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <span
              className={`${
                subRow.isActive
                  ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
              } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
            >
              {" "}
              {subRow.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </td>
        {/* ACTIONS */}
        <td className="p-2 text-center">
          <span className="flex justify-center">
            <button
              onClick={() => {
                setCurrentTab(2);
                setIsHouseEditVisible(true);
                setSelectedSubRow(subRow);
              }}
            >
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </button>
          </span>
        </td>
      </tr>
    </>
  );
};
export default PackageNestedTable;
