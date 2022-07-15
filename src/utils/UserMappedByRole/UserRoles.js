export const UserRoles = {
	ANNOTATOR: 1,
	WORKSPACE_MANAGER: 2,
	ORGANIZATION_OWNER: 3,
	REVIEWER: 4,
	ADMIN: 5,
};

export function checkUserRole(role) {
	return {
		isAnnotator: (role) => role === UserRoles.ANNOTATOR,
		isWorkspaceManager: (role) => role === UserRoles.WORKSPACE_MANAGER,
		isOrganizationOwner: (role) => role === UserRoles.ORGANIZATION_OWNER,
		isReviewer: (role) => role === UserRoles.REVIEWER,
		isAdmin: (role) => role === UserRoles.ADMIN,
		isAnnotatorOrOrganizationOwner: (role) =>
			role === UserRoles.ANNOTATOR ||
			role === UserRoles.ORGANIZATION_OWNER,
	};
}
