import { useEffect, useState, useContext } from "react";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {Context} from "../../context/Context";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const {user} = useContext(Context)
    console.log(user);
    useEffect(() => {
        const fetchPosts = async ()=> {
        if (user.channels.length) {
            console.log("calling posts")
            const res = await axiosP.get("/posts", { params: {channel: user.channels }});
            setPosts(res.data);
        } else {
            console.log("not calling posts")
            const res = await axiosP.get("/posts");
            setPosts(res.data);
        }
        }
        fetchPosts();
    },[user.channels])

    return (
        <>


        <div className="home">
        <Posts posts={posts}/>

        <Sidebar/>

        </div>
        </>
    )

}
// <Posts posts={posts}/>
