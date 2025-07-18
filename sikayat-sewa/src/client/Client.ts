import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Complaint, RequestData } from "../store/store";
class Client {
  private axiosInstance: AxiosInstance;
  constructor() {
    // console.log("Base URL:", baseURL);
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  public async Login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (
        response.status !== 200 ||
        !response.data?.userData ||
        !response.data?.token
      ) {
        throw new Error(response.data?.message || "Invalid credentials");
      }
      const data = response?.data?.userData;
      data.isAuthenticated = true;
      data.token = response?.data?.token;
      return data;
    } catch (error: any) {
      console.log(error);
      throw new Error(
        error?.response?.data?.message || error?.message || "Login failed"
      );
    }
  }

  public async getSession(): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/auth/session");
      const data = response?.data?.userData;
      data.isAuthenticated = true;
      return data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to get session");
    }
  }

  public async createUser({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.post("/auth/add/user", {
        name,
        email,
      });
      const data = response?.data?.userData;
      // console.log(data, response);
      return data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error?.response?.data?.error ?? "Failed to create user");
    }
  }

  public async getUsers(): Promise<any> {
    try {
      const response = await this.axiosInstance.get("/auth/get/all/users");
      const data = response?.data?.users;
      return data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.error ?? error.message ?? "Failed to get users");
    }
  }

  public async sendRequest({
    title,
    description,
    file,
    userId,
  }: {
    title: string;
    description: string;
    file: File;
    userId: string;
  }): Promise<any> {
    try {
      // console.log("Sending request with title:", title, description, file);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("document", file);
      formData.append("userId", userId);
      // console.log(formData)
      const response = await this.axiosInstance.post(
        "/auth/request/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Response from sendRequest:", response);
      return response.data.request ?? response.data.data?.response ?? null;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to send request");
    }
  }

  public async getRequestData(userId: string): Promise<RequestData[]> {
    try {
      const response = await this.axiosInstance.get(
        `/auth/request/get/all/${userId}`
      );
      // console.log("Response from getRequestData:", response);
      return response?.data?.requests ?? response?.data?.data?.response ?? [];
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to get request data");
    }
  }

  public async deleteRequest(requestId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(
        `/auth/request/delete/${requestId}`
      );
      // console.log("Response from deleteRequest:", response);
      return response?.data?.message ?? "Request deleted successfully";
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to delete request");
    }
  }

  public async generateAiReport(
    request: RequestData,
    userId: string
  ): Promise<any> {
    try {
      const response = await this.axiosInstance.post(
        `/auth/request/generate/ai/${request.RequestId}`,
        {
          title: request.title,
          description: request.description,
          userId: userId,
        }
      );
      // console.log("Response from generateAiReport:", response);
      return (
        response?.data?.updatedData ?? response?.data?.data?.updatedData ?? null
      );
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message || "Failed to generate AI report");
    }
  }

  public async getComplaints(
    RequestId: string | undefined
  ): Promise<Complaint[]> {
    try {
      if (!RequestId) {
        // console.error("RequestId is undefined");
        return [];
      }
      const response = await this.axiosInstance.get(
        `/auth/request/get/complaints/${RequestId}`
      );
      return (
        response?.data?.complaintsArr ??
        response?.data?.data?.complaintsArr ??
        []
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  public async getOneComplaint(
    RequestId: string | undefined,
    complaintId: string | undefined
  ): Promise<Complaint | null> {
    try {
      // console.log("Fetching one complaint with RequestId:", RequestId, "and complaintId:", complaintId);
      if (!RequestId || !complaintId) {
        // console.error("RequestId or complaintId is undefined");
        return null;
      }
      const response = await this.axiosInstance.get(
        `/auth/request/get/complaints/${RequestId}/${complaintId}`
      );
      return (
        response?.data?.complaint ?? response?.data?.data?.complaint ?? null
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public async getReportData(requestId:string|undefined):Promise<any>{
      try {
        if(!requestId) {
          console.error("RequestId is undefined");
          return null;
        }
        const response = await this.axiosInstance.get(`/auth/report/get/${requestId}`);
        // console.log("Response from getReportData:", response);
        return response?.data?.report ?? response?.data?.data?.report ?? null;
      } catch (error:any) {
        console.log(error);
        throw new Error(error.message || "Failed to get report data");
      }
  }

  public async deleteUser(userId:string):Promise<any>{
    try {
      const response = await this.axiosInstance.delete(`/auth/delete/user/${userId}`);
      return response?.data?.message ?? "User deleted successfully";
      
    } catch (error:any) {
      console.log(error);
      throw new Error(error.message || "Failed to delete user");
    }
  }
}

const client = new Client();
export default client;
