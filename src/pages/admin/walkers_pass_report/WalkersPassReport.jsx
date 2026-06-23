import React from 'react'
import WalkersPassReportList from './WalkersPassReportList';
import AdminLayout from '../../../layouts/AdminLayout';
import { useNavigate } from "react-router-dom";


const WalkersPassReport = () => {
    const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-gray-800">
            Walker’s Pass Report
          </h1>

          <button
            type="button"
            class="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            onClick={() => navigate("/book-walker-pass")}>

            Book Walker Pass
          </button>
        </div>

        <WalkersPassReportList />

      </div>
    </AdminLayout>
  )
}

export default WalkersPassReport
