import { Avatar, Button, Collapse, Layout, Menu, Tooltip } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  DiffOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { Children } from "react";

export default function Sidebar(props: {
  collapsed: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  children?: React.ReactNode;
}) {
  const session = useAuthStore((state) => state.session);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine selected key based on path
  const getSelectedKey = () => {
    if (location.pathname === "/users") return ["2"];
    return ["1"]; // default to home
  };
console.log(session)
  return (
    <Layout>
      <Sider
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        trigger={null}
        collapsible
        collapsed={props.collapsed}
      >
        <div>
          <div className="bg-[#001529] text-white text-lg p-2 flex justify-between items-center">
            {!props.collapsed && <span>Shikayat Sewa</span>}
            <Button
              style={{ width: "5px", height: "25px", margin: "10px" }}
              onClick={() => props.setCollapsed?.(!props.collapsed)}
            >
              {props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={getSelectedKey()}
            items={
              session.roll === 1
                ? [
                    {
                      key: "1",
                      icon: <DiffOutlined />,
                      label: "Requests",
                      onClick: () => navigate("/dashboard/requests"),
                    },
                    {
                      key: "2",
                      icon: <UserOutlined />,
                      label: "Users",
                      onClick: () => navigate("/dashboard/users"),
                    },
                  ]
                : [
                    {
                      key: "1",
                      icon: <DiffOutlined />,
                      label: "Requests",
                      onClick: () => navigate("/dashboard/requests"),
                    },
                  ]
            }
          />
            <div
              className="h-16 ml-5 mt-5"
              onClick={() => {
                navigate("/dashboard/profile");
              }}
            >
              <Avatar style={{ backgroundColor: "#f56a00" }}>
                {session?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              {!props.collapsed && (
                <>
                  <span className="text-white ml-2">{session.name}</span>
                  <p className="text-white">{session.email}</p>
                </>
              )}
              </div>
        </div>
      </Sider>
      <Layout>{props.children}</Layout>
    </Layout>
  );
}
