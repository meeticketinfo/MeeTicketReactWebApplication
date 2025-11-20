import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuClipboardEdit, LuPause } from "react-icons/lu";
import { useFacilityStore } from "../../../store/masters/facilitiesStore";
import { useModalStore } from "../../../store/modalStore";
import { useServiceStore } from "../../../store/masters/servicesStore";
import { useServiceVariantStore } from "../../../store/masters/serviceVariantsStore";
import { formatToCurrency } from "../../../utils/TypographyHelper";
import { useUnifiedFacilityStore } from "../../../store/masters/unifiedFacilityStore";
import { WalkersPassStore } from "../../../store/masters/WalkersPassStore";
import { useSlotBookingStore } from "../../../store/masters/slotBookingStore";
import { MdAutoDelete } from "react-icons/md";
import SlotDelete from "../../service_variant_management/SlotDelete";
import SlotSuspend from "../../service_variant_management/SlotSuspend";

const NestedTable = ({ data }) => {
  const { fetchAllDropdownFacilities } = useFacilityStore();

  useEffect(() => {
    fetchAllDropdownFacilities();
  }, []);

  return (
    <div className="container mx-auto shadow-lg rounded-lg ">
      <table className="table-auto w-full border-collapse text-sm rounded-lg overflow-hidden">
        <thead className="bg-[#f8f8f8] text-blue-v1 text-sm">
          <tr>
            <th className="p-3 text-center">S.No</th>
            <th className="p-3 text-center">Facility Name</th>
            <th className="p-3 text-center">Description</th>
            <th className="p-3 text-center">Sequence</th>
            <th className="p-3 text-center">User Status</th>
            <th className="p-3 text-center">Counter Status</th>
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
  const { openModalId, setOpenModalId, closeModal } = useModalStore();
  const { allFacilities, fetchAllFacilities, setCurrentFacilityEditDetails } =
    useFacilityStore();
  return (
    <>
      <tr
        className={`cursor-pointer border-b-2 hover:bg-blue-100 text-sm bg-white `}
      >
        <td
          className="p-2 flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <IoIosArrowDown className={` ${isExpanded ? "rotate-180" : ""}`} />
          <div className="w-9/10 text-center">{serial + 1}</div>
        </td>
        <td className="p-2 text-center">{row.name || "N/A"}</td>
        <td className="p-2 text-center">
          {row.description ? row.description : "N/A"}
        </td>
        <td className="p-2 text-center">
          {row.sequenceNumber ? row.sequenceNumber : "N/A"}
        </td>
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
        <td className="p-2 text-center">
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <span
              className={`${
                row.isCounterEnable
                  ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
              } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
            >
              {" "}
              {row.isCounterEnable ? "Active" : "Inactive"}
            </span>
          </div>
        </td>
        <td className="p-2 text-center ">
          <div className="flex justify-center">
            <button
              onClick={() => {
                setCurrentFacilityEditDetails(row);
                setOpenModalId("facility-modal");
              }}
            >
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && row.services.length > 0 && (
        <tr>
          <td colSpan="7" className="p-2 bg-blue-50">
            <table className="table-auto w-full ">
              <thead className={`bg-[#f8f8f8] text-blue-v1`}>
                <tr>
                  <th className="p-2 text-center">S.No</th>
                  <th className="p-2 text-center">Sub Facility Name</th>
                  <th className="p-2 text-center">Description</th>
                  <th className="p-2 text-center">Limit</th>
                  <th className="p-3 text-center">Sequence</th>
                  <th className="p-2 text-center">Status</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {row.services.map((subRow, subIndex) => (
                  <AccordionSubRow
                    key={subIndex}
                    subRow={subRow}
                    facilityId={row.id}
                    hasMultipleSubFacilities={
                      row.services.length === 1 ? false : false
                    }
                    subRowSerial={serial}
                    subRowIndex={subIndex}
                  />
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

const AccordionSubRow = ({
  subRow,
  facilityId,
  hasMultipleSubFacilities,
  subRowSerial,
  subRowIndex,
}) => {
  const [isExpanded, setIsExpanded] = useState(
    hasMultipleSubFacilities ? true : false
  );
  const [isSlotExpanded, setIsSlotExpanded] = useState(false);
  const [deleteModal, setdeleteModal] = useState(false);
  const [deleteSlotId, setDeleteSlotId] = useState("");
  const [suspendModal, setSuspendModal] = useState(false);
  const [SuspendResumeAction, setSuspendResumeAction] = useState("");
  const {
    setCurrentWalkersPassEditDetails,
    setIsWalkersPassEdit,
    setIsWalkersPassAdd,
  } = WalkersPassStore();
  const { setOpenModalId } = useModalStore();
  const { setCurrentServiceEditDetails } = useServiceStore();
  const { setCurrentServiceVariantEditDetails } = useServiceVariantStore();
  const { setIsCreateServiceEnabled } = useUnifiedFacilityStore();
  const { setIsSlotEdit, setSlotEditDetails, setIsSlotAdd } =
    useSlotBookingStore();
  useEffect(() => {
    if (Array.isArray(subRow.slotDetails) && subRow.slotDetails.length > 0) {
      setIsSlotExpanded(true);
    }
    if (Array.isArray(subRow.slotDetails) && subRow.slotDetails.length <= 0) {
      setIsSlotExpanded(false);
    }
  }, [subRow.slotDetails]);

  const isShowSuspendedResume =
    Array.isArray(subRow.slotDetails) && subRow.slotDetails.length > 0;

  return (
    <>
      <tr className={`bg-white ${hasMultipleSubFacilities ? "hidden" : ""}`}>
        <td
          className="p-2 text-center cursor-pointer flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-center">
            <IoIosArrowDown className={`${isExpanded ? "rotate-180" : ""}`} />
          </div>
          <div className="w-9/10 text-center">{`${
            subRowSerial + 1
          }.${String.fromCharCode(97 + subRowIndex)}`}</div>
        </td>
        <td className="p-2 text-center">{subRow.name ?? "N/A"}</td>
        <td className="p-2 text-center">{subRow.description ?? "N/A"}</td>
        <td className="p-2 text-center">
          {subRow.limit < 0 && subRow.limit != null ? "No Limit" : subRow.limit}
        </td>
        <td className="p-2 text-center">
          {subRow.sequenceNumber ? subRow.sequenceNumber : "N/A"}
        </td>
        <td className="p-2 text-center">
          {" "}
          <div style={{ display: "flex align-center", gap: "0.5rem" }}>
            <span
              className={`${
                subRow.isActive
                  ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                  : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
              } text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
            >
              {" "}
              {subRow.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </td>
        <td className="p-2 text-center">
          <span
            className={`flex gap-4  ${
              isShowSuspendedResume
                ? "justify-center"
                : "justify-start  md:pl-8"
            }`}
          >
            {/* suspend and resume */}
            {isShowSuspendedResume && (
              <>
                <button
                  className={`
                 bg-green-700
                 text-white px-3 py-0.5 rounded-lg text-xs font-medium `}
                  onClick={() => {
                    setSuspendModal(true);
                    setSuspendResumeAction("resume");
                  }}
                >
                  Resume
                </button>
                <button
                  className={` bg-red-700
                   text-white px-3 py-0.5 rounded-lg text-xs font-medium `}
                  onClick={() => {
                    setSuspendModal(true);
                    setSuspendResumeAction("suspend");
                  }}
                >
                  Suspend
                </button>
              </>
            )}
            <button
              onClick={() => {
                setCurrentServiceEditDetails({
                  ...subRow,
                  facilityId: facilityId,
                });
                setOpenModalId("sub-facility-modal");
                setIsCreateServiceEnabled(false);
              }}
            >
              <LuClipboardEdit className="text-[24px] text-blue-600 " />
            </button>
          </span>
        </td>
      </tr>

      {isExpanded &&
        (subRow.serviceVariants.length > 0 ||
          subRow.walkerPassDetails.length > 0 ||
          subRow.slotDetails.length > 0) && (
          <>
            <tr>
              <td colSpan="7" className=" bg-blue-50">
                <div className="flex justify-start py-1.5">
                  {subRow.slotDetails.length > 0 && (subRow.serviceVariants.length > 0 || subRow.walkerPassDetails.length > 0) && (
                    <div className="relative inline-flex bg-gray-100 rounded-md shadow-md border border-gray-200 overflow-hidden">
                      {/* Sliding background indicator with smooth animation */}
                      <div
                        className="absolute top-1.5 bottom-1.5 rounded-md bg-gradient-to-r from-blue-v1 via-blue-900 to-blue-v2 shadow-md transition-all duration-500 ease-out"
                        style={{
                          width: "calc(50% - 6px)",
                          left: isSlotExpanded ? "6px" : "calc(50% + 0px)",
                        }}
                      />
                      <button
                        className={`relative z-10 px-8 py-2 text-sm text-nowrap  font-semibold transition-all duration-300 rounded-md  ${
                          isSlotExpanded
                            ? "text-white  drop-shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                        onClick={() => setIsSlotExpanded(true)}
                      >
                        SLOT BOOKING
                      </button>
                      <button
                        className={`relative z-10 px-8  py-2 text-sm text-nowrap font-semibold transition-all duration-300 rounded-md  ${
                          !isSlotExpanded
                            ? "text-white drop-shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                        onClick={() => setIsSlotExpanded(false)}
                      >
                        Ticket Types
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
            {!isSlotExpanded ? (
              <tr>
                <td colSpan="7" className="p-2 bg-gray-100">
                  <table className="table-auto w-full text-sm">
                    <thead className="bg-[#f8f8f8] text-blue-v1">
                      <tr>
                        <th className="p-1.5 text-center">Ticket Type</th>
                        <th className="p-1.5 text-center">Price</th>
                        <th className="p-1.5 text-center">Sequence</th>
                        <th className="p-1.5 text-center">Is Person Based</th>
                        <th className="p-1.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    {subRow.serviceVariants.length > 0 && (
                      <tbody>
                        {subRow.serviceVariants.map((detail, detailIndex) => (
                          <tr key={detailIndex} className="bg-white">
                            <td className="p-1.5 text-center">
                              {detail.name ?? "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {formatToCurrency(detail?.amount) || "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {detail.sequenceNumber
                                ? detail.sequenceNumber
                                : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              <div
                                style={{
                                  display: "flex align-center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  className={`${
                                    !detail.isPriceFixed
                                      ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                      : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                  } text-xs font-medium me-2 px-2.5 py-0.5 rounded `}
                                >
                                  {" "}
                                  {!detail.isPriceFixed ? "Yes" : "No"}
                                </span>
                              </div>
                            </td>
                            <td className="p-1.5 text-center">
                              <span className="flex justify-center">
                                {/*  */}
                                <button
                                  onClick={() => {
                                    setCurrentServiceVariantEditDetails({
                                      ...detail,
                                      serviceId: subRow.id,
                                    });
                                    setOpenModalId("type-of-ticket-modal");

                                    setCurrentWalkersPassEditDetails({
                                      ...detail,
                                      serviceId: subRow.id,
                                    });
                                  }}
                                >
                                  <LuClipboardEdit className="text-[24px] text-blue-600 " />
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}

                    {subRow.walkerPassDetails.length > 0 && (
                      <tbody>
                        {subRow.walkerPassDetails.map((detail, detailIndex) => (
                          <tr key={detailIndex} className="bg-white">
                            <td className="p-1.5 text-center">
                              {detail.passActualName ?? "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {formatToCurrency(detail?.passAmount) || "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {detail.passSequenceNumber
                                ? detail.passSequenceNumber
                                : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              <div
                                style={{
                                  display: "flex align-center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  className={`${
                                    !detail.isPersonbased
                                      ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                      : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                  } text-xs font-medium me-2 px-2.5 py-0.5 rounded  `}
                                >
                                  {detail.isPersonbased != null
                                    ? !detail.isPersonbased
                                      ? "Yes"
                                      : "No"
                                    : "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="p-1.5 text-center">
                              <span className="flex justify-center">
                                {/*  */}
                                <button
                                  onClick={() => {
                                    // setOpenModalId("type-of-ticket-modal");
                                    setIsWalkersPassEdit(true);
                                    setIsWalkersPassAdd(true);
                                    setCurrentWalkersPassEditDetails({
                                      ...detail,
                                      serviceId: subRow.id,
                                    });
                                  }}
                                >
                                  <LuClipboardEdit className="text-[24px] text-blue-600 " />
                                </button>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </td>
              </tr>
            ) : (
              <tr>
                {subRow.slotDetails.length > 0 && (
                  <td colSpan="7" className="p-2 bg-gray-100">
                    <table className="table-auto w-full ">
                      <thead className="bg-[#f8f8f8] text-blue-v1">
                        <tr>
                          <th className="py-1.5 text-center">Start time</th>
                          <th className="py-1.5 text-center">End time</th>
                          <th className="py-1.5 text-center">Total Capacity</th>
                          <th className="py-1.5 text-center">
                            Available Capacity
                          </th>

                          <th className="py-1.5 text-center">Status</th>
                          <th className="py-1.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subRow.slotDetails.map((detail, detailIndex) => (
                          <tr key={detailIndex} className="bg-white">
                            <td className="p-1.5 text-center">
                              {detail.startTime ? detail.startTime : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {detail.endTime ? detail.endTime : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {detail.totalCapacity
                                ? detail.totalCapacity
                                : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              {detail.availableCapacity
                                ? detail.availableCapacity
                                : "N/A"}
                            </td>
                            <td className="p-1.5 text-center">
                              <div
                                style={{
                                  display: "flex align-center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  className={`${
                                    detail.status
                                      ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                      : "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded "
                                  } text-xs font-medium me-2 px-2.5 py-0.5 rounded  `}
                                >
                                  {detail.status != null
                                    ? detail.status
                                      ? "Yes"
                                      : "No"
                                    : "N/A"}
                                </span>
                              </div>
                            </td>

                            <td className="p-1.5 text-center">
                              <span className="flex justify-center gap-4">
                                {/*  */}
                                <button
                                  onClick={() => {
                                    // setOpenModalId("type-of-ticket-modal");
                                    setIsSlotEdit(true);
                                    setIsSlotAdd(true);
                                    setSlotEditDetails({
                                      ...detail,
                                      serviceId: subRow.id,
                                    });
                                  }}
                                >
                                  <LuClipboardEdit className="text-[25px] text-blue-600 " />
                                </button>
                                {subRow.slotDetails.length > 0 && (
                                  <button
                                    onClick={() => {
                                      setdeleteModal(true);
                                      setDeleteSlotId(detail.slotId);
                                    }}
                                  >
                                    <MdAutoDelete className="text-[25px] text-red-600 " />
                                  </button>
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                )}
              </tr>
            )}
          </>
        )}

      <SlotDelete
        deleteModal={deleteModal}
        setdeleteModal={setdeleteModal}
        deleteSlotId={deleteSlotId}
      />
      <SlotSuspend
        suspendModal={suspendModal}
        setSuspendModal={setSuspendModal}
        subRow={subRow}
        SuspendResumeAction={SuspendResumeAction}
        setSuspendResumeAction={setSuspendResumeAction}
      />
    </>
  );
};

export default NestedTable;
