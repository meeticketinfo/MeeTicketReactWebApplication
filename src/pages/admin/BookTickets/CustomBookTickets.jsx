import React from 'react'
import FacilityServices from '../../../components/bookings_management/FacilityServices'
import AdminLayout from '../../../layouts/AdminLayout'

function CustomBookTickets() {
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
         <FacilityServices />
      </div>
      </AdminLayout>
  )
}

export default CustomBookTickets
