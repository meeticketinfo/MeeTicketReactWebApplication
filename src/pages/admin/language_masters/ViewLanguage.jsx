import React, { useEffect, useState } from 'react'
import { LuClipboardEdit } from 'react-icons/lu';
import AgGridTable from '../../../components/tables/AgGridTable';


const ViewLanguage = ({ setIsCreate }) => {



    useEffect(() => {
        // fetchFacilityHolidays()
    }, [])

    const [columnDefs] = useState([
        {
            headerName: "S.No",
            valueGetter: "node.rowIndex + 1",
            minWidth: 80,
            maxWidth: 80,
            headerClass: "text-blue-v2",
        },


        {
            field: "facilityName",
            headerName: "Group Name",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "facilityName",
            headerName: "Facility Name",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "facilityName",
            headerName: "SubFacility Name",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "facilityName",
            headerName: "Maximum value",
            minWidth: 135,    
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "facilityName",
            headerName: "Minimum value",
            flex: 1,
            minWidth: 135,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
      
        {
            headerName: "Actions",
            field: "actions",
            minWidth: 135,
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
                ExportName="Group_Details"
                // rowData={allFacilityHolidays}
                columnDefs={columnDefs}
                isFetchLoading={false}
            />
        </>
    )
}

export default ViewLanguage
