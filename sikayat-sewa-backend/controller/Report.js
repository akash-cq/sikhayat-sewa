import Report from "../modals/Report.js";

const getReport = async (data, options = {}) => {
  const requestId = data;
  const report = await Report.findOne(
    {
      requestId: requestId,
    },
    options
  );
  if (!report || report.isDeleted) {
    throw new Error("Report not found or has been deleted");
  }
  return report;
};
const getCommonProblems = async (report) => {
  const commonProblems = [];
  for (let items of report?.commonProblems) {
    const payload = {
      RequestId: report?.requestId,
      ReportId: report?.ReportId,
      ProblemSort: items?.problem,
      categories: items?.categories || [],
      count: items?.count || 0,
    };
    const reporters = items?.reporters?.map((reporter) => {
    //   console.log(reporter, "reporter");
      return {
        nameInEnglish: reporter?.name?.english,
        nameInHindi: reporter?.name?.hindi,
        ReporterId: reporter?.ReporterId,
        phoneNumber: reporter?.phoneNumber,
        wardNumber: reporter?.wardNumber,
        problemsReported: reporter?.problemsReported.map((problem) => {
          return {
            category: problem?.category || [],
            problemDescription_inHindi: problem?.description?.hindi || "",
            problemDescription_inEnglish: problem?.description?.english || "",
          };
        }),
      };
    });
    // console.log(reporters, "reporters");
    payload.reporters = reporters;
    commonProblems.push(payload);
  }
  // console.log(commonProblems, "commonProblems");
  return commonProblems;
};

const getWardWiseProblems = async (report) => {
  const wardWiseProblems = [];
  for (let items of report?.wardWiseProblems) {
    const payload = {
      wardNo: items?.ward,
      Problems: items.problems.map((problems) => {
        return {
          problemSort: problems?.problem,
          categories: problems?.categories || [],
          count: problems?.count || 0,
          reporters: problems?.reporters?.map((reporter) => {
            return {
              nameInEnglish: reporter?.name?.english,
              nameInHindi: reporter?.name?.hindi,
              ReporterId: reporter?.ReporterId,
              phoneNumber: reporter?.phoneNumber,
              wardNumber: reporter?.wardNumber,
              problemsReported: reporter?.problemsReported.map((problem) => {
                return {
                  category: problem?.category || [],
                  problemDescription_inHindi: problem?.description?.hindi || "",
                  problemDescription_inEnglish:
                    problem?.description?.english || "",
                };
              }),
            };
          }),
        };
      }),
    };
    wardWiseProblems.push(payload);
  }
  return wardWiseProblems;
};
const AnalyticsData = (report)=>{
    const analytics = [];
    for (let items of report?.analytics) {
        const payload = {
        ward: items?.ward,
        totalProblems: items?.totalProblems || 0,
        categories: items?.categories.map((category) => {
            return {
            category: category?.category || "",
            count: category?.count || 0,
            };
        }),
        };
        analytics.push(payload);
    }
    return analytics;
}
const TakeReport = async (data) => {
  const report = await getReport(data);
  if (!report) {
    throw new Error("Report not found");
  }
  const commonProblems = await getCommonProblems(report);
  const wardWiseProblems = await getWardWiseProblems(report);
  const analytics = AnalyticsData(report);
  return [commonProblems, wardWiseProblems, analytics];
};

export default TakeReport;
