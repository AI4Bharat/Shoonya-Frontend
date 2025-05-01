import { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "../common/Button";
import GetPullNewDataAPI from "../../../../redux/actions/api/ProjectDetails/PullNewData";
import CustomizedSnackbars from "../../component/common/Snackbar"
import Spinner from "../../component/common/Spinner";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetProjects from "../../../../redux/actions/api/Dataset/GetDatasetProjects";
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import MUIDataTable from "mui-datatables";
import Search from "../../component/common/Search";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
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

const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
	return (
	  <Box
		sx={{
		  display: "flex",
		  flexWrap: "wrap", 
		  justifyContent: { 
			xs: "space-between", 
			md: "flex-end" 
		  }, 
		  alignItems: "center",
		  padding: "10px",
		  gap: { 
			xs: "10px", 
			md: "20px" 
		  }, 
		}}
	  >

		{/* Pagination Controls */}
		<TablePagination
		  component="div"
		  count={count}
		  page={page}
		  rowsPerPage={rowsPerPage}
		  onPageChange={(_, newPage) => changePage(newPage)}
		  onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
		  sx={{
			"& .MuiTablePagination-actions": {
			marginLeft: "0px",
		  },
		  "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
			marginRight: "10px",
		  },
		  }}
		/>

		{/* Jump to Page */}
		<div>
		  <label style={{ 
			marginRight: "5px", 
			fontSize:"0.83rem", 
		  }}>
		  Jump to Page:
		  </label>
		  <Select
			value={page + 1}
			onChange={(e) => changePage(Number(e.target.value) - 1)}
			sx={{
			  fontSize: "0.8rem",
			  padding: "4px",
			  height: "32px",
			}}
		  >
			{Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
			  <MenuItem key={i} value={i + 1}>
				{i + 1}
			  </MenuItem>
			))}
		  </Select>
		</div>
	  </Box>
	);
  };

const options = {
	filterType: "checkbox",
	selectableRows: "none",
	download: false,
	filter: false,
	print: false,
	search: false,
	viewColumns: false,
	jumpToPage: true,
	responsive: "vertical",
	enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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
	  const [isBrowser, setIsBrowser] = useState(false);
	  const tableRef = useRef(null);
	  const [displayWidth, setDisplayWidth] = useState(0);

	  useEffect(() => {
		const handleResize = () => {
		  setDisplayWidth(window.innerWidth);
		};

		if (typeof window !== 'undefined') {
		  handleResize();
		  window.addEventListener('resize', handleResize);
		}

		return () => {
		  if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		  }
		};
	  }, []);

	  useEffect(() => {
		setIsBrowser(true);

		// Force responsive mode after component mount
		const applyResponsiveMode = () => {
		  if (tableRef.current) {
			const tableWrapper = tableRef.current.querySelector('.MuiDataTable-responsiveBase');
			if (tableWrapper) {
			  tableWrapper.classList.add('MuiDataTable-vertical');
			}
		  }
		};

		// Apply after a short delay to ensure DOM is ready
		const timer = setTimeout(applyResponsiveMode, 100);
		return () => clearTimeout(timer);
	  }, []);
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
				<div ref={tableRef}>
						  {isBrowser ? (
							<MUIDataTable
							  key={`table-${displayWidth}`}
							  title={""}
							  data={data}
							  columns={columns}
							  options={options}
							/>
						  ) : (
							<Skeleton
							  variant="rectangular"
							  height={400}
							  sx={{
								mx: 2,
								my: 3,
								borderRadius: '4px',
								transform: 'none'
							  }}
							/>
						  )}
						</div>
			</ThemeProvider>
		</>
	);
}
