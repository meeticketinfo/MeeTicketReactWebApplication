import React from 'react';
import DepartmentForm from '../components/DepartmentForm';
import { useDepartmentStore } from '../store/useDepartmentStore';
import departmentService from '../services/departmentService';

const DepartmentEdit = ({
  isDepartmentTypeEditVisible,
  setIsDepartmentTypeEditVisible,
}) => {
  const {
    saveDepartmentTypeDetails,
    departmentTypeEditDetails,
    isSaveDepartmentTypeDetailsLoading,
    fetchAllDepartmentTypes,
    setDepartmentTypeEditDetails,
  } =departmentService()

  const initialValues = {
    departmentId: departmentTypeEditDetails?.departmentId || '',
    departmentName: departmentTypeEditDetails?.departmentName || '',
    isActive: departmentTypeEditDetails?.isActive || true,
  };

  const onSubmit = async (values, { setSubmitting }) => {
    values.isActive = values.isActive === true || values.isActive === 'true';
      const result = await saveDepartmentTypeDetails(values, true); 
        fetchAllDepartmentTypes();

  };

  return (

    <DepartmentForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      isSubmitting={isSaveDepartmentTypeDetailsLoading}
      isDepartmentTypeEditVisible={isDepartmentTypeEditVisible}
      isSaveDepartmentTypeDetailsLoading={isSaveDepartmentTypeDetailsLoading}
    />

  );
};

export default DepartmentEdit;
