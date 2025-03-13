import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import {  LinearProgress } from "@mui/material";
import GetUserAnalyticsAPI from "../../../../redux/actions/api/UserManagement/GetUserAnalytics";

const ReportBarGraphs = ({ id }) => {
  const [selectRange, setSelectRange] = useState([{ startDate: new Date(), endDate: new Date() }]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  const dispatch = useDispatch();

  const projectTypes = ["MultipleInteractionEvaluation", "ModelInteractionEvaluation", "InstructionDrivenChat"];
  const reportTypes = ["annotation", "review"];

  useEffect(() => {
    const handleProgressSubmit = async () => {
      const promises = [];
      const newLoadingStates = {};

      projectTypes.forEach((projectType) => {
        newLoadingStates[projectType] = false;
      });
      setLoadingStates(newLoadingStates);

      const projectResults = {};

      for (const projectType of projectTypes) {
        projectResults[projectType] = { annotation: {}, review: {} };

        for (const reportType of reportTypes) {
          const reviewdata = {
            user_id: `${id}`,
            project_type: projectType,
            reports_type: reportType,
            start_date: "2023-12-18",
            end_date: format(selectRange[0].endDate, "yyyy-MM-dd"),
          };
    const progressObj = new GetUserAnalyticsAPI(reviewdata);

          promises.push(
            fetch(progressObj.apiEndPoint(), {
              method: "POST",
              body: JSON.stringify(progressObj.getBody()),
              headers: progressObj.getHeaders().headers,
            }).then(async (response) => {
        
                const totalSummary = response?.payload?.total_summary || [];
                if (totalSummary.length > 0 && reportType=="annotation") {
                  projectResults[projectType][reportType] = {
                    annotatedTasks: totalSummary[0]?.["Annotated Tasks"] || 0,
                    avgAnnotationTime: totalSummary[0]?.["Avg Annotation Time (sec)"] || 0,
                  };
                }else if (totalSummary.length > 0 && reportType=="review") {
                  projectResults[projectType][reportType] = {
                    reviewedtasks: totalSummary[0]?.["Reviewed Tasks"] || 0,
                    avgAnnotationTime: totalSummary[0]?.["Avg Annotation Time (sec)"] || 0,
                  }
                }

              })
              .catch((error) => {
                console.error(`Error loading ${projectType} - ${reportType}:`, error);
              })
              .finally(() => {
                newLoadingStates[projectType] = true;
                setLoadingStates({ ...newLoadingStates });
              })
          );
        }
      }

      await Promise.all(promises);

      const formattedData = projectTypes.map((projectType) => ({
        name: projectType,
        annotation: projectResults[projectType].annotation.annotatedTasks || 0,
        review: projectResults[projectType].review.reviewedtasks || 0,
        avgAnnotationTime: projectResults[projectType].annotation.avgAnnotationTime || 0,
      }));

      setAnalyticsData(formattedData);
      setAllLoaded(Object.values(newLoadingStates).every((status) => status));
    };

    handleProgressSubmit();
  }, [dispatch, selectRange]);
console.log(analyticsData);

  return (
    <div style={{ padding: "20px" }}>
      {allLoaded ? (
        <div style={{ width: "100%", height: "350px" }}>
          <ResponsiveContainer>
            <BarChart
              data={analyticsData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"   tick={{ fontSize: 10, textAnchor: "middle", angle: -5 }}
              interval={0} 
              />
              <YAxis />

              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="annotation" fill="#8884d8" name="Annotation"                 stackId="a"
              />
              <Bar dataKey="review" fill="#82ca9d" name="Review"                stackId="a"
 />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
<div style={{ width: "100%", height: "50%px" }}> {/* Explicit height for the progress bar */}
        <LinearProgress  />
      </div>      )}
    </div>
  );
};

export default ReportBarGraphs;