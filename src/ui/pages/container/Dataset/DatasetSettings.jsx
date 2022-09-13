import { useState, useEffect, useRef } from "react";
import { Card, CircularProgress, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { translate } from "../../../../config/localisation";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetDownload from "../../../../redux/actions/api/Dataset/GetDatasetDownload";
import UploaddataAPI from "../../../../redux/actions/api/Dataset/uploaddata"
import GetFileTypesAPI from "../../../../redux/actions/api/Dataset/GetFileTypes"
import CustomButton from "../../component/common/Button";
import Modal from "../../component/common/Modal";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MenuItems from "../../component/common/MenuItems";
import { FileUploader } from "react-drag-drop-files";
import Switch from '@mui/material/Switch';



const label = { inputProps: { 'aria-label': 'Switch demo' } };

export default function DatasetSettings({ datasetId }) {
	const dispatch = useDispatch();
	const fileRef = useRef();
	const [loading, setLoading] = useState(false);
	const downloadCount = useSelector((state) => state.getDatasetDownload.data);
	const [modal, setModal] = useState(false);
	const [file, setFile] = useState([]);
	const [filetype, setFiletype] = useState("")
	const [type, setType] = useState([]);
	const [switchs, setswitchs] = useState("True");


	const GetFileTypes = useSelector((state) => state.GetFileTypes.data);
	const FileTypes = () => {
		const projectObj = new GetFileTypesAPI();
		dispatch(APITransport(projectObj));
	}

	useEffect(() => {
		if (GetFileTypes && GetFileTypes.length > 0) {
			let temp = [];
			GetFileTypes.forEach((element) => {
				temp.push({

					name: element,
					value: element,

				});
			});
			setType(temp);
		}
	}, [GetFileTypes]);

	const handleClick = () => {
		console.log('called download');
		setLoading(true);
		dispatch(APITransport(new GetDatasetDownload(datasetId)));
	};

	useEffect(() => {
		console.log("download count", downloadCount);
		setLoading(false);
	}, [setLoading, downloadCount]);



	const handleOnChange = e => {
		// const [file] = e.target.files;
		setFile(e.target.files[0]);
		console.log("select file ", e.target.files[0]);


	}
	const handleChange = (file) => {
		setFile(file[0]);
		console.log("drag and drop file ", file);
	};

	const handleUpload = (e) => {
		setModal(true)
		FileTypes();
	}

	const handleModalClose = () => {
		setModal(false);
		setFile([]);
		setFiletype('');
	}

	const handleUploadFile = () => {
		const UploadFile = new FormData();
		UploadFile.append('dataset', file);
		UploadFile.append('filetype', filetype);
		UploadFile.append("deduplicate",switchs);
		
		const projectObj = new UploaddataAPI(datasetId, UploadFile);
		dispatch(APITransport(projectObj));
		handleModalClose();
	}

	const handleswitchchange =() => {
		setswitchs("false")

	}

	return (
		<Grid
			container
			direction="row"
			justifyContent="center"
			alignItems="center"
		>
			<Card
				sx={{
					width: "100%",
					padding: 4,
				}}
			>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					{loading ? (
						<CircularProgress />
					) : (
						<>
							<CustomButton
								label={translate("button.downloadDataset")}
								onClick={handleClick}
							/>

							<CustomButton
								sx={{ ml: 8 }}
								label={translate("button.uploadData")}
								onClick={handleUpload}
							/>
							<Modal
								open={modal}
								onClose={() => handleModalClose()}
								// sx={{ width: "200px" }}
							>
								<Grid
									width={window.innerWidth*0.35}
								>
<Grid
									container
									// direction="row"
									justifyContent="center"
									alignItems="center"
									sx={{ backgroundColor: "#f5f5f5", padding: "1rem", marginBottom: 2 }}
								>
									<Typography variant="h5">Upload Data</Typography>
								</Grid>
								<Grid container spacing={2} sx={{ padding: 3}} >
									<Grid
										container
										direction='row'
										alignItems= "center"
										justifyContent={"space-between"}
										sx={{
											alignItems: "center",
											mt: 3,
										}}
									>
										<Grid
											item
											xs={3}
											sm={3}
											md={3}
											lg={3}
											xl={3}
										>
											<Typography variant="subtitle1" gutterBottom component="div"  >
												Select File :
											</Typography>
										</Grid>
										<Grid item xs={6} md={6} lg={6} xl={6} sm={6}>
											<FileUploader
												multiple={true}
												handleChange={handleChange}
												name="file"

											/>
										</Grid>
									</Grid>
									<Grid
										container
										direction='row'
										alignItems= "center"
										justifyContent={"space-between"}
										sx={{
											alignItems: "center",
											mt: 3,

										}}
									>
										<Grid
											item
											xs={4}
											sm={4}
											md={4}
											lg={4}
											xl={4}
										>
											<Typography variant="subtitle1" gutterBottom component="div"  >
												Select File Format :
											</Typography>
										</Grid>
										<Grid item xs={6} md={6} lg={6} xl={6} sm={6}>
											<MenuItems
												menuOptions={type}
												handleChange={(value) => setFiletype(value)}
												value={filetype}
											/>
										</Grid>
									</Grid>
									<Grid
										container
										direction='row'
										alignItems= "center"
										justifyContent={"space-between"}
										sx={{
											alignItems: "center",
											mt: 3,

										}}
									>
										<Grid
											item
											xs={4}
											sm={4}
											md={4}
											lg={4}
											xl={4}
										>
											<Typography variant="subtitle1" gutterBottom component="div"  >
											Delete Duplicate Records :
											</Typography>
										</Grid>
										<Grid item xs={6} md={6} lg={6} xl={6} sm={6}>
										<Switch {...label} defaultChecked value={switchs} onChange={handleswitchchange}/>
										</Grid>
									</Grid>
									
									<Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ justifyContent: "flex-end", mt: 2 }} >

										<CustomButton label={"Upload"} disabled={file.length == 0 ? true : false} onClick={handleUploadFile} />
										<CustomButton sx={{ ml: 1 }} label={"Close"} onClick={() => handleModalClose()} />
									</Grid>
								</Grid>
								
								</Grid>
								
							</Modal>

						</>
					)}
				</Grid>
			</Card>
		</Grid>
	);
}
