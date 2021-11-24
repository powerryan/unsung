import { useEffect, useState, useContext } from "react";
import Posts from "../../components/posts/Posts";
import Sidebar from "../../components/sidebar/Sidebar";
import {Context} from "../../context/Context"
import "./channelposts.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {useLocation} from "react-router"

export default function Channel() {
    const [posts, setPosts] = useState([]);
    const {user, dispatch} = useContext(Context);
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    useEffect(() => {
        const fetchPosts = async ()=> {
            const res = await axiosP.get("/posts", { params: { channel: path } });
            setPosts(res.data);
        }
        fetchPosts();
    },[path])

    return (
        <>

        {path &&
            (<h1 className="heading1">{path}</h1>)
        }
        <div className="home">
        <Posts posts={posts}/>
        { user &&
        <Sidebar/>
    }
        </div>
        </>
    )

}
