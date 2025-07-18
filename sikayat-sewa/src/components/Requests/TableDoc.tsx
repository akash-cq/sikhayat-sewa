import { Button, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import type { Complaint } from '../../store/store';

export default function TableDoc({ Complaint }: { Complaint: any }) {
    console.log("Complaint in TableDoc:", Complaint);
    const navigate = useNavigate();
  const columns = [
    {
      title: "",
      key: "index",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "nameInEnglish",
      key: "nameInEnglish",
    },
    // {
    //   title: "Name in Hindi",
    //   dataIndex: "nameInHindi",
    //   key: "nameInHindi",
    // },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Ward",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Problems",
      dataIndex: "problemsCount",
      key: "problemsCount",
    },
    {
      title: "Tags",
      key: "Tags",
      dataIndex: "tags",
      render: (tags: string[]) => {
        const maxVisible = 2;
        const visibleTags = tags.slice(0, maxVisible);
        const remainingTags = tags.slice(maxVisible);

        return (
          <>
            {visibleTags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
            {remainingTags.length > 0 && (
              <Tooltip title={remainingTags.join(", ")}>
                <Tag>+{remainingTags.length} more</Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Complaint) => {
        return (
          <Button
            type="primary"
            size="small"
            onClick={() =>
              navigate(
                `/dashboard/requests/${record.RequestId}/document/${record.complaintId}`
              )
            }
          >
            View Document
          </Button>
        );
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={Complaint}
      pagination={{
        pageSize: 5,
      }}
      rowKey="ComplaintId"
    />
  );
}
