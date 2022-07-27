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
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItems from "../../component/common/MenuItems";
import { FileUploader } from "react-drag-drop-files";


export default function DatasetSettings({ datasetId }) {
	const dispatch = useDispatch();
	const fileRef = useRef();
	const [loading, setLoading] = useState(false);
	const downloadCount = useSelector((state) => state.getDatasetDownload.data);
	const [modal, setModal] = useState(false);
	const [file, setFile] = useState([]);
	const [filetype, setFiletype] = useState("")
	const [type, setType] = useState([]);


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

	const handleUploadFile = () => {
		const UploadFile = new FormData();
        UploadFile.append('dataset',file);
		UploadFile.append('filetype',filetype);
         
		const projectObj = new UploaddataAPI(datasetId, UploadFile);
		dispatch(APITransport(projectObj));
		setModal(false);
		setFile([]);
		setFiletype('')
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
								onClose={() => setModal(false)}
								sx={{width:"200px"}}
							>
								
								 <Grid container spacing={2}  >
								
									<Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ position: "absolute", right: 20 }}>

										<IconButton
											size="small"
											aria-label="close"
											color="inherit"
											onClick={() => setModal(false)}
										>
											<CloseIcon fontSize="small" />
										</IconButton>

									</Grid>
									<Grid container spacing={2}sx={{
											alignItems: "center",
											// justifyContent: "space-between",
											mt: 2,
											
										}} >
									<Grid item xs={12} sm={12} md={12} lg={2} xl={2} sx={{mt:6}} >
										<CustomButton label={"Select File"} type="file"  onClick={() => fileRef.current.click()}  />
										<input
											ref={fileRef}
											onChange={handleOnChange}
											multiple={false}
											type="file"			
										    hidden
										/>
									</Grid>
									<Grid item xs={12} sm={12} md={1} lg={1} xl={1} sx={{mt:5}} >
									<h3 >or</h3></Grid>
									<Grid item xs={12} sm={12} md={12} lg={8} xl={8}  >
											<h2>Hello To Drag & Drop Files</h2>
											<FileUploader
												multiple={true}
												handleChange={handleChange}
												name="file"
												
											/>
											 {/* <p>{file ? "no files uploaded yet":`File name: ${file.name}` }</p> */}
										
									</Grid>
									</Grid>
									<Grid
										container
										direction='row'
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
											sx={{ml:2}}

										>
											<Typography variant="subtitle1" gutterBottom component="div"  >
												Select File Format:
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
									<Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{justifyContent: "flex-end"}} >

										<CustomButton  label={"Upload File"} onClick={handleUploadFile} />
										<CustomButton sx={{ml:1}} label={"Cancel"} onClick={() => setModal(false)} />
									</Grid>
								</Grid></Modal>

						</>
					)}
				</Grid>
			</Card>
		</Grid>
	);
}
