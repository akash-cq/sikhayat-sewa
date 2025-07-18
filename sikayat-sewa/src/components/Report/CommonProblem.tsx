import { Flex, Table, Tag } from "antd";

import { useDataStore, } from "../../store/store";
import ModalForCenter from "../common/ModalForCenter";
import { useState } from "react";
interface tableData {
  nameInEnglish: string | undefined;
  nameInHindi: string | undefined;
  mobileNo: string | undefined;
  ward: string | undefined;
  problemsCount: number | undefined;
  problem: string | undefined;
  categories: string[];
}
export default function CommonProblem() {
  const commonProblems = useDataStore((state) => state.commonProblems);
  const [complaintsData, setComplaintData] = useState([] as tableData[]);
  const handleFilter = (tag: string) => {
    const filteredComplaints = commonProblems.filter((problem) =>
      problem.categories.includes(tag)
    );

    const arr: tableData[] = [];
    filteredComplaints.forEach((problem) => {
      problem.reporters.forEach((reporter) => {
        const payload: tableData = {
          nameInEnglish: reporter.nameInEnglish,
          nameInHindi: reporter.nameInHindi,
          mobileNo: reporter.phoneNumber,
          ward: reporter.phoneNumber,
          problemsCount: problem.count,
          problem: reporter.problemsReported[0].problemDescription_inEnglish,
          categories: problem.categories,
        };
        arr.push(payload);
      });
    });
+    setComplaintData(arr);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "nameInEnglish",
      key: "nameInEnglish",
    },
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
      key: "problems",
      render: (record: tableData) => {
        console.log(record);
        return (
          <div>
            {record.problem}
            <span>(</span>
            <span>
              {record.categories.map((category: string) => category).join(", ")}
            </span>
            <span>)</span>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {commonProblems.map((problems) => {
        // console.log(problems);
        return (
          <div
            key={problems.RequestId}
            className="text-semibold m-2 w-300 border-2 border-gray-200 p-4 rounded-lg shadow-md bg-white border-l-5 border-l-gray-500 flex flex-col justify-between gap-5"
          >
            <h2>{problems.ProblemSort}</h2>
            {complaintsData.length > 0 && (
              <ModalForCenter
                onClose={() => {
                  setComplaintData([]);
                }}
              >
                <Table
                  columns={columns}
                  dataSource={complaintsData}
                  pagination={{ pageSize: 3 }}
                  onRow={(record) => ({
                    onClick: () => {
                      console.log(record);
                    },
                  })}
                />
              </ModalForCenter>
            )}
            <Flex className="m-5 p-5" gap={8} wrap="wrap">
              {problems.categories.map((tag, index) => (
                <Tag
                  key={index}
                  color="blue"
                  onClick={() => {
                    handleFilter(tag);
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Flex>
          </div>
        );
      })}
      
    </>
  );
}
