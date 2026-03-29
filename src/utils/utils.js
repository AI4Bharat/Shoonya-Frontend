import store from "../redux/store/store";
import DT from "duration-time-conversion";

export function authenticateUser() {
  const access_token = localStorage.getItem("shoonya_access_token");
  if (access_token) {
    return true;
  } else {
    return false;
  }
}

export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export function snakeToTitleCase(str) {
    return str.split("_").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
}

export function isValidUrl(_string) {
  const matchpattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return matchpattern.test(_string);
}

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

export const isPlaying = (player) => {
  return !!(
    player.currentTime > 0 &&
    !player.paused &&
    !player.ended &&
    player.readyState > 2
  );
};



export const onSubtitleChange = (text, index) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const copySub = [...subtitles];

  copySub.forEach((element, i) => {
    if (index === i) {
      element.text = text;
    }
  });

  return copySub;
};

export const getUpdatedTime = (value, type, time, index, startEnd,page) => {
  const subtitles = store.getState().commonReducer.subtitles;
  const Duration = store.getState().getTaskDetails?.data?.data?.audio_duration;
  const hours = Math.floor(Duration / 3600);
  const minutes = Math.floor((Duration % 3600) / 60);
  const seconds = Math.floor(Duration % 60);
  const milliseconds = parseFloat(Duration.toString().split(".")[1]);
  const convertedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  let newValue = "";

  const [hh, mm, sec] = time.split(":");
  const [ss, SSS] = sec.split(".");

  if (type === "hours") {
    newValue = Math.max(0, +value).toString().padStart(2, "0");
  }
  else if (type === "minutes" || type === "seconds") {
    newValue = Math.max(0, Math.min(+value, 59)).toString().padStart(2, "0");
  }
  else if (type === "miliseconds") {
    newValue = Math.max(0, Math.min(+value, 999)).toString().padStart(3, "0");
  }
  else return convertedTime;

  let newTime = "";

  if (type === "hours") {
    newTime = `${newValue}:${mm}:${ss}.${SSS}`;
  } else if (type === "minutes") {
    newTime = `${hh}:${newValue}:${ss}.${SSS}`;
  } else if (type === "seconds") {
    newTime = `${hh}:${mm}:${newValue}.${SSS}`;
  } else if (type === "miliseconds") {
    newTime = `${hh}:${mm}:${ss}.${newValue}`;
  }

  if (startEnd == "startTime") {
    const durationOfVideo = DT.t2d(convertedTime);
    const durationOfCurrent = DT.t2d(newTime);
    if (durationOfCurrent > durationOfVideo) {
      return subtitles[index].start_time;
    }
  }

  if (startEnd === "startTime" && index > 0) {
    const durationOfPrevious = DT.t2d(subtitles[index - 1].end_time);
    const durationOfCurrent = DT.t2d(newTime);
    const durationOfEndTime = DT.t2d(subtitles[index].end_time);

    if (durationOfPrevious > durationOfCurrent) {
      newTime = subtitles[index].start_time;
    }

    if (durationOfCurrent >= durationOfEndTime) {
      newTime = subtitles[index].end_time;
    }
  }

  if (startEnd === "endTime" && index < subtitles.length - 1) {
    const durationOfNext = DT.t2d(subtitles[index + 1].start_time);
    const durationOfCurrent = DT.t2d(newTime);
    const durationOfStartTime = DT.t2d(subtitles[index].start_time);

    if (durationOfNext < durationOfCurrent) {
      newTime = subtitles[index + 1].start_time;
    }

    if (durationOfCurrent <= durationOfStartTime) {
      let modifiedDuration = DT.t2d(subtitles[index].start_time);
      modifiedDuration = modifiedDuration + 1;
      newTime = DT.d2t(modifiedDuration);
    }
  }

  if (startEnd === "endTime" && index === subtitles.length - 1) {
    const durationOfVideo = DT.t2d(convertedTime);
    const durationOfCurrent = DT.t2d(newTime);
    const durationOfStartTime = DT.t2d(subtitles[index].start_time);
    if (durationOfCurrent > durationOfVideo) {
      newTime = convertedTime;
    }

    if (durationOfCurrent <= durationOfStartTime) {
      let modifiedDuration = DT.t2d(subtitles[index].start_time);
      modifiedDuration = modifiedDuration + 1;
      newTime = DT.d2t(modifiedDuration);
      
    }
  }

  return newTime;
};