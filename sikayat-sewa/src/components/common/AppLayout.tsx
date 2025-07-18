import React, { useState } from "react";
import { Breadcrumb, Divider, Layout } from "antd";
import Sidebar from "../sidebar/Sidebar";
import { useLocation } from "react-router-dom";
// import LayoutSkeleton from "./LayoutSkeleton";

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  title: string;
  extra?: React.ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
}

export default function AppLayout({ title, extra, children, loading = false }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((p) => p);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    return {
      title: pathSnippets[index],
      key: url,
    };
  });

  // if (loading) {
  //   return <LayoutSkeleton />;
  // }

  return (
    <Layout style={{ maxHeight: "100vh" }}>

      <Layout>
        <Header
          style={{
            backgroundColor: "transparent",
            padding: "0 24px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="text-xl font-semibold m-0">{title}</h1>
            <Breadcrumb
              items={[...breadcrumbItems]}
              style={{ marginTop: "4px" }}
            />
          </div>

          {extra && extra}
        </Header>

        <Divider style={{ margin: 0 }} />

        <Content
          style={{
            margin: "16px",
            padding: "24px",
            backgroundColor: "#fff",
            overflowY: "auto",
            flex: 1,
          }}
        >
          <div className="h-full w-full overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
} 