import UserCreate from "../../../components/user_management/UserCreate";
import UserList from "../../../components/user_management/UserList";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AdminUsers() {
  return (
    <AdminLayout>
      <div>
        <h1>User Management</h1>
        <UserList />
        <UserCreate />
      </div>
    </AdminLayout>
  );
}
