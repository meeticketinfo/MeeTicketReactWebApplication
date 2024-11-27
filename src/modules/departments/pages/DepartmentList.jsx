import React, { useEffect, useState } from 'react'
import DepartmentCreate from './DepartmentCreate'
import MuiTable from '../../../components/tables/MuiCSTable';
import { AdvancedFilterModule } from 'ag-grid-enterprise';
import AdminLayout from '../../../layouts/AdminLayout';
import { departmentService } from '../services/departmentService';
import { useDepartmentStore } from '../store/useDepartmentStore';

const DepartmentList = () => {
    const [openModelId, setOpenModalId] = useState(false);
    const { fetchAllDepartmentTypes } = departmentService()
    const { allDepartmentTypes, isFetchAllDepartmentTypesLoading } = useDepartmentStore();


    const toggleDepartmentCreate = () => {
        setOpenModalId("/departments/edit")
    }
    useEffect(() => {
        fetchAllDepartmentTypes()
    }, [])
    console.log(allDepartmentTypes, 'departments')
    const columns = [
        {
            field: "departmentName",
            headerName: "Department Name",
            flex: 1,
            headerClass: "text-blue-v2",
            valueFormatter: (params) => params.value || "N/A",
        },
        {
            field: "isActive",
            headerName: "Status",
            cellRenderer: (params) => (
                <div style={{ display: "flex align-center", gap: "0.5rem" }}>
                    <span
                        className={`${params.value
                            ? "bg-green-400 text-white shadow-md"
                            : "bg-red-400 text-white shadow-md"
                            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
                    >
                        {" "}
                        {params.value ? "Active" : "Inactive"}
                    </span>
                </div>
            ),
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params) => (
                <div style={{ display: "flex align-center", gap: "0.5rem" }}>
                    <button
                        className="btn-edit"
                        onClick={() => {
                            toggleDepartmentCreate()
                            setDepartmentTypeEditDetails(params.data);
                            setIsDepartmentTypeEditVisible(true);
                        }}
                    >
                        <span className="">
                            <LuClipboardEdit className="text-[24px] text-blue-600 " />
                        </span>
                    </button>
                </div>
            ),
            flex: 1,
            headerClass: "text-blue-v2",
        },
    ];

    return (
        <>
            <div>

                <AdminLayout>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto"
                    >

                    </div>
                    <div className="sm:flex sm:justify-between sm:items-center mb-8">
                        {/* Left: Title */}
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                                Departments
                            </h1>
                        </div>
                        {/* Right: Actions */}
                        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                            {/* Add view button */}
                            <button
                                onClick={() =>
                                    setOpenModalId("/departments/create")
                                }
                                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                            >
                                <span className="max-xs:sr-only">Add Department</span>
                            </button>
                        </div>
                    </div>
                    <MuiTable
                        columns={columns}
                        data={allDepartmentTypes}
                        isLoading={isFetchAllDepartmentTypesLoading}
                        error={null}
                    />
                    {openModelId && (
                        <DepartmentCreate
                            isOpen={true}
                            onClose={() => setOpenModalId(null)}
                            departmentData={openModelId === "/departments/edit" ? useDepartmentStore.getState().departmentTypeEditDetails : null}
                        />
                    )}
                </AdminLayout>
            </div>

        </>

    )
}

export default DepartmentList



