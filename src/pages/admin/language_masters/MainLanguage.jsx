import React, { useState } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import { ToastContainer } from 'react-toastify'
import BackButton from '../../../components/BackButton'
import CreateLanguage from './CreateLanguage'
import ViewLanguage from './ViewLanguage'

const MainLanguage = () => {
  const [isCreate, setIsCreate] = useState(false)
  return (
    <AdminLayout>
    <ToastContainer />
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                    Add Language 
                </h1>
            </div>
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Add view button */}
                {isCreate ? (
                    <BackButton
                        label="Back"
                        onClick={() => {
                            // setIsCreate(false)
                            // setCurrentFacilityHolidayEditDetails(null)
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    />

                ) : (

                    <>
                        <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                            onClick={() => { setIsCreate(true) }}
                        >
                            <span className="max-xs:sr-only">Add Block Facility</span>
                        </button>
                    </>
                )}
            </div>
        </div>
        <div>
            {isCreate ? <CreateLanguage setIsCreate={setIsCreate} /> : <ViewLanguage setIsCreate={setIsCreate} />}
        </div>

        <div className="grid grid-cols-12 gap-6"></div>
    </div>
</AdminLayout>
  )
}

export default MainLanguage
