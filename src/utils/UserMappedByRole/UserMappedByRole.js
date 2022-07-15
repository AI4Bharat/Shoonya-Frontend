import { Typography } from "@mui/material";
import { UserRoles } from "./UserRoles";

const UserMappedByRole = (roleId) => {
	if (roleId === UserRoles.ANNOTATOR) {
		return {
			id: roleId,
			name: "Annotator",
			element: (
				<Typography
					variant="caption"
					sx={{
						p: 1,
						backgroundColor: "rgb(56, 158, 13,0.2)",
						color: "rgb(56, 158, 13)",
						borderRadius: 2,
						fontWeight: 600,
					}}
				>
					Annotator
				</Typography>
			),
		};
	} else if (roleId === UserRoles.WORKSPACE_MANAGER) {
		return {
			id: roleId,
			name: "Manager",
			element: (
				<Typography
					variant="caption"
					sx={{
						p: 1,
						backgroundColor: "rgb(50, 100, 168,0.2)",
						color: "rgb(50, 100, 168)",
						borderRadius: 2,
						fontWeight: 600,
					}}
				>
					Manager
				</Typography>
			),
		};
	} else if (roleId === UserRoles.ORGANIZATION_OWNER) {
		return {
			id: roleId,
			name: "Admin",
			element: (
				<Typography
					variant="caption"
					sx={{
						p: 1,
						backgroundColor: "rgb(255, 99, 71,0.2)",
						color: "rgb(255, 99, 71)",
						borderRadius: 2,
						fontWeight: 600,
					}}
				>
					Admin
				</Typography>
			),
		};
	}
};

export default UserMappedByRole;
