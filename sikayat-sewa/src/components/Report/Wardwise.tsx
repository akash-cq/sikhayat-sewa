import { Card, Flex, Tag } from "antd";
import { useDataStore } from "../../store/store";
import ModalForCenter from "../common/ModalForCenter";
import TableDoc from "../Requests/TableDoc";

export default function Wardwise() {
  const Wardwise = useDataStore((state) => state.wardWiseProblems);
  return (
    <>
      {Wardwise.map((problem) => {
        return (
          <div className="text-semibold m-2 w-300 border-2 border-gray-200 p-4 rounded-lg shadow-md bg-white border-l-5 border-l-gray-500 flex flex-col justify-between gap-5">
            <div className="w-full flex justify-between">
              <div className="flex font-semibold text-lg gap-2">
                <h2>Ward No </h2> <span>{problem.wardNo}</span>
              </div>
              <Tag color="green">Ward Wise</Tag>
            </div>
            {/* 
            <ModalForCenter onClose={() => {}}>
              
              <TableDoc Complaint={problem.Problems} />
            </ModalForCenter> */}

            <Flex vertical gap={10} wrap="wrap">
              {problem.Problems.map((item) => {
                return (
                  <Card
                    key={item.problemSort}
                    className="w-full"
                    style={{ width: "100%" }}
                  >
                    <Flex justify="space-between">
                      <span>{item.problemSort}</span>
                      <div>
                        {item.categories.map((tag, index) => (
                          <Tag key={index} color="blue" >
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          </div>
        );
      })}
    </>
  );
}
