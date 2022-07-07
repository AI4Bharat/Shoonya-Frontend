import { useState, useEffect, useRef } from "react";
import { Card, CircularProgress, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { styled } from '@mui/material/styles';
import { translate } from "../../../../config/localisation";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetDownload from "../../../../redux/actions/api/Dataset/GetDatasetDownload";
import UploaddataAPI from "../../../../redux/actions/api/Dataset/uploaddata"
import CustomButton from "../../component/common/Button";
import Modal from "../../component/common/Modal";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DragAndDrop from "../../component/common/DragAndDrop"


const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,

		 Width: 10,


	},
}));





export default function DatasetSettings({ datasetId }) {
	const dispatch = useDispatch();
	const fileRef = useRef();
	const [loading, setLoading] = useState(false);
	const downloadCount = useSelector((state) => state.getDatasetDownload.data);
	const [modal, setModal] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [file, setFile] = useState(null);
	const open = Boolean(anchorEl);
	const handleClicks = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

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
		const [file] = e.target.files;
		console.log(file);
	};
	const Uploaddata = () => {
		const projectObj = new UploaddataAPI();
		dispatch(APITransport(projectObj));
	}
  
	
	const handleUploadFile=()=>{
		Uploaddata();

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
								onClick={() => { setModal(true) }}
							/>
							<Modal
								open={modal}
								onClose={() => setModal(false)}
							> <Grid container spacing={2} >
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

									<Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ mt: 4 }} >
										<CustomButton label={"Select File"} type="file" onClick={() => fileRef.current.click()} />
										<input
											ref={fileRef}
											onChange={handleOnChange}
											multiple={false}
											type="file"
											hidden
										/>
										
									</Grid>
									<Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ mt: 4 }}>
										<CustomButton label={"Select File Format"} onClick={handleClicks}
											endIcon={<KeyboardArrowDownIcon />} />
									</Grid>
									<Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
										<DragAndDrop/>
									</Grid>
									<Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
									
										<CustomButton label={"Upload File"} onClick={handleUploadFile} />
									</Grid>
								</Grid></Modal>
							<StyledMenu
								id="demo-customized-menu"
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								sx={{width:200}}
							>
								<MenuItem onClick={handleClose} disableRipple>
								PDF
								</MenuItem>
								<MenuItem onClick={handleClose} disableRipple>
								TXT 
								</MenuItem>
								<MenuItem onClick={handleClose} disableRipple>
								 DOC
								</MenuItem>
							</StyledMenu>
						</>
					)}
				</Grid>
			</Card>
		</Grid>
	);
}
