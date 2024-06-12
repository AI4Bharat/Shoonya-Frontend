import ReviewLSF from "../Label-Studio/ReviewLSF";
import ReviewAudioTranscriptionLandingPage from "./ReviewAudioTranscriptionLandingPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch } from "react-redux";
import SuperCheckerLSF from "../Label-Studio/SuperCheckerLSF";
import SuperCheckerAudioTranscriptionLandingPage from "./SuperCheckerAudioTranscriptionLandingPage";

const ReviewerSupercheckerTranscription = (props) => {
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const { projectId, taskId } = useParams();
  const { path } = props;
   const dispatch = useDispatch();

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };
  useEffect(() => {
    getProjectDetails();
  }, [projectId, taskId]);

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {ProjectDetails?.project_type === "StandardizedTranscriptionEditing" ? (
        path === "projects/:projectId/review/:taskId" ? (
          <ReviewAudioTranscriptionLandingPage />
        ) : path==="projects/:projectId/SuperChecker/:taskId"? (
          <SuperCheckerAudioTranscriptionLandingPage />
        ) : (
          <SuperCheckerLSF />
        )
      ) : (
        <ReviewLSF />
      )}
    </div>
  );
};

export default ReviewerSupercheckerTranscription;
