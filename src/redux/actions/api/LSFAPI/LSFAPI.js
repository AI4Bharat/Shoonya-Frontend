import axiosInstance from "../../../../utils/API_Instance/API_Instance";

const fetchProject = async (projectID) => {
  try {
    let response = await axiosInstance.get(`/projects/${projectID}`);
    return response.data;
  } catch (err) {
    return err;
    // message.error("Error fetching projects");
  }
};

const fetchTask = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}`);
    return response.data;
  } catch (err) {
    return err;
    // message.error("Error fetching tasks");
  }
};

const fetchPrediction = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/predictions/`);
    return response.data;
  } catch (err) {
    return err;
    // message.error("Error fetching predictions");
  }
};

const fetchAnnotation = async (taskID) => {
  try {
    let response = await axiosInstance.get(`/task/${taskID}/annotations/`);
    return response.data;
  } catch (err) {
    return err;
    // message.error("Error fetching annotations");
  }
};

const postAnnotation = async (result, task, completed_by, load_time, lead_time, task_status, notes) => {
  try {
    await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      task_status: task_status,
      annotation_notes: notes
    },
    )
    .then((res)=> {
    if(res.status !== 201){
      // message.error(res.data.message)
    }
  })
  } catch (err) {
    return err;
    // message.error("Error submitting annotations");
  }
};

const postReview = async (result, task, completed_by, parentAnnotation, load_time, lead_time, review_status, annotation_notes, review_notes) => {
  try {
    await axiosInstance.post(`/annotation/`, {
      result: result,
      task: task,
      completed_by: completed_by,
      parent_annotation: parentAnnotation,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      review_status: review_status,
      annotation_notes: annotation_notes,
      review_notes: review_notes,
      mode: "review"
    });
  } catch (err) {
    return err;
    // message.error("Error updating annotations");
  }
};

const patchAnnotation = async (result, annotationID, load_time, lead_time, task_status, notes) => {
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      result: result,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      task_status: task_status,
      annotation_notes: notes
    });
  } catch (err) {
    return err;
    // message.error("Error updating annotations");
  }
};

const patchReview = async (result, annotationID, parentAnnotation, load_time, lead_time, review_status, annotation_notes, review_notes) => {
  try {
    await axiosInstance.patch(`/annotation/${annotationID}/`, {
      result: result,
      lead_time: (new Date() - load_time) / 1000 + Number(lead_time ?? 0),
      parent_annotation: parentAnnotation,
      review_status: review_status,
      // annotation_notes: annotation_notes,
      review_notes: review_notes,
      mode: "review"
    });
  } catch (err) {
    return err;
    // message.error("Error updating annotations");
  }
}

const deleteAnnotation = async (annotationID) => {
  try {
    await axiosInstance.delete(`/annotation/${annotationID}/`);
  } catch (err) {
    return err;
    // message.error("Error deleting annotations");
  }
};

const updateTask = async (taskID) => {
  try {
    let response = await axiosInstance.patch(`/task/${taskID}/`, {
      task_status: "skipped",
    });
    return response.data;
  } catch (err) {
    return err;
    // message.error("Error skipping task.");
  }
};

const getNextProject = async (projectID, taskID, mode="annotation") => {
  try {
    let labellingMode = localStorage.getItem("labellingMode");
    let searchFilters = JSON.parse(localStorage.getItem("searchFilters"));
    let requestUrl = `/projects/${projectID}/next/?current_task_id=${taskID}${labellingMode ? `&task_status=${labellingMode}` : ""}${mode === "review" ? `&mode=review` : ""}`;
    if (localStorage.getItem("labelAll")) {
      Object.keys(searchFilters)?.forEach(key => {
        requestUrl += `&${key}=${this.searchFilters[key]}`;
      });
    }
    let response = await axiosInstance.post(requestUrl, {
      id: projectID,
    });
    if (response.status === 204) {
      // message.info("No more tasks for this project.");
    }
    else {
      return response.data;
    }
  }
  catch (err) {
    // message.error("Error getting next task.");
    return err
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
  updateTask,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation,
  postReview,
  patchReview,
};