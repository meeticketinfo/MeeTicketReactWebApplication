import { useNavigate } from "react-router-dom";
// import AgGridTable from "../../../components/tables/AgGridTable";

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
import AdminLayout from "../../../layouts/AdminLayout";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is imported

// Validation schema using Yup
// const validationSchema = Yup.object({
//   park: Yup.string().required("Please enter facility name."),
//   name: Yup.string().required("Please enter facility name."),
//   mobileNumber: Yup.string()
//     .required("Mobile number is required")
//     .matches(/^\d+$/, "Mobile number must be numeric"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Please enter Confirm password."),
// });

export default function AdminUsersTable() {
    const navigate = useNavigate()
  const addNewUser = ()=>{
    navigate("/user-management/add")
  }
  return (
    <AdminLayout>
      <div className="container mx-auto mt-10 px-4">
        <h2 className="text-black text-2xl font-bold mb-6">Admin User</h2>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h6 className="text-lg font-semibold">Admin User</h6>
            <button className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700" onClick={addNewUser}>Add New</button>
          </div>

         {/* <AgGridTable/> */}
        </div>
      </div>
    </AdminLayout>
  );
}


// import { useState } from 'react';

// const AdminUserTable = () => {
//   const dummyData = [
//     { id: 1, mobileNumber: '7671909319', name: 'Park Admin', parkName: 'Nehru Zoological Park', status: 'Active' },
//     { id: 2, mobileNumber: '7671909312', name: 'Scan User', parkName: 'Nehru Zoological Park', status: 'Inactive' },
//     { id: 3, mobileNumber: '1234567891', name: 'Admin 1', parkName: 'Nehru Zoological Park', status: 'Active' },
//     { id: 4, mobileNumber: '9999999999', name: 'subbuadmin', parkName: 'subb test', status: 'Inactive' },
//   ];

//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState('');
//   const itemsPerPage = 4;

//   // Filter data based on the search term
//   const filteredData = dummyData.filter(item => 
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Admin User</h1>
//       <div className="bg-white p-4 shadow rounded-lg">
        
//         {/* Search and Add New Button */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Admin User</h2>
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Export Buttons and Add New Button */}
//         <div className="flex justify-between mb-4">
//           <div className="flex gap-2">
//             <button className="px-4 py-2 bg-gray-200 rounded">Copy</button>
//             <button className="px-4 py-2 bg-gray-200 rounded">CSV</button>
//             <button className="px-4 py-2 bg-gray-200 rounded">Excel</button>
//             <button className="px-4 py-2 bg-gray-200 rounded">PDF</button>
//             <button className="px-4 py-2 bg-gray-200 rounded">Print</button>
//           </div>
//           <button className="px-4 py-2 bg-blue-500 text-white rounded">Add New</button>
//         </div>

//         {/* Table */}
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Mobile Number</th>
//               <th className="py-2 px-4 border-b">Name</th>
//               <th className="py-2 px-4 border-b">Park Name</th>
//               <th className="py-2 px-4 border-b">Status</th>
//               <th className="py-2 px-4 border-b">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
//               <tr key={item.id}>
//                 <td className="py-2 px-4 border-b">{item.mobileNumber}</td>
//                 <td className="py-2 px-4 border-b">{item.name}</td>
//                 <td className="py-2 px-4 border-b">{item.parkName}</td>
//                 <td className="py-2 px-4 border-b">
//                   <span className={`px-2 py-1 rounded-full text-white ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
//                     {item.status}
//                   </span>
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Update</button>
//                   <button className="bg-yellow-500 text-white px-2 py-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-4">
//           <p className="text-sm">
//             Showing {itemsPerPage * (currentPage - 1) + 1} to {Math.min(itemsPerPage * currentPage, filteredData.length)} of {filteredData.length} entries
//           </p>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               &laquo;
//             </button>
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
//             >
//               &raquo;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUserTable;
