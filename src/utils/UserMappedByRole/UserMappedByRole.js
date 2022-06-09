import { Typography } from "@mui/material"

const UserMappedByRole = (roleId) => {
    if(roleId === 1){
        return {id: roleId, name : "Annotator", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(56, 158, 13,0.2)", color:"rgb(56, 158, 13)", borderRadius : 2}}>Annotator</Typography>}
    } else if(roleId === 2){
        return {id: roleId, name : "Manager", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(50, 100, 168,0.2)", color:"rgb(50, 100, 168)", borderRadius : 2}}>Manager</Typography>}
    } else if(roleId === 3){
        return {id: roleId, name : "Admin", element : <Typography variant="caption" sx={{p:1, backgroundColor:"rgb(255, 99, 71,0.2)", color:"rgb(255, 99, 71)", borderRadius : 2}}>Admin</Typography>}
    }
}

export default UserMappedByRole;