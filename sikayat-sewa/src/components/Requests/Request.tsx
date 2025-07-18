import { useEffect, useState } from "react";

import AppLayout from "../common/AppLayout";
import {
  Button,
  Dropdown,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Upload,
  type MenuProps,
} from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EyeFilled,
  LineChartOutlined,
  LoadingOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import client from "../../client/Client";
import {
  useAuthStore,
  useDataStore,
  type RequestData,
} from "../../store/store";
import { requestStatus } from "../../libs";
import { pdfjs } from "react-pdf";
import { Link, useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
export default function Requests() {
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const coloums = [
    {
      title: "",
      dataIndex: "Sr No",
      key: "Sr",
      render: (_: any, _1: RequestData, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Request Name",
      key: "Request Name",
      dataIndex: "title",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Description Name",
      key: "Description Name",
      dataIndex: "description",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Created At",
      key: "Created At",
      dataIndex: "createdAt",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "Document",
      key: "docCount",
      render: (record: RequestData) => {
        return (
          <>
            {record.docCount > 0 ? (
              <Link to={`/dashboard/requests/${record.RequestId}/document`}>
                {record.docCount}
              </Link>
            ) : (
              <span style={{ color: "#1677ff", cursor: "not-allowed" }}>
                {record.docCount}
              </span>
            )}
          </>
        );
      },
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "status",
      render: (status: number) => {
        if (status == requestStatus.pending)
          return <Tag color="red">Pending</Tag>;
        else if (status == requestStatus["in-progress"])
          return <Tag color="blue" icon={<LoadingOutlined />}>In Progress</Tag>;
        else if (status == requestStatus.completed)
          return <Tag color="green">Completed</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: RequestData) => {
        const items: MenuProps["items"] = [];

        if (record.status === requestStatus.pending) {
          items.push(
            {
              key: "1",
              label: "Preview",
              icon: <EyeFilled />,

              onClick: () => {
                // console.log("Preview clicked for request:", record);
                // Implement preview logic here
                setIsPreview(true);
                setPreviewUrl(record.url);
              },
            },
            {
              key: "2",
              label: "Generate",
              icon: <SettingOutlined />,
              onClick: () => generateButtonHandler(record),
            },
            {
              key: "3",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => deleteRequest(record),
            }
          );
        } else if (record.status === requestStatus["completed"]) {
          items.push(
            {
              key: "1",
              label: "Preview",
              icon: <EyeFilled />,

              onClick: () => {
                // console.log("Preview clicked for request:", record);
                // Implement preview logic here
                setIsPreview(true);
                setPreviewUrl(record.url);
              },
            },
            {
              key: "2",
              label: "View Report",
              icon: <LineChartOutlined />,
              onClick: () => {
                // console.log("View report clicked for request:", record);
                // Implement view report logic here
                
                navigate("/dashboard/requests/" + record.RequestId);
              },
            },
            {
              key: "3",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => deleteRequest(record),
            }
          );
        } else if (record.status === requestStatus["in-progress"]) {
          items.push({
            key: "1",
            label: "Preview",
            icon: <EyeFilled />,
            onClick: () => {
              // console.log("Preview clicked for request:", record);
              // Implement preview logic here
              setIsPreview(true);
              setPreviewUrl(record.url);
            },
          });
        }
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button>
              <Space>
                Actions
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const setRequests = useDataStore((state) => state.setrequests);
  const addRequest = useDataStore((state) => state.addRequest);
  const requests = useDataStore((state) => state.Requests);
  const handleDrawer = (value: boolean) => {
    setIsDrawerOpen(value);
    // console.log("Drawer state changed to:", value);
  };
  const [form] = Form.useForm();
  const session = useAuthStore((state) => state.session);
  const [disabled, setDisabled] = useState(false);

  async function generateButtonHandler(request: RequestData) {
    try {
      // console.log("Generating AI report for request:", request);
      const response = await client.generateAiReport(request, session.userId);
      // console.log("AI report generated successfully:", response);
      const updatedRequest = requests.map((item) => {
        if (item.RequestId == response.RequestId) {
          return {
            ...item,
            status: requestStatus["in-progress"],
          };
        }
        return item;
      });
      setRequests(updatedRequest);
      message.success("Request in Progress!");
    } catch (error: any) {
      // console.error("Error generating AI report:", error);
      message.error(
        error.message ?? "Failed to generate AI report. Please try again."
      );
    }
  }
  async function deleteRequest(request: RequestData) {
    try {
      const response = await client.deleteRequest(request.RequestId);
      const requestData = requests.filter(
        (item) => item.RequestId != request.RequestId
      );
      setRequests(requestData);
      message.success(response);
    } catch (error: any) {
      console.log(error);
      message.error(error.message ?? "Something went wrong");
    }
  }
  const handleSubmit = async (values: any) => {
    try {
      setDisabled(true);
      const valuesToSubmit = {
        title: values.title,
        description: values.description,
        file: values.file.fileList[0].originFileObj, // get real File object
        userId: session.userId,
      };
      // console.log("Submitting form with values:", valuesToSubmit);

      const response = await client.sendRequest(valuesToSubmit);
      addRequest(response);
      // console.log("Response from server:", response);
      message.success("Request submitted successfully!");
      handleDrawer(false);
    } catch (error: any) {
      console.log("Error submitting form:", error);
      message.error(
        error.message ?? "Failed to submit the request. Please try again."
      );
    }
    setDisabled(false);
    form.resetFields();
  };

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await client.getRequestData(session.userId);
        setRequests(response);
        // console.log("Requests fetched successfully:", response);
        // console.log(response);
      } catch (error: any) {
        console.log(error);
      }
    }
    fetchRequests();
  }, []);
  return (
    <AppLayout
      title="Request"
      extra={
        <Button type="primary" onClick={() => handleDrawer(true)}>
          New Request
        </Button>
      }
    >
      <div className="relative ">
        {/* Table stays in normal flow */}
        <Table
          className="relative z-10"
          style={{ marginTop: "20px" }}
          columns={coloums}
          bordered
          pagination={{ pageSize: 5 }}
          scroll={{ x: 800 }}
          dataSource={requests}
        />

        {isPreview && ( // Change this to `isPreviewOpen` or any state to toggle it */}
          <div className="fixed top-15 left-1/4  bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] rounded-lg shadow-lg w-[920px] relative">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700 bg-[#2b2b2b] rounded-t-lg">
                <span className="text-white font-medium">
                  Cloud_Architecture,_Services_and_Models.pdf
                </span>
                <button

                  className="text-white hover:text-red-500 transition cursor-pointer"
                  onClick={() => {
                    // console.log("close preview");
                    setIsPreview(false);
                    setPreviewUrl(null);
                  }} // replace with setIsPreviewOpen(false)
                >
                  ✕
                </button>
              </div>

              {/* Iframe Body */}
              <div className="p-2">
                <iframe
                  src={previewUrl != null ? previewUrl : ""}
                  width="900"
                  height="550"
                  className="rounded-md"
                  title="PDF Viewer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Create Request"
        open={isDrawerOpen}
        onCancel={() => handleDrawer(false)}
        footer={[
          <Button key="cancel" onClick={() => handleDrawer(false)}>
            Cancel
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Request Title"
            name="title"
            rules={[
              { required: true, message: "Please input the request Title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Request Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the request description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Upload Pdf"
            name="file"
            rules={[{ required: true, message: "Please upload a document!" }]}
          >
            <Upload
              beforeUpload={() => false}
              name="file"
              accept=".pdf"
              listType="text"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={disabled}
            >
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
}
