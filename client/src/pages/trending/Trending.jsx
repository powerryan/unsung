import { useEffect, useState } from "react";
import Posts from "../../components/posts/Posts";
import "./trending.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {useLocation} from "react-router"

export default function Trending() {
    const [posts, setPosts] = useState([]);
    const {search} = useLocation()
    useEffect(() => {
        console.log(search)
        const fetchPosts = async ()=> {
            const res = await axiosP.get("/posts/");
            setPosts(res.data);
        }
        fetchPosts();
    },[search])

    return (
        <>

        <h1 className="heading1">Trending</h1>
        <div className="trending">

        <Posts posts={posts}/>


        </div>
        </>
    )

}
