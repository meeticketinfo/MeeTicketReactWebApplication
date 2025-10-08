import React from 'react'
import AdminLayout from '../../../../../layouts/AdminLayout'
import BusPassOuterTotalTransactionReport from './outer_report/BusPassOuterTotalTransactionReport'
// import OuterTotalTransactionReport from './outer_report/OuterTotalTransactionReport'



const BusPassMainTotalTransactionReport = () => {
  return (
     <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
             RTC Total Transactions
            </h1>
          </div>
        </div>
        <BusPassOuterTotalTransactionReport/>
      </div>
    </AdminLayout>
  )
}

export default BusPassMainTotalTransactionReport
