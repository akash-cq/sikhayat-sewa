// PersonDoc.js (No changes needed here from previous suggestion)
import { useEffect } from "react";
import AppLayout from "../common/AppLayout";
import { Button, Card, Flex, Tag } from "antd";
import { useParams } from "react-router-dom";
import client from "../../client/Client";
import { useDataStore } from "../../store/store";

const color = [
  "magenta",
  "red",
  "volcano",
  // "orangek",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];
export default function PersonDoc() {
  const { RequestId, ComplaintId } = useParams<{
    RequestId: string;
    ComplaintId: string;
  }>();
  const setOneComplaint = useDataStore((state) => state.setOneComplaint);
  const oneComplaint = useDataStore((state) => state.oneComplaint);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintData = await client.getOneComplaint(
          RequestId,
          ComplaintId
        );
        if (setOneComplaint) {
          setOneComplaint(complaintData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [RequestId, ComplaintId, setOneComplaint]);

  if (!oneComplaint) {
    return (
      <AppLayout title="Document Details">
        <div>Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Document Details">
      <Card title="Basics  Information" className="mb-4">
        <Flex vertical gap="middle">
          <div>
            <strong>Name (English):</strong> {oneComplaint.nameInEnglish}
          </div>
          <div>
            <strong>Name (Hindi):</strong> {oneComplaint.nameInHindi}
          </div>
          <div>
            <strong>Mobile Number:</strong> {oneComplaint.mobileNo}
          </div>
          <div>
            <strong>Ward:</strong> {oneComplaint.ward}
          </div>
          <div>
            <strong>Problems Count:</strong> {oneComplaint.problemsCount}
          </div>
          <div>
            <strong>Tags:</strong>
            <div className="mt-2">
              {oneComplaint.tags.map((tag, index) => (
                <Tag key={index} className="mb-1"  color={color[index % color.length]}>
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
        </Flex>
      </Card>

      <Card title="Problems" className="mb-4">
        {oneComplaint.problems.map((problem, index) => (
          <Card
            key={index}
            type="inner"
            title={`Problem ${index + 1}`}
            className="mb-2"
            style={{ marginBottom: "10px" }}
          >
            <div>
              <strong>English:</strong> {problem.text.english}
            </div>
            <div>
              <strong>Hindi:</strong> {problem.text.hindi}
            </div>
            {problem.tag && (
              <div>
                <strong>Tag:</strong> {problem.tag}
              </div>
            )}
          </Card>
        ))}
      </Card>
    </AppLayout>
  );
}
