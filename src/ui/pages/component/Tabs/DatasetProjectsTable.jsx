import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CustomButton from "../common/Button";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetProjects from "../../../../redux/actions/api/Dataset/GetDatasetProjects";
import MUIDataTable from "mui-datatables";

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
		name: "link",
		label: "Link",
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

	useEffect(() => {
		dispatch(APITransport(new GetDatasetProjects(datasetId)));
	}, [dispatch, datasetId]);

	const datasetProjects = useSelector((state) =>
		state.getDatasetProjects.data.map((project) => ({
			...project,
			link: () => (
				<Link
					to={`/projects/${project.id}`}
					style={{ textDecoration: "none" }}
				>
					<CustomButton sx={{ borderRadius: 2 }} label="View" />
				</Link>
			),
		}))
	);

	return (
		<>
			<MUIDataTable
				columns={columns}
				options={options}
				data={datasetProjects}
			/>
		</>
	);
}
