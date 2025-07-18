import React from "react";
import AppLayout from "../common/AppLayout";
import { Divider } from "antd";

export default function Profile() {
  return (
    <AppLayout title="Profile" extra={<Divider />}>
      <div>Profile</div>
    </AppLayout>
  );
}
