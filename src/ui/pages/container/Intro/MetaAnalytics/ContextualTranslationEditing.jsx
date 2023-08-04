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

export default function ContextualTranslationEditing(props) {
    const {metaAnalyticsData} = props
    const classes = DatasetStyle();
    const [totalWordCount, setTotalWordCount] = useState();
    const [totalAnnotationWordCount, setTotalAnnotationWordCount] = useState();
    const [totalReviewWordCount, setTotalReviewWordCount] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
        metaAnalyticsData[0]?.sort(
        (a, b) =>
          b.annotation_cumulative_word_count -
          a.annotation_cumulative_word_count
      );
      setData(metaAnalyticsData[0]);
      let allAnnotatorCumulativeWordCount = 0;
      let allReviewCumulativeWordCount = 0;
      var languages;
      metaAnalyticsData[0]?.map((element, index) => {
          allAnnotatorCumulativeWordCount +=
          element.annotation_cumulative_word_count;
          allReviewCumulativeWordCount += element.review_cumulative_word_count;
        languages = element.languages;
      });
  
      setTotalAnnotationWordCount(allAnnotatorCumulativeWordCount);
      setTotalReviewWordCount(allReviewCumulativeWordCount);
      setTotalWordCount(
          allAnnotatorCumulativeWordCount + allReviewCumulativeWordCount
      );
    }, [metaAnalyticsData[0]]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className={classes.toolTip}>
              <p style={{ fontWeight: "bold" }}>
                {`${label}`}
                <p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.annotation_cumulative_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.annotation_cumulative_word_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.review_cumulative_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.review_cumulative_word_count
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
         Word Count Dashboard - Translation
          <Typography variant="body1">
            Count of Annotated and Reviewed Translation Tasks
          </Typography>
        </Typography>

        <Typography variant="body" sx={{fontSize:"17px"}}>
          Note : Quality sentence pairs are generated after a pipeline of
          Annotated & Reviewed tasks.
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
                word Count Dashboard
              </Typography>
            </Box>
        <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Word Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalWordCount &&
                  new Intl.NumberFormat("en").format(totalWordCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Annotation Word Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAnnotationWordCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationWordCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Quality/Reviewed Word Count
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalReviewWordCount &&
                  new Intl.NumberFormat("en").format(totalReviewWordCount)}
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
                dataKey="review_cumulative_word_count"
                barSize={30}
                name="Review"
                stackId="a"
                fill="rgba(35, 155, 86 )"
                cursor="pointer"
              />
              <Bar
                dataKey="diff_annotation_review"
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
