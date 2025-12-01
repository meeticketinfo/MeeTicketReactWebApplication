import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../../../../../layouts/AdminLayout";
import IntercitySettlementTransaction from "./intercitySettlementTransaction";


const MainIntercitySettlementReport = () => {
    return (
        <AdminLayout>
            <ToastContainer />
            <div className="px-4  py-8 w-full max-w-9xl mx-auto">
                <div className="flex justify-between mb-4 sm:mb-0">
                    <div>
                        <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                        Settlement Summary
                        </h1>
                    </div>
                </div>
                <IntercitySettlementTransaction />
            </div>
        </AdminLayout>
    );
};

export default MainIntercitySettlementReport;
