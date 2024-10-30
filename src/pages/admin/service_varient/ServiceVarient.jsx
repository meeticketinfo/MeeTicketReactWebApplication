import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import ServiceVarientList from "../../../components/service_varient_management/serviceVarientList";

export default function ServiceVariant() {
    const [isServiceVarientCreateVisible, setIsServiceVarientCreateVisible] = useState(true);

    // Function to toggle the visibility of serviceVarientCreate
    const toggleServiceVarientCreate = () => {
        setIsServiceVarientCreateVisible((prev) => !prev);
    };
    return (
        <>
            <AdminLayout>
                <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                    {/* Dashboard actions */}
                    <div className="sm:flex sm:justify-between sm:items-center mb-8">
                        {/* Left: Title */}
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                                Service Varient
                            </h1>
                        </div>
                        {/* Right: Actions */}
                        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                            {/* Add view button */}
                            <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                                <span className="max-xs:sr-only" onClick={toggleServiceVarientCreate}>
                                    {isServiceVarientCreateVisible ? "Add Service Varient" : "Back"}
                                </span>
                            </button>
                        </div>
                    </div>
                    {/* Cards */}
                    {/* <div className="grid grid-cols-12 gap-6"> */}
                    {!isServiceVarientCreateVisible ? <ServiceVarientCreate /> : <ServiceVarientList />}
                    {/* </div> */}
                </div>
            </AdminLayout>
        </>
    )
};