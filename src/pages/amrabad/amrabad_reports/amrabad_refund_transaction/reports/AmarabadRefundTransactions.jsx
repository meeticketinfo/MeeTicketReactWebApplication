import React from "react";
import AmarabadRefundTransactionsForm from "./AmarabadRefundTransactionsForm";
import AmarabadRefundTransactionsChart from "../charts/AmarabadRefundTransactionsChart";
function AmarabadRefundTransactions() {
    // Dummy data replacing API/store integration
    const DUMMY_REFUND_TRANSACTIONS = [
        { status: "Payment Success, Ticket Not Generated", count: 120 },
        { status: "Refund Initiated", count: 45 },
        { status: "Refund Failed", count: 12 },
        { status: "Refund Success", count: 88 },
    ];

    const isLoading = false;

    const totalCount = DUMMY_REFUND_TRANSACTIONS.reduce(
        (sum, item) => sum + (Number(item.count) || 0),
        0
    );

    return (
        <>
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-full ">
                    <AmarabadRefundTransactionsForm />
                </div>

                {/* Transactions by reason chart */}
                <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 rounded-xl shadow-[0px_0px_27.8px_rgba(0,0,0,0.12)]">
                    <div className="flex">
                        <div className="flex-1 rounded-lg overflow-hidden shadow-md relative">
                            {/* <Loader/> */}

                            {isLoading && (
                                <div className="ag-table-body-loader backdrop-blur-sm bg-white/30 z-10 items-start pt-[150px]">
                                    <div className="loader"></div>
                                </div>
                            )}
                            <AmarabadRefundTransactionsChart
                                data={totalCount !== 0 ? DUMMY_REFUND_TRANSACTIONS : []}
                                title="Payment success & Ticket Not Generated"
                                angleKey="count"
                                calloutLabelKey="status"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AmarabadRefundTransactions;