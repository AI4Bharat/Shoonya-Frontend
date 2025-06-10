import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Chip, Divider, Grid, ThemeProvider } from "@mui/material";
import themeDefault from "../../../theme/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatasetStyle from "../../../styles/Dataset";
import UserMappedByProjectStage from "../../../../utils/UserMappedByRole/UserMappedByProjectStage";


const ProjectCard = (props) => {
  let navigate = useNavigate();
  let { id } = useParams();

  const classes = DatasetStyle();
  const { projectObj } = props;
  const userRole =projectObj.project_stage && UserMappedByProjectStage(projectObj.project_stage).name;
  return (
    <Link to={`/projects/${projectObj.id}`} style={{ textDecoration: "none" }}>
      <Grid
        elevation={2}
        className={props.classAssigned}
        sx={{
          minHeight: 250,
          cursor: "pointer",
          borderRadius: 5,
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            background: "#FFD981",
            p: 1,
            borderRadius: 5,
            width: "fit-content",
          }}
        >
          {projectObj.project_mode}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            textAlign: "center",
            color: "secondary.contrastText",
            backgroundColor: "primary.contrastText",
            borderRadius: 3,
            pt: 1,
            pb: 1,
            minHeight: 64,
            alignItems: "center",
            display: "grid",
          }}
        >
          {projectObj.title}
        </Typography>
        <Grid
          container
          direction="row"
          sx={{ mt: 1, mb: 2 }}
          spacing={3}
          columnSpacing={{ xs: 6, sm: 6, md: 6 }}
        >
          <Grid item sx={{ width: "230px" }}>
            <Typography variant="lightText">Type</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.project_type}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="lightText">Project ID</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.id}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="lightText"> Project Stage</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {userRole ? userRole :projectObj.project_stage}
            </Typography>
          </Grid>
          <Grid item  sx={{pl:0}}>
            <Typography variant="lightText">Target Language</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.tgt_language === null ?"-":projectObj.tgt_language}
            </Typography>
          </Grid>
          <Grid item >
            <Typography variant="lightText">Workspace Id</Typography>
            <Typography
              variant="body2"
              sx={{ color: "primary.contrastText", mt: 0.5, fontWeight: "500" }}
            >
              {projectObj.workspace_id}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Link>
  );
};

export default ProjectCard;
