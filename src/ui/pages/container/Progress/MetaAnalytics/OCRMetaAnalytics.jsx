import React from 'react';
import Grid from "@mui/material/Grid";
import WordCountMetaAnalyticsChart from './WordCountMetaAnalyticsChart';

export default function OCRMetaAnalytics({ analyticsData }) {
  return (
    <Grid style={{ marginTop: "15px" }}>
      <WordCountMetaAnalyticsChart analyticsData={analyticsData} graphCategory='ocrWordCount' />
    </Grid>
  );
}