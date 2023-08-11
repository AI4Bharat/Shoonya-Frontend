import clamp from "lodash/clamp";
import DT from "duration-time-conversion";

export default class Sub {
  constructor(obj) {
    this.start_time = obj.start_time;
    this.end_time = obj.end_time;
    this.text = obj.text;
    this.target_text = obj.target_text;
    this.audio = obj.audio;
    this.text_changed = obj.text_changed ?? false;
    this.time_difference = obj.time_difference;
    this.id = obj.id;
    this.audio_speed = obj.audio_speed;
    this.speaker_id = obj.speaker_id;
  }

  get check() {
    return (
      this.startTime >= 0 && this.endTime >= 0 && this.startTime < this.endTime
    );
  }

  get clone() {
    return new Sub(this);
  }

  get startTime() {
    return DT.t2d(this.start_time);
  }

  set startTime(time) {
    this.start_time = DT.d2t(clamp(time, 0, Infinity));
  }

  get endTime() {
    return DT.t2d(this.end_time);
  }

  set endTime(time) {
    this.end_time = DT.d2t(clamp(time, 0, Infinity));
  }

  get duration() {
    return parseFloat((this.endTime - this.startTime).toFixed(3));
  }
}
