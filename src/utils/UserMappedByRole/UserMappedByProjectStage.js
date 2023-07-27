import { Typography } from "@mui/material"

const UserMappedByProjectStage = (roleId) => {
    if(roleId == 1){
        return {id: roleId, name : "Annotation", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(34, 134, 202 ,0.2)", color:"rgb(34, 134, 202 )", borderRadius : 2, fontWeight: 600 }}>Annotation</Typography>}
    } else if(roleId == 2){
        return {id: roleId, name : "Review", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(230, 126, 34  ,0.2)", color:"rgb(230, 126, 34   )", borderRadius : 2, fontWeight: 600 }}>Review</Typography>}
    } else if(roleId == 3){
        return {id: roleId, name : "Supercheck", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(142, 68, 173,0.2)", color:"rgb(142, 68, 173 )", borderRadius : 2, fontWeight: 600 }}>Supercheck</Typography>}
    }

}

export default UserMappedByProjectStage;