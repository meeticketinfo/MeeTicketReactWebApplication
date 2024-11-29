import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { MdDeleteForever } from "react-icons/md";

const ServiceUnifiedCreator = () => {
  const [facilities, setFacilities] = useState([
    { id: Date.now(), name: "", services: [], isSubFacility: false },
  ]);

  const addFacility = () => {
    setFacilities([...facilities, { id: Date.now(), name: "", services: [], hasSubFacility: false }]);
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
        initialValues={{}}
        onSubmit={(values) => console.log(values)}
      >
        {({ setFieldValue, errors, actions, values }) => (
          <Form>
            {facilities.map((facility) => (
              <div
                key={facility.id}
                className="card border rounded-lg shadow-lg p-4 mb-4 bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
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
                      className={`mt-1 block w-full px-2 py-1 border ${errors.name && touched.name
                        ? "border-red-500"
                        : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none bg-white text-sm`}
                      onChange={(e) => { }}
                    >
                      <option value="">Select Facility</option>
                    </Field>

                    <ErrorMessage
                      name="facilityMasterId"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center mt-6">
                      <Field
                        type="checkbox"
                        name={`facility-${facility.id}-hasSubFacility`}
                        checked={facility.hasSubFacility}
                        onChange={(e) =>
                          setFacilities(
                            facilities.map((f) =>
                              f.id === facility.id
                                ? { ...f, hasSubFacility: e.target.checked }
                                : f
                            )
                          )
                        }
                        className="form-checkbox"
                      />
                      <span className="ml-2">Has Sub-Facility</span>
                    </label>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (facility.hasSubFacility) {
                        addTicketType(facility.id); // Add Ticket Type
                      } else {
                        addService(facility.id); // Add Sub-Facility
                      }
                    }}
                    className="btn text-white bg-blue-900"
                  >
                    {facility.hasSubFacility ? "Add Ticket Type" : "Add Sub-Facility"}
                  </button>
                  {facility.services.map((service) => (
                    <div key={service.id} className="mt-4 border p-4 rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium">
                          Sub-Facility Name
                        </label>
                        <button
                          type="button"
                          onClick={() => deleteService(facility.id, service.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDeleteForever />
                        </button>

                      </div>
                      <div className="block text-sm font-medium">
                        <label className="block text-sm font-medium">
                          Facility Name
                        </label>
                        <Field
                          type="text"
                          name={`facility-${facility.id}-name`}
                          className="block px-2 py-1 border rounded-md"
                          onChange={(e) =>
                            setFacilities(
                              facilities.map((f) =>
                                f.id === facility.id
                                  ? { ...f, name: e.target.value }
                                  : f
                              )
                            )
                          }
                        />
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium">
                            Ticket Type
                          </label>
                          <button
                            type="button"
                            onClick={() => addTicketType(facility.id, service.id)}
                            className="btn text-white hover:text-blue-800 bg-blue-900"
                          >
                            Add Ticket Type
                          </button>

                        </div>

                        {service.ticketTypes.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="mt-2 border p-2 rounded-md flex justify-between"
                          >
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className=" text-sm font-medium">Ticket Type Name</label>
                                <Field
                                  as="select"
                                  name={`ticket-${ticket.id}-name`}
                                  value={ticket.name || ""}
                                  className="block w-full px-2 py-1 border rounded-md"
                                  onChange={(e) =>
                                    setFacilities(
                                      facilities.map((f) =>
                                        f.id === facility.id
                                          ? {
                                            ...f,
                                            services: f.services.map((s) =>
                                              s.id === service.id
                                                ? {
                                                  ...s,
                                                  ticketTypes: s.ticketTypes.map((t) =>
                                                    t.id === ticket.id
                                                      ? { ...t, name: e.target.value }
                                                      : t
                                                  ),
                                                }
                                                : s
                                            ),
                                          }
                                          : f
                                      )
                                    )
                                  }
                                >

                                  <option value="Adult">Adult</option>
                                  <option value="Child">Child</option>
                                  <option value="Others">Others</option>

                                </Field>
                              </div>
                              {ticket.name === "Others" && (
                                <div className="">
                                  <label className=" text-sm font-medium">
                                    Enter Ticket Type
                                  </label>
                                  <Field
                                    type="text"
                                    name={`facility-${facility.id}-name`}
                                    className={` block w-full px-2 py-1 border 
                                        border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                                    onChange={{}}
                                  />
                                </div>
                              )}
                              <div>
                                <label className=" text-sm font-medium">
                                  Is Ticket Charged Per Person ?
                                </label>
                                <Field
                                  as="select"
                                  name={`ticket-${ticket.id}-amount`}
                                  className="block w-full px-2 py-1 border rounded-md"
                                  onChange={(e) =>
                                    setFacilities(
                                      facilities.map((f) =>
                                        f.id === facility.id
                                          ? {
                                            ...f,
                                            services: f.services.map((s) =>
                                              s.id === service.id
                                                ? {
                                                  ...s,
                                                  ticketTypes: s.ticketTypes.map((t) =>
                                                    t.id === ticket.id
                                                      ? { ...t, name: e.target.value }
                                                      : t
                                                  ),
                                                }
                                                : s
                                            ),
                                          }
                                          : f
                                      )
                                    )
                                  }
                                >
                                  <option value="true">Yes</option>
                                  <option value="false">No</option>
                                </Field>
                              </div>

                            </div>
                            <div className="flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  deleteTicketType(
                                    facility.id,
                                    service.id,
                                    ticket.id
                                  )
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <MdDeleteForever className="text-2xl" />
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <div className="">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                //  disabled={isSaveParkDetailsLoading}
                >
                  {/* {isSaveParkDetailsLoading
                      ? "Saving..."
                      : isParkEditVisible
                      ? "Update Location"
                      : "Create Location"} */}
                  save
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ServiceUnifiedCreator;
