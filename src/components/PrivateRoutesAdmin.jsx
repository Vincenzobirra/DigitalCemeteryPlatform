import { Navigate } from "react-router"
import { Global, logOut } from "../Global"

export default function PrivateRoutesAdmin ({children}) {
    
    if(!Global.log.user_token){
        logOut()
        return <Navigate to={'/'}/>
    }

    return children
}