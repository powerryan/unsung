import Posts from "../../components/posts/Posts";
import { useEffect, useState } from "react";
import "./anonymous.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {useLocation} from "react-router"

export default function Anonymous() {
    const [posts, setPosts] = useState([]);
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    useEffect(() => {
        const fetchPosts = async ()=> {
            if (path == "anonymous") {
            const res = await axiosP.get("/posts/anonymous");
            setPosts(res.data);
            }
            return;
        }
        fetchPosts();
    },[path])

    return (
        <>


        <div className="channelposts">
        <Posts posts={posts}/>


        </div>
        </>
    )

}
