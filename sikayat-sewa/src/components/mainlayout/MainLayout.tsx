// import React, { useState } from "react";
// import { Breadcrumb, Divider, Layout } from "antd";
// import Sidebar from "../sidebar/Sidebar";
// import { Link, useLocation } from "react-router-dom";

// const { Header, Content, Sider } = Layout;

// export default function MainLayout(props: {
//   title: string;
//   extra?: React.ReactNode;
//   children?: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);
//   const location = useLocation();
//   const pathSnippets = location.pathname.split("/").filter((p) => p);
//   const breadcrumbItems = pathSnippets.map((_, index) => {
//     const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

//     return {
//       title: pathSnippets[index],
//       key: url,
//     };
//   });
//   return (
//     <Layout style={{ maxHeight: "100vh" }}>
//       {/* Sidebar */}
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* Main Section (Header + Content) */}
//       <Layout>
//         {/* Header */}
//         <Header
//           style={{
//             backgroundColor: "transparent",
//             padding: "0 24px",
//             borderBottom: "1px solid #ddd",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <h1 className="text-xl font-semibold m-0">{props.title}</h1>
//             <Breadcrumb
//               items={[ ...breadcrumbItems]}
//               style={{ marginTop: "4px" }}
//             />
//           </div>

//           {props.extra && props.extra}
//         </Header>

//         {/* Divider */}
//         <Divider style={{ margin: 0 }} />

//         {/* Main Content */}
//         <Content
//           style={{
//             margin: "16px",
//             padding: "24px",
//             backgroundColor: "#fff",
//             overflowY: "auto",
//             flex: 1,
//           }}
//         >
//           <div className="h-full w-full overflow-y-auto custom-scrollbar">
//             {props.children}
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// }
