import React, {
    useRef,
    memo,
    useCallback,
    useEffect,
    useState,
  } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { isPlaying } from "../../../../utils/utils";
  import { useParams } from "react-router-dom";

  
  //Styles
  import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
  
  //APIs
  import { setPlayer } from "../../../../redux/actions/Common";
  import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
  import APITransport from "../../../../redux/actions/apitransport/apitransport";

  
  const AudioPanel = memo(
    () => {
      const classes = AudioTranscriptionLandingStyle();
      const dispatch = useDispatch();
      const $audio = useRef();
      const { taskId } = useParams();
  
      const [poster, setPoster] = useState("play.png");
      const [currentTime, setCurrentTime] = useState([]);
      const [playing, setPlaying] = useState([]);
    //   const videoDetails = useSelector((state) => state.getVideoDetails.data);
    //   const fullscreenVideo = useSelector(
    //     (state) => state.commonReducer.fullscreenVideo
    //   );
      const TaskDetails = useSelector((state) => state.getTaskDetails.data);
console.log( TaskDetails?.data?.audio_url,"TaskDetailsTaskDetails")
const getTaskData = () => {
  // setLoading(true);
  const userObj = new GetTaskDetailsAPI(taskId);
  dispatch(APITransport(userObj));
};

useEffect(() => {
  getTaskData();
}, []);
  
      useEffect(() => {
        dispatch(setPlayer($audio.current));
        (function loop() {
          window.requestAnimationFrame(() => {
            if ($audio.current) {
              setPlaying(isPlaying($audio.current));
              setCurrentTime($audio.current.currentTime || 0);
            }
            loop();
          });
        })();
        // eslint-disable-next-line
      }, [setPlayer, setCurrentTime, setPlaying, $audio]);

    //   const onClick = useCallback(() => {
    //     if ($video.current) {
    //       if (isPlaying($video.current)) {
    //         $video.current.pause();
    //         setPoster("play.png");
    //       } else {
    //         $video.current.play();
    //         setPoster("pause.png");
    //       }
    //     }
    //   }, [$video]);
  
      return (
        <div className={classes.videoPlayerParent} style={{ display: "flex" }}>


            
          <audio
            // onClick={onClick}
            controls
            src={TaskDetails?.data?.audio_url} type="audio"
            // style={{
            //   width: videoDetails?.video?.audio_only ? "20%" : "",
            //   margin:
            //     videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
            // }}
            // poster={videoDetails?.video?.audio_only ? poster : ""}
            ref={$audio}
            className={classes.videoPlayer}
          />
        </div>
      );
    },
    () => true
  );
  
  export default AudioPanel;
  