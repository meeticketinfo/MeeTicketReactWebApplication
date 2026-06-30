import React, { useEffect, useState } from 'react'
import { FiEdit } from "react-icons/fi";
import AgGridTable from '../../../components/tables/AgGridTable';
import { LanguageMasterStore } from './LanguageMasterStore';
import useAuthStore from '../../../store/authStore';


const ViewLanguage = ({ setIsCreate }) => {

    const { decodedTokenData } = useAuthStore();
        const parkId = decodedTokenData?.data?.ParkId;

    const { fetchLanguages, allLanguages, isFetchLanguagesLoading,setLanguageEditDetails } = LanguageMasterStore();


    useEffect(() => {
        fetchLanguages(parkId)
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
            headerName: "Facility Name",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
          },

        {
            field: "languageName",
            headerName: "language Name",
            flex: 1,
            headerClass: "text-blue-v2",
            
            valueFormatter: (params) => params.value || "N/A",
        },
        
        {
            headerName: "Actions",
            field: "actions",
            flex: 1,
            cellRenderer: (params) => {
                return (
                    <div className={` flex items-center justify-around py-2`}>
                        {/* edit */}
                        <button
                            className=""
                            onClick={() => {
                                setIsCreate(true);
                                setLanguageEditDetails(params.data);
                            }}
                        >
                            <span className="">
                                <FiEdit className="text-[24px] text-blue-600" />
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
                ExportName="Language Details"
                rowData={allLanguages}
                columnDefs={columnDefs}
                isFetchLoading={isFetchLanguagesLoading}
            />
        </>
    )
}

export default ViewLanguage
