import React from 'react'

import AdminLayout from '../../../../layouts/AdminLayout'
import OuterAmarabadTotalTransactionReport from './outer_report/OuterAmarabadTotalTransactionReport'


const MainAmarabadTotalTransaction = () => {
  return (
     <AdminLayout>
       <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Total Transactions Report
            </h1>
          </div>
        </div>
        <OuterAmarabadTotalTransactionReport/>
      </div>
    </AdminLayout>
  )
}

export default MainAmarabadTotalTransaction
