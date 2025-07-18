import { Button, Form, Input, message, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useAuthStore, useDataStore } from "../../../store/store";
import client from "../../../client/Client";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const setLoading = useDataStore((state) => state.setLoading);
    const setSession = useAuthStore((state) => state.setSession);
    const loading = useDataStore((state) => state.loading);
    const naviagte = useNavigate()
    const [form] = useForm();

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const { email, password } = values;
            const response = await client.Login({ email, password });
            
            setLoading(false);
            message.success("Login successful!");
            form.resetFields();
            setSession(response);
            naviagte("/dashboard/requests");
        } catch (error:any) {
            message.error(error.message?? "Login failed. Please try again.");
            naviagte('/login')
            setLoading(false)
        }
    }
    
    return (
        <div className="flex justify-center items-center h-screen bg-[#b9b9b9]">
            <div className="bg-white shadow-lg mx-auto p-8 border-2 border-white border-solid rounded-lg flex flex-col mt-10 items-center h-96 w-105">
                <h1 className="text-4xl font-semibold ">Shikayat Sewa</h1>
                <h3 className="text-xl">Login into your account</h3>
                <Form
                    form={form}
                    className="w-full max-w-sm flex justify-center flex-col h-154"
                    layout="vertical"
                    onFinish={(values) =>handleSubmit(values)}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="w-full"
                            loading={loading}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
