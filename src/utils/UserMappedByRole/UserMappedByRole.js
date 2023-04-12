import { Typography } from "@mui/material"

const UserMappedByRole = (roleId) => {
    if(roleId == 1){
        return {id: roleId, name : "Annotator", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(56, 158, 13,0.2)", color:"rgb(56, 158, 13)", borderRadius : 2, fontWeight: 600 }}>Annotator</Typography>}
    } else if(roleId == 2){
        return {id: roleId, name : "Reviewer", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(142, 68, 173 ,0.2)", color:"rgb(142, 68, 173 )", borderRadius : 2, fontWeight: 600 }}>Reviewer</Typography>}
    } else if(roleId == 3){
        return {id: roleId, name : "SuperChecker", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(243, 156, 18 ,0.2)", color:"rgb(243, 156, 18)", borderRadius : 2, fontWeight: 600 }}>SuperChecker</Typography>}
    }else if(roleId == 4){
        return {id: roleId, name : "Manager", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(40, 116, 166 ,0.2)", color:"rgb(40, 116, 166 )", borderRadius : 2, fontWeight: 600 }}>Manager</Typography>}
    }
    else if(roleId == 5){
        return {id: roleId, name : "Owner", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(97, 106, 107 ,0.2)", color:"rgb(97, 106, 107 )", borderRadius : 2, fontWeight: 600 }}>Owner</Typography>}
    }
    else if(roleId == 6){
        return {id: roleId, name : "Admin", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(255, 99, 71,0.2)", color:"rgb(255, 99, 71)", borderRadius : 2, fontWeight: 600 }}>Admin</Typography>}
    }


}

export default UserMappedByRole;