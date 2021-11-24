import axios from "axios";
import jwt_decode from "jwt-decode";
const axiosP = axios.create({baseURL: process.env.REACT_APP_API_URL,});
const axiosJWT = axios.create({baseURL: process.env.REACT_APP_API_URL,})
axiosJWT.interceptors.request.use(async (config) => {
    console.log("config:");
    console.log(config);
    let currentDate = new Date();
    const accessToken = JSON.parse(localStorage.getItem("accessToken")).accessToken;
    config.headers["authorization"] = "Bearer " + accessToken;
    const decodedToken = jwt_decode(accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshMe();
        console.log(data)
        config.headers["authorization"] = "Bearer " + data.accessToken;
        console.log("not broken yet")
    }
    console.log(config);
    return config;
    }, (error)=>{
        console.log(error)
    return Promise.reject(error);
    }
);

const refreshMe = async () => {
    try {
        const refreshToken = JSON.parse(localStorage.getItem("refreshToken")).refreshToken;
        console.log("REFRESH TOKEN FROM refreshMe",refreshToken)
        const res = await axiosP.post("/auth/refresh", {token: refreshToken});
        localStorage.setItem("accessToken",JSON.stringify({"accessToken":res.data.accessToken}));
        localStorage.setItem("refreshToken",JSON.stringify({"refreshToken":res.data.refreshToken}));
        console.log("refreshing token")
        console.log(res.data)
        return {accessToken:res.data.accessToken, refreshToken:res.data.refreshToken}
    } catch(err){}
}

export {axiosP, axiosJWT, refreshMe};
