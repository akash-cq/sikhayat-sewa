// import React from 'react';
// import { Layout, Skeleton } from 'antd';

// const { Header, Content, Sider } = Layout;

// const LayoutSkeleton: React.FC = () => {
//   return (
//     <Layout style={{ maxHeight: "100vh" }}>
//       {/* Sidebar Skeleton */}
//       <Sider
//         style={{
//           background: '#001529',
//           minHeight: '100vh',
//           width: 200,
//         }}
//       >
//         <div className="p-4">
//           <Skeleton.Input 
//             active 
//             size="large" 
//             style={{ width: '100%', height: 40, marginBottom: 20 }}
//           />
//           <Skeleton.Input 
//             active 
//             size="default" 
//             style={{ width: '80%', height: 20, marginBottom: 10 }}
//           />
//           <Skeleton.Input 
//             active 
//             size="default" 
//             style={{ width: '60%', height: 20, marginBottom: 10 }}
//           />
//           <Skeleton.Input 
//             active 
//             size="default" 
//             style={{ width: '70%', height: 20 }}
//           />
//         </div>
//       </Sider>

//       {/* Main Section Skeleton */}
//       <Layout>
//         {/* Header Skeleton */}
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
//             <Skeleton.Input 
//               active 
//               size="large" 
//               style={{ width: 200, height: 32, marginBottom: 8 }}
//             />
//             <Skeleton.Input 
//               active 
//               size="default" 
//               style={{ width: 150, height: 16 }}
//             />
//           </div>
//           <Skeleton.Button active size="large" />
//         </Header>

//         {/* Content Skeleton */}
//         <Content
//           style={{
//             margin: "16px",
//             padding: "24px",
//             backgroundColor: "#fff",
//             overflowY: "auto",
//             flex: 1,
//           }}
//         >
//           <div className="space-y-4">
//             <Skeleton.Input 
//               active 
//               size="large" 
//               style={{ width: '100%', height: 40 }}
//             />
//             <Skeleton.Input 
//               active 
//               size="default" 
//               style={{ width: '100%', height: 200 }}
//             />
//             <Skeleton.Input 
//               active 
//               size="default" 
//               style={{ width: '100%', height: 200 }}
//             />
//           </div>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default LayoutSkeleton; 