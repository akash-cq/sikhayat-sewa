import React, { useEffect } from "react";
import CommonProblem from "./CommonProblem";
import AppLayout from "../common/AppLayout";
import { Card } from "antd";
import { useParams } from "react-router-dom";
import Wardwise from "./Wardwise";
import { useDataStore } from "../../store/store";
import client from "../../client/Client";
import WardProblemsPage from "./Graph";

export default function ReportPage() {
  const  {RequestId}  = useParams();
  console.log()
  const tablist = [
    {
      key: "Common Problem",
      tab: "Common Problem",
    },
    {
      key: "Ward Wise Problem",
      tab: "Ward Wise Problem",
    },
    {
      key: "Analysis",
      tab: "Analysis",
    },
  ];
  const contentList: Record<string, React.ReactNode> = {
    "Common Problem": <CommonProblem />,
    "Ward Wise Problem": <Wardwise />,
    "Analysis":<WardProblemsPage/>
  };
  const [activeTab, setActiveTab] = React.useState("Common Problem");
  const setCommonProblems = useDataStore((state) => state.setCommonProblems);
  const setWardWiseProblems = useDataStore(
    (state) => state.setWardWiseProblems
  );
  const setBarGraphData = useDataStore((state) => state.setBarGraphData);
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Fetch common problems from the API
        const response = await client.getReportData(RequestId); // Replace "RequestId" with the actual request ID
       
        setCommonProblems(response[0] || []);
        setWardWiseProblems(response[1] || []);
        setBarGraphData(response[2] || []);
      } catch (error) {
        console.error("Error fetching common problems:", error);
      }
    };
    fetchProblems();
    return () => {
      setWardWiseProblems([]);
      setCommonProblems([]);
    };
  }, [RequestId]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <AppLayout title="Report">
      <Card
        tabList={tablist}
        activeTabKey={activeTab}
        onTabChange={handleTabChange}
      >
        {contentList[activeTab]}
      </Card>
    </AppLayout>
  );
}
