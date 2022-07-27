// My Organization

import DetailsViewPage from "../../component/common/DetailsViewPage";
import componentType from "../../../../config/pageType";
import { useSelector } from "react-redux";

const MyOrganization = () => {
    const organizationDetails = useSelector(state=>state.fetchLoggedInUserData.data.organization);
    return (
        <DetailsViewPage
            title={organizationDetails && organizationDetails.title}
            createdBy={organizationDetails && organizationDetails.created_by && organizationDetails.created_by.username}
            pageType={componentType.Type_Organization}
        />
    )
}

export default MyOrganization;