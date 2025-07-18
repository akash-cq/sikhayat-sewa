import React, { useEffect, useState } from "react";
// import MainLayout from "../components/mainlayout/MainLayout";
import {
  Button,
  Drawer,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import client from "../client/Client";
import { useDataStore, type UsersData } from "../store/store";
import AppLayout from "../components/common/AppLayout";

export default function UsersAdd() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = useForm();
  const setUsers = useDataStore((state) => state.setUsers);
  const addUser = useDataStore((state) => state.addUser);
  const users = useDataStore((state) => state.users);
  // const setLoading = useDataStore((state) => state.setLoading);
  // const isLoading = useDataStore((state) => state.loading);
  const coloums = [
    {
      title: "",
      key: "index",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: UsersData) => {
        return (
          <Flex vertical={false} gap={8} align="middle">
            <Button
              type="primary"
              onClick={() => console.log("Edit user", record)}
            >
              Edit
            </Button>
            <Button danger onClick={() => deleteUser(record.userId)}>
              Delete
            </Button>
          </Flex>
        );
      },
    },
  ];

  const handleDrawer = (value: boolean) => {
    setIsDrawerOpen(value);
    console.log("Drawer state changed to:", value);
  };

  const handleSubmit = async (values: any) => {
    try {
      // setLoading(true);
      const { name, email } = values;
      if (name.trim() === "" || email.trim() === "") {
        message.error("Please fill all the fields.");
        return;
      }
      const response = await client.createUser({ name, email });
      if (!response || !response.userId) {
        throw new Error("Invalid response from server");
      }
      addUser(response);
      handleDrawer(false);
      message.success("User added successfully!");
      form.resetFields();
      // console.log("Users after addition:", users);
    } catch (error: any) {
      console.log(error);
      message.error(error.message ?? "Failed to add User. Please try again.");
    }
    // setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    try {
      if (!userId) {
        message.error("User ID is required to delete a user.");
        return;
      }
      const response = await client.deleteUser(userId);
      message.success(response);
      const updatedUsers = users.filter((user) => user.userId !== userId);
      setUsers(updatedUsers);
    } catch (error: any) {
      console.log(error);
      message.error("Failed to delete User. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // setLoading(true);
        const response = await client.getUsers();
        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid response from server");
        }
        console.log("Fetched users:", response);
        setUsers(response);
        console.log("Users fetched:", response);
      } catch (error) {
        console.log(error);
        // message.error("Failed to fetch users. Please try again.");
      }
      // setLoading(false);
    };
    if (users.length === 0) fetchUsers();
  }, []);

  return (
    <AppLayout
      title="Manage Users"
      extra={
        <Button type="primary" onClick={() => handleDrawer(true)}>
          Add new User
        </Button>
      }
    >
      {/** Table Of users */}

      <Table
        dataSource={users}
        rowKey="userId"
        columns={coloums}
        bordered
        pagination={{ pageSize: 2 }}
        scroll={{ x: 800 }}
      />


      {/** form to add User */}

      <Drawer
        title="Add User"
        placement="right"
        onClose={() => handleDrawer(false)}
        open={isDrawerOpen}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleSubmit(values)}
          initialValues={{ name: "", email: "" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input User name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="email"
            name="email"
            rules={[{ required: true, message: "Please input User email id!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </AppLayout>
  );
}
