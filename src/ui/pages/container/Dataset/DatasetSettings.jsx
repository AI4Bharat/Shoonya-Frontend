import { useState, useEffect } from "react";
import { Card, CircularProgress, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { translate } from "../../../../config/localisation";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetDownload from "../../../../redux/actions/api/Dataset/GetDatasetDownload";
import CustomButton from "../../component/common/Button";

export default function DatasetSettings({ datasetId }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const downloadCount = useSelector((state) => state.getDatasetDownload.data);

	const handleClick = () => {
        console.log('called download');
		setLoading(true);
		dispatch(APITransport(new GetDatasetDownload(datasetId)));
	};

	useEffect(() => {
		console.log("download count", downloadCount);
		setLoading(false);
	}, [setLoading, downloadCount]);

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
					padding: 5,
				}}
			>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
					{loading ? (
						<CircularProgress />
					) : (
						<CustomButton
							label={translate("button.downloadDataset")}
							onClick={handleClick}
						/>
					)}
				</Grid>
			</Card>
		</Grid>
	);
}
