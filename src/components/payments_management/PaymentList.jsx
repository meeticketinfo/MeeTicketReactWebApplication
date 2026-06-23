import React, { useState , useEffect } from "react"
import AgGridTable from "../tables/AgGridTable"
import { usePaymentStore } from "../../store/masters/paymentsStore";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";

const PaymentList = () => {
    const { allPayments, fetchAllPayments } = usePaymentStore();
  useEffect(() => {
    fetchAllPayments();
  }, []);
    
    const [columnDefs] = useState([
        {
            headerName: "S.No",
            valueGetter: "node.rowIndex + 1",
            width: 100,
            headerClass: "text-blue-v2",
        },
        {
            field: "paymentDate",
            headerName: "Date",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "bookingId",
            headerName: "Payment Id",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        {
            field: "paymentStatus",
            headerName: "Status",
            flex: 1,
            headerClass: "text-blue-v2",
        },
        // {
        //     field: "method",
        //     headerName: "Method",
        //     flex: 1,
        //     headerClass: "text-blue-v2",
        // },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: (params) => (
                <div style={{ display: "flex align-center", gap: "0.5rem" }}>
                  <button className="btn-edit" onClick={() => handleEdit(params.data)}>
                    <span className="">
                      <FiEdit className="text-[24px] " />
                    </span>
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(params.data)}
                  >
                    <span>
                      <BsTrash className="text-[24px]" />
                    </span>
                  </button>
                </div>
              ),
            flex: 1,
            headerClass: "text-blue-v2",
        },
    ]);
    return (
        <>
            {/* <DashboardCard07> */}
            <AgGridTable rowData={allPayments} columnDefs={columnDefs} />
            {/* </DashboardCard07> */}
        </>
    );
};
export default PaymentList;
