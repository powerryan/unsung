import { useEffect, useState, useContext } from "react";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import "./subscriptions.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {Context} from "../../context/Context";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const {user} = useContext(Context)

    useEffect(() => {
        const fetchPosts = async ()=> {
            const res = await axiosP.get("/posts", { params: {subscription: user.subscriptions }});
            setPosts(res.data);
        }
        fetchPosts();
        if (!user.subscriptions[0]) {
            window.location.replace('/');
        }
    },[user.subscriptions])

    return (
        <>

        <h1 className="heading1">Subscriptions</h1>
        <div className="home">

        <Posts posts={posts}/>
        <Sidebar/>

        </div>
        </>
    )

}
