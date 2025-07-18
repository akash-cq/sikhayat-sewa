import AppLayout from "../common/AppLayout";
import { Button, Table, Tag, Tooltip } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import client from "../../client/Client";
import { useDataStore, type Complaint } from "../../store/store";
import TableDoc from "./TableDoc";

export default function DocumentsPage() {
  const { RequestId } = useParams();
  const navigate = useNavigate();
  const setComplaints = useDataStore((state) => state.setComplaints);
  const complaints = useDataStore((state) => state.Complaints);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await client.getComplaints(RequestId);
        // console.log("Response from getComplaints:", response);
        setComplaints(response);
      } catch (error) {
        console.log("Error fetching complaints:", error);
      }
    };
    if (RequestId) {
      fetchComplaint();
    } else {
      console.error("requestId is undefined");
    }
  }, [RequestId]);

  return (
    <AppLayout title="Documents">
      <TableDoc Complaint={complaints} />
    </AppLayout>
  );
}
