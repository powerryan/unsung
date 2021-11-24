import Posts from "../../components/posts/Posts";
import { useEffect, useState } from "react";
import "./postpage.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {useLocation} from "react-router"

export default function PostPage() {
    const [posts, setPosts] = useState([]);
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    useEffect(() => {
        const fetchPosts = async ()=> {
            const res = await axiosP.get("/posts/" + path);
            setPosts([res.data]);
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
