import React from 'react';
import { Grid, ThemeProvider, Box, Typography, Paper } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Label,
  } from "recharts";
  import DatasetStyle from "../../../../styles/Dataset";
  import { useEffect, useState } from "react";
  import ResponsiveChartContainer from "../../../component/common/ResponsiveChartContainer"

export default function SentanceCountMetaAnalyticsChart(props) {
    const {analyticsData} = props
    const classes = DatasetStyle();
    const [totalSentanceCount, setTotalSentanceCount] = useState();
    const [totalAnnotationSentanceCount, setTotalAnnotationSentanceCount] = useState();
    const [totalReviewSentanceCount, setTotalReviewSentanceCount] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
        analyticsData?.sort(
        (a, b) =>
          b.annotation_cumulative_sentance_count -
          a.annotation_cumulative_sentance_count
      );
      setData(analyticsData);
      let allAnnotatorCumulativeSentanceCount = 0;
      let allReviewCumulativeSentanceCount = 0;
      var languages;
      analyticsData?.map((element, index) => {
          allAnnotatorCumulativeSentanceCount +=
          (element.annotation_cumulative_sentance_count?element.annotation_cumulative_sentance_count:0);
          allReviewCumulativeSentanceCount += (element.review_cumulative_sentance_count?element.review_cumulative_sentance_count:0);
        languages = element.languages;
      });
  
      setTotalAnnotationSentanceCount(allAnnotatorCumulativeSentanceCount);
      setTotalReviewSentanceCount(allReviewCumulativeSentanceCount);
      setTotalSentanceCount(
          allAnnotatorCumulativeSentanceCount + allReviewCumulativeSentanceCount
      );
    }, [analyticsData]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className={classes.toolTip}>
              <p style={{ fontWeight: "bold" }}>
                {`${label}`}
                <p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.annotation_cumulative_sentance_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.annotation_cumulative_sentance_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review_sentance_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review_sentance_count
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.review_cumulative_sentance_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.review_cumulative_sentance_count
                          )
                        : 0
                    }`}</p>
                  </p>
                </p>
              </p>
            </div>
          );
        }
    
        return null;
      };
    
  return (
    <Box className={classes.modelChartSection}>
         <Typography variant="h2" style={{marginBottom:"35px"}} className={classes.heading}>
         {`Sentance Count Dashboard - ${analyticsData[0].projectType}`}
          <Typography variant="body1">
            Count of Annotated and Reviewed Data
          </Typography>
        </Typography>
        <Paper>
          <Box className={classes.topBar}>
          <Box className={classes.topBarInnerBox}>
          <Typography
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  padding: "16px 0",
                }}
              >
                Sentance Count Dashboard
              </Typography>
            </Box>
        <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Sentance Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalSentanceCount &&
                  new Intl.NumberFormat("en").format(totalSentanceCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Annotation Sentance Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAnnotationSentanceCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationSentanceCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Quality/Reviewed Sentance Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalReviewSentanceCount &&
                  new Intl.NumberFormat("en").format(totalReviewSentanceCount)}
              </Typography>
            </Box>
          </Box>
      <Grid>
        <ResponsiveChartContainer>
            <BarChart
              width={1100}
              height={600}
               data={data}
              fontSize="14px"
              fontFamily="Roboto"
              margin={{
                top: 20,
                right: 60,
                left: 40,
                bottom: 20,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="languages"
                textAnchor={"end"}
                // tick={<CustomizedAxisTick />}
                height={90}
                interval={0}
                position="insideLeft"
                type="category"
                angle={-30}
              >
                <Label
                  value="Language"
                  position="insideBottom"
                  fontWeight="bold"
                  fontSize={16}
                ></Label>
              </XAxis>
              <YAxis
                tickInterval={10}
                allowDecimals={false}
                type="number"
                dx={0}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en", { notation: "compact" }).format(
                    value
                  )
                }
              >
                <Label
                  value="# of count Completed"
                  angle={-90}
                  position= 'insideLeft'
                  fontWeight="bold"
                  fontSize={16}
                  offset={-10}
                ></Label>
              </YAxis>
              {/* <Label value="Count" position="insideLeft" offset={15} /> */}
              <Tooltip
                contentStyle={{ fontFamily: "Roboto", fontSize: "14px" }}
                formatter={(value) => new Intl.NumberFormat("en").format(value)}
                cursor={{ fill: "none" }}
                content={<CustomTooltip />}
              />
              <Legend verticalAlign="top" />
              <Bar
                dataKey="review_cumulative_sentance_count"
                barSize={30}
                name="Review"
                stackId="a"
                fill="rgba(35, 155, 86 )"
                cursor="pointer"
              />
              <Bar
                dataKey="diff_annotation_review_sentance_count"
                barSize={30}
                name="Annotation"
                stackId="a"
                fill="rgba(243, 156, 18 )"
                
              />
            </BarChart>
            </ResponsiveChartContainer>
          </Grid>
         
          </Paper>
    </Box>
  )
}