import React, { useEffect, useState } from 'react'
import AgGridTable from '../../../../components/tables/AgGridTable';
import { FacilityHolidayStore } from './FacilityHolidayStore';
import { LuClipboardEdit } from 'react-icons/lu';

const FacilityHolidayList = ({ setIsCreate }) => {

  const { allFacilityHolidays, FacilityHolidayEditDetails, fetchFacilityHolidays, setCurrentFacilityHolidayEditDetails, isFetchFacilityHolidaysLoading } = FacilityHolidayStore();

  useEffect(() => {
    fetchFacilityHolidays()
  }, [])

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },


    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "listofBlockedDays",
      headerName: "List of Blocked Days",
      flex: 1,
      headerClass: "text-blue-v2",
      cellRenderer: (params) => {
        return (
          <div className="flex f gap-2">
            {params.data.listofBlockedDays?.map((day, index) => (
              <span
                key={index}
                className="px-2 mt-3 text-xs font-semibold text-black bg-gray-200  rounded-full shadow-md border border-gray-200  whitespace-nowrap "
              >
                {day}
              </span>
            ))}
          </div>
        );
      },
    },

    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        return (
          <div className={` flex items-center justify-around py-2`}>
            {/* edit */}
            <button
              className=""
              onClick={() => {
                setIsCreate(true);
                setCurrentFacilityHolidayEditDetails(params.data);
              }}
            >
              <span className="">
                <LuClipboardEdit className="text-[24px] text-blue-600" />
              </span>
            </button>
          </div>
        );
      },

      width: 50,
      headerClass: "text-blue-v2",
    },
  ]);
  return (
    <>
      <AgGridTable
        ExportName="Holidays"
        rowData={allFacilityHolidays}
        columnDefs={columnDefs}
        isFetchLoading={isFetchFacilityHolidaysLoading}
      />
    </>
  )
}

export default FacilityHolidayList
