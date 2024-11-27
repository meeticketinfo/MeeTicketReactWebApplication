import React from 'react'
import DepartmentForm from '../components/DepartmentForm'
import { useDepartmentStore } from '../store/useDepartmentStore'
// import departmentService from '../services/departmentService'

const DepartmentCreate = ({
    isDepartmentCreateVisible, setIsDepartmentTypeEditVisible, ValidationSchema
}) => {
    const { saveDepartmentTypeDetails,isSaveDepartmentTypeDetailsLoading, fetchAllDepartmentTypes, setDepartmentTypeEditDetails } = departmentService()
   
    const initialValues = {
        departmentId:"",
        departmentName:"",
        isActive:true,
    };
    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        values.isActive = values.isActive === true || values.isActive === "true";
        const result = await saveDepartmentTypeDetails(
            values,
            isDepartmentTypeEditVisible
        );
    };

    return (
        <>
        <DepartmentForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            ValidationSchema={ValidationSchema}
            isSubmitting={isSaveDepartmentTypeDetailsLoading}
            isDepartmentCreateVisible={isDepartmentCreateVisible}
            isSaveDepartmentTypeDetailsLoading={isSaveDepartmentTypeDetailsLoading}
        />
        </>
    )
}

export default DepartmentCreate
