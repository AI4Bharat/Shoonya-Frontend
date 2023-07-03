import React from "react";
import { Grid, ThemeProvider, Box, Typography, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import DatasetStyle from "../../../../../styles/Dataset";
import { useEffect, useState } from "react";
import ResponsiveChartContainer from "../../../../component/common/ResponsiveChartContainer"

export default function AudioSegmentation(props) {
  const { metaAnalyticsData } = props;
  const classes = DatasetStyle();
  const [totalAudioHours, setTotalAudioHours] = useState();
  const [totalAnnotationAudioHours, setTotalAnnotationAudioHours] = useState();
  const [totalReviewAudioHours, setTotalReviewAudioHours] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    metaAnalyticsData[4]?.sort(
      (a, b) =>
        b.annotation_aud_duration_tohour - a.annotation_aud_duration_tohour
    );
    setData(metaAnalyticsData[4]);
    let allAnnotatorAudioHours = 0;
    let allReviewAudioHours = 0;
    var languages;
    metaAnalyticsData[4]?.map((element, index) => {
        allAnnotatorAudioHours +=
        element.annotation_aud_duration_tohour;
        allReviewAudioHours += element.review_aud_duration_tohour;
      languages = element.languages;
    });

    setTotalAnnotationAudioHours(allAnnotatorAudioHours);
    setTotalReviewAudioHours(allReviewAudioHours);
    setTotalAudioHours(
        allAnnotatorAudioHours + allReviewAudioHours
    );
  }, [metaAnalyticsData[4]]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={classes.toolTips}>
          <p style={{ fontWeight: "bold" }}>
            {`${label}`}
            <p style={{ fontWeight: "normal" }}>
              {`Total hours : ${
                payload[0].payload.annotation_aud_duration_tohour
                  ? new Intl.NumberFormat("en").format(
                      payload[0].payload.annotation_aud_duration_tohour
                    )
                  : 0
              }`}
              <p style={{ fontWeight: "normal" }}>
              {`Total duration : ${payload[0].payload.annotation_aud_duration}`}

             
              
              <p style={{ color: "rgba(243, 156, 18 )" }}>
                {`Annotation duration : ${
                  payload[0].payload.diff_annotation_review_aud_duration_tohour
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload
                          .diff_annotation_review_aud_duration_tohour
                      )
                    : 0
                }`}
                <p style={{ color: "rgba(35, 155, 86 )" }}>{`Review duration : ${
                  payload[0].payload.review_aud_duration_tohour
                    ? new Intl.NumberFormat("en").format(
                        payload[0].payload.review_aud_duration_tohour
                      )
                    : 0
                }`}</p>
              </p>
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
      <Typography
        variant="h2"
        style={{ marginBottom: "35px" }}
        className={classes.heading}
      >
       Audio Duration Dashboard - Audio Segmentation
        <Typography variant="body1">
          Count of Annotated and Reviewed Audio Segmentation
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
                Audio Duration Dashboard
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Audio Hours
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAudioHours &&
                  new Intl.NumberFormat("en").format(totalAudioHours)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Annotation Audio Hours
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalAnnotationAudioHours &&
                  new Intl.NumberFormat("en").format(totalAnnotationAudioHours)}
              </Typography>
            </Box>
            <Box className={classes.topBarInnerBox}>
              <Typography style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                Total Reviewed AudioHours
              </Typography>
              <Typography style={{ fontSize: "1.125rem", fontWeight: "400" }}>
                {totalReviewAudioHours &&
                  new Intl.NumberFormat("en").format(totalReviewAudioHours)}
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
                value="languages"
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
                value="# of hours Completed "
                angle={-90}
                position="insideLeft"
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
              dataKey="review_aud_duration_tohour"
              barSize={30}
              name="Review"
              stackId="a"
              fill="rgba(35, 155, 86 )"
              cursor="pointer"
            />
            <Bar
              dataKey="diff_annotation_review_aud_duration_tohour"
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
  );
}
