import React from "react";
import WalkerpassForm from "./WalkerpassForm";
import AdminLayout from "../../layouts/AdminLayout";

const WalkerpassMain = () => {
  return (
    <AdminLayout>
    <div>
      <WalkerpassForm />
    </div>
    </AdminLayout>
  );
};

export default WalkerpassMain;