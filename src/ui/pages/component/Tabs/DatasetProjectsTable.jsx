import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomButton from "../common/Button";
import CustomizedSnackbars from "../../component/common/Snackbar"
import Spinner from "../../component/common/Spinner";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetProjects from "../../../../redux/actions/api/Dataset/GetDatasetProjects";
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import MUIDataTable from "mui-datatables";

import { Grid, Stack, ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

const columns = [
	{
		name: "id",
		label: "Id",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "title",
		label: "Title",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_status",
		label: "Last Project Export Status",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_date",
		label: "Last Project Export Date",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "last_project_export_time",
		label: "Last Project Export Time",
		options: {
			filter: false,
			sort: false,
			align: "center",
		},
	},
	{
		name: "actions",
		label: "Actions",
		options: {
			sort: false,
			filter: false,
			align: "center",
		},
	},
];

const options = {
	filterType: "checkbox",
	selectableRows: "none",
	download: false,
	filter: false,
	print: false,
	search: false,
	viewColumns: false,
	jumpToPage: true,
};

export default function DatasetProjectsTable({ datasetId }) {
	const dispatch = useDispatch();
	const [snackbar, setSnackbarInfo] = useState({
		open: false,
		message: "",
		variant: "success",
	});	
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		dispatch(APITransport(new GetDatasetProjects(datasetId)));
	}, [dispatch, datasetId]);

	const getExportProjectButton = async (project) => {
		setLoading(true);
		console.log(project, "PROJECT");
		const projectObj = project.project_type === "ConversationTranslation" ?
			new GetExportProjectButtonAPI(project.id, project.dataset_id[0]) : new GetExportProjectButtonAPI(project.id);
		dispatch(APITransport(projectObj));
		const res = await fetch(projectObj.apiEndPoint(), {
				method: "POST",
				body: JSON.stringify(projectObj.getBody()),
				headers: projectObj.getHeaders().headers,
		});
		const resp = await res.json();
		setLoading(false);
		if (res.ok) {
				setSnackbarInfo({
						open: true,
						message: resp?.message,
						variant: "success",
				})

		} else {
				setSnackbarInfo({
						open: true,
						message: resp?.message,
						variant: "error",
				})
		}
	}

	const renderSnackBar = () => {
		return (
				<CustomizedSnackbars
						open={snackbar.open}
						handleClose={() =>
								setSnackbarInfo({ open: false, message: "", variant: "" })
						}
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						variant={snackbar.variant}
						message={snackbar.message}
				/>
		);
	};

	const datasetProjects = useSelector((state) =>
		state.getDatasetProjects.data.map((project) => ({
			...project,
			actions: () => (
				<Stack direction="row" spacing={2}>
					<Link
						to={`/projects/${project.id}`}
						style={{ textDecoration: "none" }}
					>
						<CustomButton sx={{ borderRadius: 2 }} label="View" />
					</Link>
					<CustomButton sx={{ borderRadius: 2 }} onClick={() => getExportProjectButton(project)} label="Export" />
				</Stack>
			),
		}))
	);

	return (
		<>
			<ThemeProvider theme={tableTheme}>
				{loading && <Spinner />}
				<Grid>
						{renderSnackBar()}
				</Grid>
				<MUIDataTable
					columns={columns}
					options={options}
					data={datasetProjects}
				/>
			</ThemeProvider>
		</>
	);
}
