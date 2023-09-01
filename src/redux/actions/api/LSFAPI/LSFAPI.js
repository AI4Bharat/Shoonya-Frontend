import axiosInstance from "../../../../utils/API_Instance/API_Instance";

const fetchProject = async (projectID) => {
  try {
    let response = await axiosInstance.get(`/projects/${projectID}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

const fetchTask = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

const fetchPrediction = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/predictions/`);
    return response.data;
  } catch (err) {
    return err;
  }
};

const fetchAnnotation = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/annotations/`);
    return response.data;
  } catch (err) {
    return err;
  }
};

const postAnnotation = async (
  result,
  task,
  completed_by,
  load_time,
  lead_time,
  annotation_status,
  notes
) => {
  try { 
    
    await axiosInstance
      .post(`/annotation/`, {
        result: result,
        task: task,
        completed_by: completed_by,
        lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
        annotation_status: annotation_status,
        annotation_notes: notes,
      })
      .then((res) => {
        if (res.status !== 201) {
          // message.error("Error creating annotation.");
        }
      });
  } catch (err) {
    return err;
  }
};

const postReview = async (
  result,
  task,
  completed_by,
  parentAnnotation,
  load_time,
  lead_time,
  review_status,
  annotation_notes,
  review_notes
) => {
  try {
    await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by,
      parent_annotation: parentAnnotation,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      annotation_status: review_status,
      annotation_notes: annotation_notes,
      review_notes:review_notes,
      mode: "review",
    });
  } catch (err) {
    return err;
  }
};




const patchAnnotation = async (
  result,
  annotationID,
  load_time,
  lead_time,
  annotation_status,
  notes,
  autoSave=false
) => {
  try {
    const res = await axiosInstance.patch(`/annotation/${annotationID}/`, {
      ...(annotation_status !== "skipped" && { result: result }),
      ...(annotation_status && {
        lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
        annotation_status: annotation_status,
      }),
      annotation_notes: notes,
      ...(autoSave && { auto_save: true }),
    });
    return res;
  } catch (err) {
    return err;
  }
};

const patchReview = async (
  annotationID,
  load_time,
  lead_time,
  review_status,
  result,
  parentAnnotation,
  reviewnotes,
  autoSave=false
) => {
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      annotation_status: review_status,
      result: result,
      review_notes: reviewnotes,
      ...((review_status === "to_be_revised" ||
        review_status === "accepted" ||
        review_status === "accepted_with_minor_changes" ||
        review_status === "accepted_with_major_changes") && {
        lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
        annotation_status: review_status,
        result: result,
        parent_annotation: parentAnnotation,
        review_notes: reviewnotes,
      }),
      ...(autoSave && { auto_save: true }),
    });
    // if (review_status === "to_be_revised") {
    //   await axiosInstance.patch(`/annotation/${parentAnnotation}/`, {
    //     annotation_status: review_status,
    //   });
    // }
  } catch (err) {
    return err;
  }
};


const patchSuperChecker = async (
  annotationID,
  load_time,
  lead_time,
  review_status,
  result,
  parentAnnotation,
  superchecknotes,
  autoSave=false
) => {
  console.log(superchecknotes,"superchecknotes")
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      annotation_status: review_status,
      result: result,
      parent_annotation: parentAnnotation,
      supercheck_notes: superchecknotes,
      ...(autoSave && { auto_save: true }),
    });
   
  } catch (err) {
    return err;
  }
};




const deleteAnnotation = async (annotationID) => {
  try {
    await axiosInstance.delete(`/annotation/${annotationID}/`);
  } catch (err) {
    return err;
  }
};

const getNextProject = async (projectID, taskID, mode = "annotation") => {
  try {
    let labellingMode = localStorage.getItem("labellingMode");
    let searchFilters = JSON.parse(localStorage.getItem("searchFilters"));
    let requestUrl = `/projects/${projectID}/next/`;
    //  if (localStorage.getItem("labelAll")) {
    //   //requestUrl += labellingMode ? `?task_status=${labellingMode}` : ""
    //   Object?.keys(searchFilters)?.forEach(key => {
    //     requestUrl += `&${key}=${this.searchFilters[key]}`;
    //   });
    // }
    for (let key in searchFilters) {
      if (searchFilters[key] && localStorage.getItem("labelAll")) {
        requestUrl += `?${key}=${searchFilters[key]}`;
      }
    }
    let response = await axiosInstance.post(requestUrl, {
      id: projectID,
      current_task_id: taskID,
      ...(mode === "annotation" && {
        mode: "annotation",
        annotation_status: labellingMode,
      }),
      ...(mode === "review" && {
        mode: "review",
        annotation_status: labellingMode,
      }),
      ...(mode === "supercheck" && {
        mode: "supercheck",
        annotation_status: labellingMode,
      }),
    });
    if (response.status === 204) {
      // message.error("Error getting next task.");
    } else {
      return response.data;
    }
  } catch (err) {
    return err;
  }
};

const getProjectsandTasks = async (projectID, taskID) => {
  return Promise.all([
    fetchProject(projectID),
    fetchTask(taskID),
    fetchAnnotation(taskID),
    fetchPrediction(taskID),
  ]);
};
export {
  getProjectsandTasks,
  postAnnotation,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation,
  postReview,
  patchReview,
  patchSuperChecker,
};
