import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
		},
	},
	{
		name: "project_type",
		label: "Project Type",
		options: {
			filter: false,
			sort: false,
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
};

export default function DatasetProjectsTable({ datasetId }) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(APITransport(new GetDatasetProjects(datasetId)));
	}, [dispatch]);

	const datasetProjects = useSelector(
		(state) => state.getDatasetProjects.data
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
