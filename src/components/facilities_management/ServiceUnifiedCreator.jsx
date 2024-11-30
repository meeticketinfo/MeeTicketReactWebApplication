import React, { useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
import { MdDeleteForever } from "react-icons/md";

const ticketTypeOptions = [
  { value: "child", label: "Child" },
  { value: "adult", label: "Adult" },
  { value: "others", label: "Others" },
];

const initialValues = {
  facility: "",
  hasSubFacility: false,
  subFacilities: [],
  // ticketTypes: [],
};

const validationSchema = Yup.object({
  facility: Yup.string().required("Facility is required"),
  subFacilities: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Sub-Facility Name is required"),
      ticketTypes: Yup.array().of(
        Yup.object({
          type: Yup.string().required("Ticket Type is required"),
          customType: Yup.string().when("type", {
            is: "others",
            then: Yup.string().required("Custom Ticket Type is required"),
          }),
          chargedPerPerson: Yup.string().required("This field is required"),
        })
      ),
    })
  ),
  ticketTypes: Yup.array().of(
    Yup.object({
      type: Yup.string().required("Ticket Type is required"),
      customType: Yup.string().when("type", {
        is: "others",
        then: Yup.string().required("Custom Ticket Type is required"),
      }),
      chargedPerPerson: Yup.string().required("This field is required"),
    })
  ),
});

const ServiceUnifiedCreator = () => {
  return (
    <div className="bg-white/30 p-3 rounded-2xl">
      <div className="bg-white rounded-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Form Submitted:", values);
          }}
        >
          {({ values }) => (
            <Form>
              <div className="flex justify-start items-end gap-4 mb-3">
                <div className="w-1/4">
                  <SelectInput
                    name="facility"
                    label="Select Facility"
                    options={[
                      { value: "facility1", label: "Facility 1" },
                      { value: "facility2", label: "Facility 2" },
                    ]}
                  />
                </div>
                <CheckboxInput name="hasSubFacility" label="Has Sub-Facility" />
              </div>

              <FieldArray name="subFacilities">
                {({ push, remove }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => push({ name: "", ticketTypes: [] })}
                      className="btn btn-primary"
                    >
                      Add Sub-Facility
                    </button>
                    <div className="border border-gray-400 rounded-2xl">
                      {values.subFacilities.map((subFacility, index) => (
                        <div key={index} className="card mb-3 p-3">
                          <div className="flex justify-between">
                            <TextInput
                              name={`subFacilities[${index}].name`}
                              label="Sub-Facility Name"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="btn"
                            >
                              <MdDeleteForever />
                            </button>
                          </div>

                          <div>
                            <FieldArray
                              name={`subFacilities[${index}].ticketTypes`}
                            >
                              {({ push: pushTicket, remove: removeTicket }) => (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      pushTicket({
                                        type: "",
                                        customType: "",
                                        chargedPerPerson: "",
                                      })
                                    }
                                    className="btn btn-primary"
                                  >
                                    Add Ticket Type
                                  </button>
                                  {subFacility.ticketTypes.map(
                                    (_, ticketIndex) => (
                                      <div
                                        key={ticketIndex}
                                        className="mb-3 flex justify-between"
                                      >
                                        <div className="grid grid-cols-3 gap-3">
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].type`}
                                            label="Ticket Type"
                                            options={ticketTypeOptions}
                                          />
                                          {values.subFacilities[index]
                                            .ticketTypes[ticketIndex].type ===
                                            "others" && (
                                            <TextInput
                                              name={`subFacilities[${index}].ticketTypes[${ticketIndex}].customType`}
                                              label="Custom Ticket Type"
                                            />
                                          )}
                                          <SelectInput
                                            name={`subFacilities[${index}].ticketTypes[${ticketIndex}].chargedPerPerson`}
                                            label="Charged Per Person"
                                            options={[
                                              { value: "yes", label: "Yes" },
                                              { value: "no", label: "No" },
                                            ]}
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeTicket(ticketIndex)
                                          }
                                          className="btn btn-danger"
                                        >
                                          <MdDeleteForever />
                                        </button>
                                      </div>
                                    )
                                  )}
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </FieldArray>
              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceUnifiedCreator;
