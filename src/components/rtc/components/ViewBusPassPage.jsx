import React, { useState } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import ViewBusPass from './ViewBusPass'
import { FaEye } from 'react-icons/fa'

const ViewBusPassPage = () => {
  const [isViewBusPassOpen, setIsViewBusPassOpen] = useState(false)

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Bus Pass Viewer</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Click the button below to view bus pass details in a popup modal.
            </p>
            
            <button
              onClick={() => setIsViewBusPassOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaEye />
              View Bus Pass Details
            </button>
          </div>
        </div>
      </div>

      {/* ViewBusPass Modal */}
      <ViewBusPass
        isOpen={isViewBusPassOpen}
        onClose={() => setIsViewBusPassOpen(false)}
      />
    </AdminLayout>
  )
}

export default ViewBusPassPage
