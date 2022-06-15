// AnnotateTask

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Tooltip } from "@mui/material";
import CustomButton from "../../component/common/Button";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetTaskPredictionAPI from "../../../../redux/actions/api/Tasks/GetTaskPrediction";

const LabelStudioWrapper = ({ }) => {
    // we need a reference to a DOM node here so LSF knows where to render
    const rootRef = useRef();
    // this reference will be populated when LSF initialized and can be used somewhere else
    const lsfRef = useRef();

    const [labelConfig, setLabelConfig] = useState();
    const [taskData, setTaskData] = useState(undefined);
    const { projectId, taskId } = useParams();
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);

    // function LSFRoot(
    //     rootRef,
    //     lsfRef,
    //     userContext,
    //     projectId,
    //     taskData,
    //     labelConfig,
    //     annotations,
    //     predictions,
    //     notesRef
    //   ) {
    //     let load_time;
    //     let interfaces = [];
    //     if (predictions == null) predictions = [];
    
    //     if (taskData.task_status == "freezed") {
    //       interfaces = [
    //         "panel",
    //         // "update",
    //         // "submit",
    //         "skip",
    //         "controls",
    //         "infobar",
    //         "topbar",
    //         "instruction",
    //         // "side-column",
    //         "annotations:history",
    //         "annotations:tabs",
    //         "annotations:menu",
    //         "annotations:current",
    //         // "annotations:add-new",
    //         "annotations:delete",
    //         // "annotations:view-all",
    //         "predictions:tabs",
    //         "predictions:menu",
    //         // "auto-annotation",
    //         "edit-history",
    //       ];
    //     } else {
    //       interfaces = [
    //         "panel",
    //         "update",
    //         "submit",
    //         "skip",
    //         "controls",
    //         "infobar",
    //         "topbar",
    //         "instruction",
    //         // "side-column",
    //         "annotations:history",
    //         "annotations:tabs",
    //         "annotations:menu",
    //         "annotations:current",
    //         // "annotations:add-new",
    //         "annotations:delete",
    //         // "annotations:view-all",
    //         "predictions:tabs",
    //         "predictions:menu",
    //         // "auto-annotation",
    //         "edit-history",
    //       ];
    //     }
    
    //     if (rootRef.current) {
    //       lsfRef.current = new LabelStudio(rootRef.current, {
    //         /* all the options according to the docs */
    //         config: labelConfig,
    
    //         interfaces: interfaces,
    
    //         user: {
    //           pk: userContext.user.id,
    //           firstName: userContext.user.first_name,
    //           lastName: userContext.user.last_name,
    //         },
    
    //         task: {
    //           annotations: annotations,
    //           predictions: predictions,
    //           id: taskData.id,
    //           data: taskData.data,
    //         },
    
    //         onLabelStudioLoad: function (ls) {
    //           var c = ls.annotationStore.addAnnotation({
    //             userGenerate: true,
    //           });
    //           ls.annotationStore.selectAnnotation(c.id);
    //           load_time = new Date();
    //         },
    //         onSubmitAnnotation: function (ls, annotation) {
    //           showLoader();
    //           if (taskData.task_status != "freezed") {
    //             postAnnotation(
    //               annotation.serializeAnnotation(),
    //               taskData.id,
    //               userContext.user.id,
    //               load_time,
    //               annotation.lead_time,
    //               task_status,
    //               notesRef.current
    //             )
    //           }
    //           else message.error("Task is freezed");
    
    //           if (localStorage.getItem("labelAll"))
    //             getNextProject(projectId, taskData.id).then((res) => {
    //               hideLoader();
    //               window.location.href = `/projects/${projectId}/task/${res.id}`;
    //             })
    //           else {
    //             hideLoader();
    //             window.location.reload();
    //           }
    //         },
    
    //         onSkipTask: function () {
    //           message.warning('Notes will not be saved for skipped tasks!');
    //           showLoader();
    //           updateTask(taskData.id).then(() => {
    //             getNextProject(projectId, taskData.id).then((res) => {
    //               hideLoader();
    //               window.location.href = `/projects/${projectId}/task/${res.id}`;
    //             });
    //           })
    //         },
    
    //         onUpdateAnnotation: function (ls, annotation) {
    //           if (taskData.task_status != "freezed") {
    //             showLoader();
    //             for (let i = 0; i < annotations.length; i++) {
    //               if (annotation.serializeAnnotation().id == annotations[i].result.id) {
    //                 let temp = annotation.serializeAnnotation()
    
    //                 for (let i = 0; i < temp.length; i++) {
    //                   if (temp[i].value.text) {
    //                     temp[i].value.text = [temp[i].value.text[0]]
    //                   }
    //                 }
    //                 patchAnnotation(
    //                   temp,
    //                   annotations[i].id,
    //                   load_time,
    //                   annotations[i].lead_time,
    //                   task_status,
    //                   notesRef.current
    //                   ).then(() => {
    //                     if (localStorage.getItem("labelAll"))
    //                       getNextProject(projectId, taskData.id).then((res) => {
    //                         hideLoader();
    //                         window.location.href = `/projects/${projectId}/task/${res.id}`;
    //                       })
    //                     else{
    //                       hideLoader();
    //                       window.location.reload();
    //                     }
    //                   });
    //               }
    //             }
    //           } else message.error("Task is freezed");
    //         },
    
    //         onDeleteAnnotation: function (ls, annotation) {
    //           for (let i = 0; i < annotations.length; i++) {
    //             if (annotation.serializeAnnotation().id == annotations[i].result.id)
    //               deleteAnnotation(
    //                 annotations[i].id
    //               );
    //           }
    //         }
    //       });
    //     }
    //   }

    useEffect(() => {
        console.log("ProjectDetails", ProjectDetails);
    }, [])

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* <div>
            <Tooltip title="Save task for later">
              <Button
                value="Draft"
                type="default"
                onClick={onDraftAnnotation}
                style={{minWidth: "160px", borderColor:"#e5e5e5", color: "#e80", fontWeight: "500"}}
              >
                Draft
              </Button>
            </Tooltip>
            {localStorage.getItem("labelAll") != "true" ? (
              <Tooltip title="Go to next task">
                <Button
                  value="Next"
                  type="default"
                  onClick={onNextAnnotation}
                  style={{minWidth: "160px", borderColor:"#e5e5e5", color: "#09f", fontWeight: "500"}}
                >
                  Next
                </Button>
              </Tooltip>
            ) : (
              <div style={{minWidth: "160px"}}/>
            )}
          </div> */}
            </div>
            <div className="label-studio-root" ref={rootRef}></div>
        </div>
    )
}

const AnnotateTask = () => {
    const [collapseHeight, setCollapseHeight] = useState('0');
    const notesRef = useRef('');
    const {taskId} = useParams()
    const [notesValue, setNotesValue] = useState('');
    const dispatch = useDispatch();

    const handleCollapseClick = () => {
        if(collapseHeight === '0') {
          setCollapseHeight('auto')
        } else {
          setCollapseHeight('0');
        }
      }

      const getTaskPrediction = () => {
        const taskPredictionObj = new GetTaskPredictionAPI(taskId);
        dispatch(APITransport(taskPredictionObj));
      }

      useEffect(()=>{
        getTaskPrediction();   
      },[])
    
    //   useEffect(()=>{
    //     fetchAnnotation(task_id).then((data)=>{
    //       if(data && Array.isArray(data) && data.length > 0) {
    //         setNotesValue(data[0].notes);
    //       }
    //     })
    //   }, [setNotesValue, task_id]);
    
    //   useEffect(()=>{
    //     notesRef.current = notesValue;
    //   }, [notesValue])
  
      
    return (
        <div style={{ maxHeight: "100%", maxWidth: "90%" }}>
            <div style={{ maxWidth: "100%", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    <CustomButton
                        label="Back to Project"
                        onClick={() => {
                            // localStorage.removeItem("labelAll");
                            var id = window.location.href.split("/")[4];
                            window.location.href = `/projects/${id}`;
                        }}
                    />
                    <Button sx={{ ml: 2 }} 
                        onClick={handleCollapseClick}
                    >
                        Notes
                    </Button>
                </div>
            </div>
            {/* <div className={styles.collapse} style={{ height: collapseHeight }}>
                <Alert message="Please do not add notes if you are going to skip the task!" type="warning" showIcon style={{ marginBottom: '1%' }} />
                <Input.TextArea placeholder="Place your remarks here ..." value={notesValue} onChange={event => setNotesValue(event.target.value)} />
            </div> */}
            <LabelStudioWrapper 
            // notesRef={notesRef} 
            />
        </div>
    )
}

export default AnnotateTask;