
import "./login.css";
//import {Link} from "react-router-dom";
import {Context} from "../../context/Context";
import {useRef, useContext } from "react";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
export default function Login() {

    const userRef = useRef()
    const passwordRef = useRef()
    const {dispatch, isFetching} = useContext(Context)
    const {user} = useContext(Context)

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch({type:"LOGIN_START"});
        try{
            console.log("hello")
            const res = await axiosP.post("/auth/login", {
                username: userRef.current.value,
                password: passwordRef.current.value,
            })
            console.log(res);
            localStorage.setItem("accessToken",JSON.stringify({"accessToken":res.data.accessToken}));
            localStorage.setItem("refreshToken",JSON.stringify({"refreshToken":res.data.refreshToken}));
            dispatch({type:"LOGIN_SUCCESS",payload:res.data});
            window.location.replace("/");
        }catch(err){
            dispatch({type:"LOGIN_FAILURE"});
        }
    }


    return (

        <div className="login">
        <div className="loginContents">
        <span className="loginTitle">Log In</span>
            <form className="loginForm" onSubmit={handleSubmit}>
                <label className="sr-only">Username</label>
                <input ref={userRef} type="text" className="form-control loginInput" placeholder="Username"/>
                <label className="sr-only">Password</label>
                <input ref={passwordRef} className="form-control loginInput" placeholder="Password" type="password" />
                <button disabled={isFetching} className="loginButton btn btn-primary" placeholder="Password" type="submit">Login</button>
            </form>
        </div>



        </div>

    )
}
