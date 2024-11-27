import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

const ServiceUnifiedCreator = () => {
  const [facilities, setFacilities] = useState([
    { id: Date.now(), name: "", services: [], isSubFacility: false },
  ]);

  const addFacility = () => {
    setFacilities([...facilities, { id: Date.now(), name: "", services: [] }]);
  };

  const deleteFacility = (facilityId) => {
    setFacilities(facilities.filter((f) => f.id !== facilityId));
  };

  const updateFacilityName = (facilityId, name) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId ? { ...facility, name } : facility
      )
    );
  };

  const addService = (facilityId) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: [
                ...facility.services,
                { id: Date.now(), name: "", ticketTypes: [] },
              ],
            }
          : facility
      )
    );
  };

  const deleteService = (facilityId, serviceId) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: facility.services.filter(
                (service) => service.id !== serviceId
              ),
            }
          : facility
      )
    );
  };

  const updateServiceName = (facilityId, serviceId, name) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: facility.services.map((service) =>
                service.id === serviceId ? { ...service, name } : service
              ),
            }
          : facility
      )
    );
  };

  const addTicketType = (facilityId, serviceId) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: facility.services.map((service) =>
                service.id === serviceId
                  ? {
                      ...service,
                      ticketTypes: [
                        ...service.ticketTypes,
                        { id: Date.now(), name: "", description: "" },
                      ],
                    }
                  : service
              ),
            }
          : facility
      )
    );
  };

  const deleteTicketType = (facilityId, serviceId, ticketId) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: facility.services.map((service) =>
                service.id === serviceId
                  ? {
                      ...service,
                      ticketTypes: service.ticketTypes.filter(
                        (ticket) => ticket.id !== ticketId
                      ),
                    }
                  : service
              ),
            }
          : facility
      )
    );
  };

  const updateTicketType = (facilityId, serviceId, ticketId, field, value) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              services: facility.services.map((service) =>
                service.id === serviceId
                  ? {
                      ...service,
                      ticketTypes: service.ticketTypes.map((ticket) =>
                        ticket.id === ticketId
                          ? { ...ticket, [field]: value }
                          : ticket
                      ),
                    }
                  : service
              ),
            }
          : facility
      )
    );
  };

  const initialValues = {
    Id: "",
    facilityMasterId: "",
    name: "",
    openTime: "00:00:00",
    closeTime: "00:00:00",
    description: "",
    isActive: true,
    parkId: "parkId",
    serviceVarientReqDTOs: [
      { name: "", amount: "", isPriceFixed: false, isActive: true },
    ],
  };

  return (
    <div className="container mt-5">
      <Formik
        initialValues={initialValues}
        // validationSchema={}
        onSubmit={(values, actions) => console.log(values, "values")}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form>
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="card mb-6 border rounded-lg shadow-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <strong className="text-xl text-gray-700">Facility</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                  {/* Facility Name */}
                  <div className="">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Select Facility <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="facilityMasterId"
                      className={`mt-1 block w-full px-2 py-1 border ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                      onChange={(e) => {}}
                    >
                      <option value="">Select Facility</option>
                    </Field>

                    <ErrorMessage
                      name="facilityMasterId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <strong className="text-lg text-gray-700">
                    Sub Facility
                  </strong>
                  <button
                    onClick={() => addService(facility.id)}
                    className="px-2 py-1 mt-2 text-blue-v1 bg-gray-100 border border-blue-v1 hover:bg-blue-v1 rounded-md"
                  >
                    Add
                  </button>
                </div>
                {facility.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-50 p-4 rounded-md shadow-md mb-4 relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                      <button
                        type="button"
                        onClick={() => deleteService(facility.id, service.id)}
                        className="px-2 py-2 bg-gray-100 border border-red-600 text-red-600 hover:bg-red-600 absolute right-0 top-0  rounded-bl-lg"
                      >
                        <MdDeleteForever className="text-lg" />
                      </button>
                      {/* Service Name */}
                      <div>
                        <label className="block text-sm font-medium">
                          Display Name <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="name"
                          type="text"
                          maxLength={50}
                          className={`mt-1 block w-full px-2 py-1 border ${
                            errors.name && touched.name
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          placeholder="Enter Display Name"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                      {/* Display Name */}

                  
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-md">
                      <div className="flex justify-between items-end mb-2">
                        <h6 className="font-semibold mb-3">Ticket Type</h6>
                        <button
                          onClick={() => addTicketType(facility.id, service.id)}
                          className="px-2 py-1 mt-2 text-blue-v1 bg-gray-100 border border-blue-v1 hover:bg-blue-v1 rounded-md"
                        >
                          Add
                        </button>
                      </div>
                      {service.ticketTypes.map((ticket) => (
                        <>
                          <div className="flex justify-between border relative">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3">
                              {/* Service */}

                              {/* Varient Name */}
                              <div className="">
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-semibold text-gray-700"
                                >
                                  Display Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Field
                                  as="select"
                                  name="isActive"
                                  className={`mt-1 block w-full px-2 py-1 border ${
                                    errors.isActive && touched.isActive
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                >
                                  <option value="">Select Ticket Type</option>
                                  <option value={true}>Adult</option>
                                  <option value={false}>Children</option>
                                  <option value={false}>others</option>
                                </Field>
                              </div>

                              {/* Amount */}
                              <div className="">
                                <label
                                  htmlFor="amount"
                                  className="block text-sm font-semibold text-gray-700"
                                >
                                  Amount <span className="text-red-500">*</span>
                                </label>
                                <Field
                                  type="number"
                                  name="amount"
                                  className={`mt-1 block w-full px-2 py-1 border ${
                                    errors.amount && touched.amount
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                  placeholder=" Enter Display Name"
                                />
                                <ErrorMessage
                                  name="amount"
                                  component="div"
                                  className="text-red-500 text-xs mt-1"
                                />
                              </div>

                              <div className="flex items-end mb-3">
                                <label className="text-sm flex space-x-2">
                                  <Field
                                    type="checkbox"
                                    name="isPriceFixed"
                                    className="sr-only peer "
                                  />
                                  <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                                  <span className="ms-3 text-md font-semibold text-gray-900 ">
                                    Price Fixed
                                  </span>
                                </label>
                                <ErrorMessage
                                  name="isPriceFixed"
                                  component="span"
                                  className="text-red-500 text-xs"
                                />
                              </div>
                            
                            </div>
                            <button
                              onClick={() =>
                                deleteTicketType(
                                  facility.id,
                                  service.id,
                                  ticket.id
                                )
                              }
                              className="px-2 py-2 bg-gray-100 border border-red-600 text-red-600 hover:bg-red-600 absolute right-0 top-0  rounded-bl-lg "
                            >
                              <MdDeleteForever className="text-lg" />
                            </button>
                          </div>
                          <hr></hr>
                        </>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button
              onClick={addFacility}
              className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md mt-4"
            >
              Add Facility
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ServiceUnifiedCreator;
