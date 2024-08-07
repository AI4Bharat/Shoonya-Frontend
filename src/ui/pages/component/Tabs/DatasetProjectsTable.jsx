import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import CustomButton from "../common/Button";
import GetPullNewDataAPI from "../../../../redux/actions/api/ProjectDetails/PullNewData";
import CustomizedSnackbars from "../../component/common/Snackbar"
import Spinner from "../../component/common/Spinner";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetProjects from "../../../../redux/actions/api/Dataset/GetDatasetProjects";
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import MUIDataTable from "mui-datatables";
import Search from "../../component/common/Search";


import { Grid, Stack, ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import { width } from "@mui/system";
import userRole from "../../../../utils/UserMappedByRole/Roles";

const columns = [
	{
		name: "id",
		label: "Id",
		options: {
			filter: false,
			sort: false,
			align: "center",
			setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
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
	const datasetProjects = useSelector((state) =>
		state.getDatasetProjects.data);

	const [snackbar, setSnackbarInfo] = useState({
		open: false,
		message: "",
		variant: "success",
	});
	const [loading, setLoading] = useState(false);
	const loggedInUserData = useSelector(
		(state) => state?.fetchLoggedInUserData?.data
	  );
	
	useEffect(() => {
		dispatch(APITransport(new GetDatasetProjects(datasetId)));
	}, [dispatch, datasetId]);

	const getExportProjectButton = async (project) => {
		setLoading(true);
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
	const SearchWorkspaceMembers = useSelector(
		(state) => state.SearchProjectCards.data
	  );
  const pageSearch = () => {
    return datasetProjects.filter((el) => {
      if (SearchWorkspaceMembers == "") {
        return el;
      } else if (
        el.title
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
		
        return el;
	  }
    //   } else if (
    //     el.email?.toLowerCase().includes(SearchWorkspaceMembers?.toLowerCase())
    //   ) {
    //     return el;
    //   }
    });
  };



	const getPullNewDataAPI = async (project) => {
		const projectObj = new GetPullNewDataAPI(project.id);
		//dispatch(APITransport(projectObj));
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
			});
		} else {
			setSnackbarInfo({
				open: true,
				message: resp?.message,
				variant: "error",
			});
		}
	};
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

	const data = datasetProjects? pageSearch().map((project) => ({
			...project,
			actions: () => (
				<Stack direction="row" spacing={2}>
					<Link
						to={`/projects/${project.id}`}
						style={{ textDecoration: "none" }}
					>
						<CustomButton sx={{ borderRadius: 2 }} label="View" />
					</Link>
					{userRole.Admin === loggedInUserData?.role ?<CustomButton sx={{ borderRadius: 2, height: 37 }} onClick={() => getExportProjectButton(project)} label="Export" />:null}					<CustomButton sx={{ borderRadius: 2 }} onClick={() => getPullNewDataAPI(project)} label="Pull New Data Items" />
				</Stack>
			),
		})):[]
    // )

	return (
		<>
			<ThemeProvider theme={tableTheme}>
				{loading && <Spinner />}
				<Grid>
					{renderSnackBar()}
				</Grid>
				<Grid sx={{ mb: 1 }}>
					<Search />
				</Grid>
				<MUIDataTable
					columns={columns}
					options={options}
					data={data}
				/>
			</ThemeProvider>
		</>
	);
}
