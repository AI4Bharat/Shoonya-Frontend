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

const ReviewerSupercheckerTranscription = () => {
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const { projectId, taskId } = useParams();
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
        ProjectDetails?.project_stage === 2 ? (
          <ReviewAudioTranscriptionLandingPage />
        ) : ProjectDetails?.project_stage === 3 ? (
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