import { Layout } from "antd";
import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";

function Dashboard() {
    const [collapsed, setCollapsed] = useState<boolean>(false);
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
        <Outlet />
      </Sidebar>
    </Layout>
  );
}

export default Dashboard;
