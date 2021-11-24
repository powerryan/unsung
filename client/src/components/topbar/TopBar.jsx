import { Link } from "react-router-dom";
import {Context} from "../../context/Context";
import {useContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {axiosP, axiosJWT, refreshMe} from "../../middleware/Tokens"
import "./topbar.css";

export default function TopBar() {
    const {user, dispatch} = useContext(Context);



    const handleLogout = async() => {
        try {

            const res = await axiosJWT.post("/auth/logout",
            {"refreshToken":JSON.parse(localStorage.getItem("refreshToken")).refreshToken}
        )


    } catch (error) {
        console.log(error);
        console.log("logout error")
        dispatch({type:"LOGOUT"})

        return
    }

    localStorage.setItem("accessToken",null);
    localStorage.setItem("refreshToken",null);

    dispatch({type:"LOGOUT"})
    window.location.replace("/");
    }
    return (
        <>
        {
            user ? (
        <div className="top">
            <div className="topLeft">
                <ul className="leftlist">
                    <li className="listitem"><Link to="/" className="homelink"style={{textDecoration:"none"}}>
                    <i className="arrow bottomarrowlink fas fa-sort-down"></i><i className="arrow toparrowlink fas fa-sort-up"></i></Link></li>

                </ul>
            </div>
            <div className="topCenter"></div>
            <div className="topRight">
                <ul className="rightlist">
                    <li className="listitem"><Link to="/local" style={{textDecoration:"none"}}><i className="navicon pin fas fa-map-marker-alt"></i></Link></li>
                    <li className="listitem"><Link to="/trending" style={{textDecoration:"none"}}><i className="navicon flame fas fa-fire-alt"></i></Link></li>
                    <li className="listitem"><Link to="/write" style={{textDecoration:"none"}}><i className="navicon pen fas fa-pen"></i></Link></li>

                    <li className="listitem drop">
                    <div className="dropdown">
                      <button className="btn button btn-outline-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="navicon cog drop fas fa-cog"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">

                        <a className="dropdown-item" href="/settings">Account</a>
                        <div className="dropdown-divider"></div>
                        <span onClick={handleLogout} className="dropdown-item">Logout</span>
                      </div>
                    </div>
                    </li>
                    </ul>
                </div>
            </div>


                ) : (

                    <div className="topHome">
                    <div className="topLeft">
                    <li className="listitemhome"><Link to="/" className="homelink"style={{textDecoration:"none", marginLeft:"0px", marginTop: "5px", color:"black"}}>
                    <i className="arrow bottomarrowlink fas fa-sort-down"></i><i className="arrow toparrowlink fas fa-sort-up"></i></Link></li>
                    </div>
                    <div className="topCenterhome"></div>
                    <div className="topRighthome">
                    <ul className="rightlisthome">
                    <li className="listitemhome"><Link to="/local" style={{textDecoration:"none", color:"black"}}>Local</Link></li>
                    <li className="listitemhome"><Link to="/trending" style={{textDecoration:"none", color:"black"}}>Popular</Link></li>
                    <li className="listitemhome"><Link to="/write" style={{textDecoration:"none", color:"black"}}>Publish</Link></li>
                    <li className="listitemhome"><Link to="/login" style={{textDecoration:"none", color:"black"}}>Log In</Link></li>
                    <li className="listitemhome"><Link to="/register" style={{textDecoration:"none", color:"black"}}>Sign Up</Link></li>

                    </ul>
                    </div>
                    </div>

                )
             }
             </>

    )

}
//<li className="listitem"><i className="topicon fas magnifyingGlass fa-search"></i></li>
//<li className="listitem"><i className="navicon friends fas fa-user-friends"></i></li>
//<li className="listitem"><i className="navicon envelope fas fa-envelope"></i></li>
