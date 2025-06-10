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

export default function WordCountMetaAnalyticsChart(props) {
    const {analyticsData,graphCategory} = props
    const classes = DatasetStyle();
    const [totalWordCount, setTotalWordCount] = useState();
    const [totalAnnotationWordCount, setTotalAnnotationWordCount] = useState();
    const [totalReviewWordCount, setTotalReviewWordCount] = useState();
    const [data, setData] = useState([]);

    useEffect(() => {
      if (graphCategory=="audioWordCount"){
        analyticsData?.sort(
          (a, b) =>
            b.annotation_audio_word_count -
            a.annotation_audio_word_count
        );
        setData(analyticsData);
        let allAnnotatorAudioWordCount = 0;
        let allReviewAudioWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
            allAnnotatorAudioWordCount +=
            (element.annotation_audio_word_count?element.annotation_audio_word_count:0);
            allReviewAudioWordCount += (element.review_audio_word_count?element.review_audio_word_count:0);
          languages = element.languages;
        });
    
        setTotalAnnotationWordCount(allAnnotatorAudioWordCount);
        setTotalReviewWordCount(allReviewAudioWordCount);
        setTotalWordCount(
          allAnnotatorAudioWordCount + allReviewAudioWordCount
        );
      }
      else if (graphCategory=="ocrWordCount"){
        analyticsData?.sort(
          (a, b) =>
            b.ann_ocr_cumulative_word_count -
            a.ann_ocr_cumulative_word_count
        );
    
        setData(analyticsData);
        let allAnnotatorCumulativeWordCount = 0;
        let allReviewCumulativeWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
            allAnnotatorCumulativeWordCount +=
            element.ann_ocr_cumulative_word_count;
            allReviewCumulativeWordCount += element.rew_ocr_cumulative_word_count;
          languages = element.languages;
        });
    
        setTotalAnnotationWordCount(allAnnotatorCumulativeWordCount);
        setTotalReviewWordCount(allReviewCumulativeWordCount);
        setTotalWordCount(
            allAnnotatorCumulativeWordCount + allReviewCumulativeWordCount
        );
      }
      else{
        analyticsData?.sort(
          (a, b) =>
            b.annotation_cumulative_word_count -
            a.annotation_cumulative_word_count
        );
        setData(analyticsData);
        let allAnnotatorCumulativeWordCount = 0;
        let allReviewCumulativeWordCount = 0;
        var languages;
        analyticsData?.map((element, index) => {
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
      }
    }, [analyticsData]);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
          return (
            <div className={classes.toolTip}>
              <p style={{ fontWeight: "bold" }}>
                {`${label}`}
                {graphCategory=="audioWordCount"?<p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.annotation_audio_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.annotation_audio_word_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review_audio_word
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review_audio_word
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.review_audio_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.review_audio_word_count
                          )
                        : 0
                    }`}</p>
                  </p>  
                </p>
                :
                graphCategory=="ocrWordCount"?(<p style={{ fontWeight: "normal" }}>
                  {`Total count : ${
                    payload[0].payload.ann_ocr_cumulative_word_count
                      ? new Intl.NumberFormat("en").format(
                          payload[0].payload.ann_ocr_cumulative_word_count
                        )
                      : 0
                  }`}
                  <p style={{ color: "rgba(243, 156, 18 )" }}>
                    {`Annotation : ${
                      payload[0].payload.diff_annotation_review_ocr_word
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.diff_annotation_review_ocr_word
                          )
                        : 0
                    }`}
                    <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review : ${
                      payload[0].payload.rew_ocr_cumulative_word_count
                        ? new Intl.NumberFormat("en").format(
                            payload[0].payload.rew_ocr_cumulative_word_count
                          )
                        : 0
                    }`}
                    </p>
                  </p>  
                </p>)
                :
                (<p style={{ fontWeight: "normal" }}>
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
                    }`}
                    </p>
                  </p>  
                </p>)
                }
              </p>
            </div>
          );
        }
    
        return null;
      };
    
  return (
    <Box className={classes.modelChartSection}>
         <Typography variant="h2" style={{marginBottom:"35px"}} className={classes.heading}>
         {`Word Count Dashboard - ${analyticsData[0].projectType}`}
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
                Word Count Dashboard
              </Typography>
            </Box>
        <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Total Annotated Task
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalWordCount &&
                  new Intl.NumberFormat("en").format(totalWordCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Pending Review Tasks
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAnnotationWordCount &&
                  new Intl.NumberFormat("en").format(totalAnnotationWordCount)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
              Review Completed Tasks
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
                dataKey={graphCategory=='audioWordCount'?"review_audio_word_count":graphCategory=="ocrWordCount"?"rew_ocr_cumulative_word_count":"review_cumulative_word_count"}
                barSize={30}
                name="Review"
                stackId="a"
                fill="rgba(35, 155, 86 )"
                cursor="pointer"
              />
              <Bar
                dataKey={graphCategory=='audioWordCount'?"diff_annotation_review_audio_word":graphCategory=="ocrWordCount"?"diff_annotation_review_ocr_word":"diff_annotation_review"}
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
