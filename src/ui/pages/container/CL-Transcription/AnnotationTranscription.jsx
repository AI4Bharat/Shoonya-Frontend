import LSF from "../Label-Studio/LSF";
import AudioTranscriptionLandingPage from "./AudioTranscriptionLandingPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch } from "react-redux";
import { Padding } from "@mui/icons-material";

const AnnotationTranscription = () => {
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const { projectId, taskId } = useParams();
  const dispatch = useDispatch();

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };
  useEffect(() => {
    getProjectDetails();
  }, []);

  if (ProjectDetails) {
    console.log("project", ProjectDetails);
  }
  return (
    <div style={{ margin: 0, padding: 0 }}>
      {ProjectDetails?.project_type === "StandardizedTranscriptionEditing" ? (
        <AudioTranscriptionLandingPage />
      ) : (
        <LSF />
      )}
    </div>
  );
};

export default AnnotationTranscription;
