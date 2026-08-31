import { useEffect } from "react";

export default function ForestDeptDepartmentSync({
  role,
  forestDepartmentId,
  setFieldValue,
  fieldName = "departmentId",
}) {
  useEffect(() => {
    if (role === "Role_ForestDeptAdmin" && forestDepartmentId) {
      setFieldValue(fieldName, forestDepartmentId);
    }
  }, [role, forestDepartmentId, setFieldValue, fieldName]);

  return null;
}
