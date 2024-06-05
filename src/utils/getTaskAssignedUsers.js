import FetchUserByIdAPI from "../redux/actions/api/UserManagement/FetchUserById";
import UserMappedByRole from "./UserMappedByRole/UserMappedByRole";

const getTaskAssignedUsers = async (taskDetails) => {
    const getAnnotator = async () => {
        if(!(taskDetails?.annotation_users?.length))
            return Promise.resolve(null);
        
        const annotatorObj = new FetchUserByIdAPI(taskDetails?.annotation_users[0]);
        return fetch(annotatorObj.apiEndPoint(), {
            method: "GET",
            headers: annotatorObj.getHeaders().headers,
        }).then(res => res.json()).then(res => res.email);
    };

    const getReviewer = async () => {
        if(!(taskDetails?.review_user))
            return Promise.resolve(null);

        const reviewerObj = new FetchUserByIdAPI(taskDetails?.review_user);
        return fetch(reviewerObj.apiEndPoint(), {
            method: "GET",
            headers: reviewerObj.getHeaders().headers,
        }).then(res => res.json()).then(res => res.email);
    }

    const getSuperChecker = async () => {
        if(!(taskDetails?.super_check_user))
            return Promise.resolve(null);
        
        const superCheckerObj = new FetchUserByIdAPI(taskDetails?.super_check_user);
        return fetch(superCheckerObj.apiEndPoint(), {
            method: "GET",
            headers: superCheckerObj.getHeaders().headers,
        }).then(res => res.json()).then(res => res.email);
    };

    return Promise.all([getAnnotator(), getReviewer(), getSuperChecker()]).then(res => 
        <div style={{display: "flex", padding: "8px 0px", flexDirection: "column", gap: "14px"}}>
            {res.map((email, idx) => 
                email && <div key={idx} style={{display: "inline", fontSize: 12}}>{UserMappedByRole(idx + 1).element} {email}</div>
            )}
        </div>
    )
};

export default getTaskAssignedUsers;