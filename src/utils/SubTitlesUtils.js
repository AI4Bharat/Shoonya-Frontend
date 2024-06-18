import Sub from "./Sub";
import { getUpdatedTime } from "./utils";
import DT from "duration-time-conversion";
import store from "../redux/store/store";
// import { noiseTags } from "./TabsSuggestionData/NoiseTages";

export const newSub = (item) => {
  return new Sub(item);
};

export const formatSub = (sub) => {
  if (Array.isArray(sub)) {
    return sub.map((item) => newSub(item));
  }
  return [];
};

export const hasSub = (sub, type) => {
  const subtitles = store.getState().commonReducer.subtitles;

  return subtitles.indexOf(sub);
};

export const copySubs = () => {
  const subtitles = store.getState().commonReducer.subtitles;
  return formatSub(subtitles);
};

export const fontMenu = [
  {
    label: "small",
    size: "small",
  },
  {
    label: "Normal",
    size: "large",
  },
  {
    label: "Large",
    size: "x-large",
  },
  {
    size: "xx-large",
    label: "Huge",
  },
];

export const getKeyCode = (event) => {
  const tag = document.activeElement.tagName.toUpperCase();
  const editable = document.activeElement.getAttribute("contenteditable");
  if (
    tag !== "INPUT" &&
    tag !== "TEXTAREA" &&
    editable !== "" &&
    editable !== "true"
  ) {
    return Number(event.keyCode);
  }
};

export const timeChange = (value, index, type, time) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];

  if (type === "startTime") {
    copySub[index].start_time = getUpdatedTime(
      value,
      time,
      copySub[index].start_time,
      index,
      type
    );
  } else {
    copySub[index].end_time = getUpdatedTime(
      value,
      time,
      copySub[index].end_time,
      index,
      type
    );
  }

  return copySub;
};

export const addSubtitleBox = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];

  const duration = DT.t2d(copySub[index].end_time);

  copySub.splice(
    index + 1,
    0,
    newSub({
      start_time: copySub[index].end_time,
      end_time:
        index < subtitles?.length - 1
          ? copySub[index + 1].start_time
          : DT.d2t(duration + 0.5),
      text: "",
      speaker_id: "",
      target_text: "",
    })
  );

  return copySub;
};

export const onMerge = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const existingsourceData = [...subtitles];

  existingsourceData.splice(
    index,
    2,
    newSub({
      id: existingsourceData[index].id,
      start_time: existingsourceData[index].start_time,
      end_time: existingsourceData[index + 1].end_time,
      text: `${existingsourceData[index].text} ${existingsourceData[index + 1].text
        }`,
      target_text: `${existingsourceData[index].target_text} ${existingsourceData[index + 1].target_text
        }`,
      acoustic_normalised_text: `${existingsourceData[index].acoustic_normalised_text} ${existingsourceData[index + 1].acoustic_normalised_text
        }`,
      speaker_id: "",
    })
  );

  return existingsourceData;
};

export const onSubtitleDelete = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const copySub = [...subtitles];
  copySub.splice(index, 1);

  return copySub;
};

  export const onSplit = (
    currentIndex,
    selectionStart,
    stage,
    updatedProjectData,
    timings = null,
    targetSelectionStart = null,
    
  ) => {
    const subtitles = store.getState().commonReducer.subtitles;
    console.log(subtitles)
    console.log("stage " + stage);
    const copySub = [...subtitles];
    const targetTextBlock = stage === 3 ? updatedProjectData[currentIndex] :  subtitles[currentIndex];
    const index = hasSub(subtitles[currentIndex], subtitles);
    console.log(targetTextBlock);
    const duration = DT.t2d(targetTextBlock.end_time) - DT.t2d(targetTextBlock.start_time);
    console.log(duration)
    const textToSplit = stage === 3 ? updatedProjectData[currentIndex].acoustic_standardized_text : targetTextBlock.text;
    console.log("data " + updatedProjectData);

    console.log(textToSplit)
    const text1 = textToSplit.slice(0, selectionStart).trim();
    const text2 = textToSplit.slice(selectionStart).trim();
    console.log("text1: " + text1)
    console.log("text2: " + text2)
    const targetText1 = targetSelectionStart
      ? targetTextBlock.target_text.slice(0, targetSelectionStart).trim()
      : null;
    const targetText2 = targetSelectionStart
      ? targetTextBlock.target_text.slice(targetSelectionStart).trim()
      : null;
console.log(targetText1 )
console.log(targetText2)
    if (
      !text1 ||
      !text2 ||
      (targetSelectionStart && (!targetText1 || !targetText2))
    )
      return copySub;

    let middleTime = null;
    if (!timings) {

      const splitDuration = (
        duration *
        (selectionStart / textToSplit.length)
      ).toFixed(3);
      if (splitDuration < 0.2 || duration - splitDuration < 0.2)
        return copySub;

      middleTime = DT.d2t(DT.t2d(targetTextBlock.start_time) + parseFloat(splitDuration));
      console.log(middleTime);
      console.log(targetTextBlock.start_time);
      console.log(targetTextBlock.end_time)
    }
    copySub.splice(currentIndex, 1);
    copySub.splice(
      index,
      0,
      newSub({
        start_time: middleTime
          ? targetTextBlock.start_time
          : timings[0].start,
        end_time: middleTime ?? timings[0].end,
        text: stage === 3 ? targetTextBlock.text : text1, 
        acoustic_standardized_text: stage === 3 ? text1 : targetTextBlock.acoustic_standardized_text, 
        ...(targetSelectionStart && { target_text: targetText1 }),
        speaker_id: "",
      })
    );

    console.log(copySub[0]);

    copySub.splice(
      index + 1,
      0,
      newSub({
        start_time: middleTime ?? timings[1].start ?? timings[0].end,
        end_time:
          middleTime || !timings[1].end
            ? targetTextBlock.end_time
            : timings[1].end,
        text: stage === 3 ? targetTextBlock.text : text2, 
        acoustic_standardized_text: stage === 3 ? text2 : targetTextBlock.acoustic_standardized_text, 
        ...(targetSelectionStart && { target_text: targetText2 }),
        speaker_id: "",
      })
    );

    console.log(copySub[1]);

    return copySub;
  };

export const onSubtitleChange = (text, index, updateAcoustic, populateAcoustic, stage, updatedProjectData) => {
  const subtitles = stage === 3? updatedProjectData : store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  console.log(copySub)
  const sub = copySub[index];
console.log(sub);
  if (updateAcoustic === 1)
    sub.acoustic_normalised_text = text;
  
  else if (populateAcoustic) {
    if (!sub.acoustic_normalised_text) sub.acoustic_normalised_text = sub.text;
  }

  else if(updateAcoustic === 2)
    sub.acoustic_standardized_text = text;

  else if(updateAcoustic === 0)
    sub.text = text;

  

  /* copySub.forEach((element, i) => {
    if (index === i) {
      element.text = text;
    }
  }); */

  return copySub;
};

export const fullscreenUtil = (element) => {
  let doc = window.document;
  let docEl = element;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;

  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
    return true;
  } else {
    cancelFullScreen.call(doc);
    return false;
  }
};

export const themeMenu = [
  { label: "Light", mode: "light" },
  { label: "Dark", mode: "dark" },
];

export const playbackSpeed = [
  {
    label: "0.25",
    speed: 0.25,
  },
  {
    label: "0.5",
    speed: 0.5,
  },
  {
    label: "0.75",
    speed: 0.75,
  },
  {
    label: "Normal",
    speed: 1,
  },
  {
    label: "1.25",
    speed: 1.25,
  },
  {
    label: "1.5",
    speed: 1.5,
  },
  {
    label: "1.75",
    speed: 1.75,
  },
  {
    label: "2",
    speed: 2,
  },
];

export const placementMenu = [
  { label: "Top", mode: "top" },
  { label: "Bottom", mode: "bottom" },
];

export const onUndoAction = (lastAction) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const { type, index, selectionStart, targetSelectionStart, timings, data } =
    lastAction;

  switch (type) {
    case "merge":
      return (
        onSplit(index, selectionStart, timings, targetSelectionStart) ||
        subtitles
      );

    case "split":
      return onMerge(index) || subtitles;

    case "delete":
      const copySub = copySubs();
      copySub.splice(index, 0, data);
      return copySub;

    case "add":
      return onSubtitleDelete(index + 1);

    default:
      return subtitles;
  }
};

export const onRedoAction = (lastAction) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const { type, index, selectionStart, targetSelectionStart, timings } =
    lastAction;

  switch (type) {
    case "merge":
      return onMerge(index) || subtitles;

    case "split":
      return (
        onSplit(index, selectionStart, timings, targetSelectionStart) ||
        subtitles
      );

    case "delete":
      return onSubtitleDelete(index);

    case "add":
      return addSubtitleBox(index);

    default:
      return subtitles;
  }
};

export const setAudioContent = (index, audio) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = copySubs(subtitles);

  copySub[index].audio = { audioContent: audio };

  return copySub;
};

export const base64toBlob = (base64) => {
  const byteCharacters = atob(base64);

  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: "audio/wav" });
  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
};

export const getSubtitleRange = () => {
  const subtitles = store.getState().commonReducer.subtitles;

  if (subtitles) {
    if (subtitles.length === 3) {
      return `${subtitles[0]?.id} - ${subtitles[2]?.id}`;
    } else if (subtitles.length === 2) {
      return `${subtitles[0]?.id} - ${subtitles[1]?.id}`;
    } else {
      return `${subtitles[0]?.id} - ${subtitles[0]?.id}`;
    }
  }
};

export const getSubtitleRangeTranscript = () => {
  const rangeStart = store.getState().commonReducer.rangeStart;
  const rangeEnd = store.getState().commonReducer.rangeEnd;

  if (rangeStart && rangeEnd) {
    return `${rangeStart} - ${rangeEnd}`;
  }
};

export const isPlaying = (player) => {
  return !!(
    player.currentTime > 0 &&
    !player.paused &&
    !player.ended &&
    player.readyState > 2
  );
};

export const getSelectionStart = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  console.log(subtitles)
  return subtitles[index].text.length;
};

export const getTargetSelectionStart = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  return subtitles[index].target_text.length;
};

export const getTimings = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;

  const timings = [
    {
      start: subtitles[index].start_time,
      end: subtitles[index].end_time,
    },
    {
      start: subtitles[index + 1]?.start_time,
      end: subtitles[index + 1]?.end_time,
    },
  ];

  return timings;
};

export const getItemForDelete = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const data = subtitles[index];

  return data;
};

export const assignSpeakerId = (id, index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  copySub[index].speaker_id = id;

  return copySub;
};

// export const getTagsList = (sourceLang) => {
//   switch (sourceLang) {
//     case "Hindi":
//       return noiseTags.hindi;
//     case "Malayalam":
//       return noiseTags.malayalam;
//     case "Bengali":
//       return noiseTags.bengali;
//     case "Sanskrit":
//       return noiseTags.sanskrit;
//     case "Marathi":
//       return noiseTags.marathi;
//     case "Kannada":
//       return noiseTags.kannada;
//     case "Telugu":
//       return noiseTags.telugu;
//     case "Sindhi":
//       return noiseTags.sindhi;
//     case "Bodo":
//       return noiseTags.bodo;
//     case "Assamese":
//       return noiseTags.assamese;
//     case "Tamil":
//       return noiseTags.tamil;
//     case "Santali":
//       return noiseTags.santali;
//     case "Odia":
//       return noiseTags.odia;
//     case "English":
//       return noiseTags.english;
//     default:
//       return [];
//   }
// };

export const reGenerateTranslation = (index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];
  copySub[index].retranslate = true;

  return copySub;
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
