import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Spin } from "antd";
import { useAuthStore } from "../store/store";

const RedirectByRole = () => {
  const navigate = useNavigate();
  const session = useAuthStore().session;

  useEffect(() => {
    console.log("RedirectByRole session:", session);
    if (session) {
      navigate("/dashboard/requests");
    }
  }, [session, navigate]);

  return (
    <div className="flex justify-center items-center h-[90vh] w-full">
      <Spin size="large"></Spin>
    </div>
  );
};

export default RedirectByRole;
