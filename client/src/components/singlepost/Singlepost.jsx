import "./singlepost.css"
import { useLocation } from "react-router";
import axios from "axios";
import {axioP, axiosJWT, refreshMe} from "../../middleware/Tokens"
import {Context} from "../../context/Context";
import { useEffect, useState, useContext} from "react";
import {Link} from 'react-router-dom';
export default function Home() {
    const {user} = useContext(Context)
    const location = useLocation()
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState({})
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [update, setUpdate] = useState(false)

    useEffect(()=>{
        const getPost = async ()=> {
            const res = await axiosP.get("/posts/" + path);
            setPost(res.data)
            setTitle(res.data.title)
            setBody(res.data.body)
        };
        getPost()

    },[path]);
    const handleDelete = async()=>{
        try {
            await axiosP.delete(`/posts/${post._id}`, {data: {userid: user._id}});
            window.location.replace("/");
        } catch {

    }
    }
    const handleUpdate = async () => {

        try {
            await axiosP.put(`/posts/${post._id}`, {
                userid: user._id,
                title: title,
                body: body
            });
            setUpdate(false)

        } catch {
            console.log("didnt work")
        }
    }

    const PF = "http://localhost:5000/images/"
    return (
        <div className="Singlepost">
        <div className="postWrapper">
            {post.photo &&
            <img src={PF + post.photo} alt=""/>
            }
            { update ? <input type="text" autoFocus value={title} className="singlepostTitleInput" onChange={(e)=>setTitle(e.target.value)}/>:
             <h1 className="singlepostTitle">{title}</h1>
         }
            {post.userid === user?._id && (
            <div className="singlepostEdit"><i onClick={()=>setUpdate(true)} className="singlepostIcon far fa-edit"></i>
            <i className="singlepostIcon far fa-trash-alt" onClick={handleDelete}></i></div>
        )}

            <div className="singlepostInfo">
            <span className="singlepostAuthor"></span>
            <span className="singlepostDate">{new Date(post.createdAt).toDateString()}</span>
            </div>
            { update ? <textarea value={body} className="singlepostBodyInput" onChange={(e)=>setBody(e.target.value)}/> :
            (<p className="singlepostBody">
            {body}
            </p>)}
            <div className="postChannels">
                    {
                    <Link to={`/post/${post.channel}`} className="link">
                    <span className="postChannel">{post.channel}</span>
                    </Link>
                }{
                    <Link to={`/post/${post.subchannel}`} className="link">
                    <span className="postChannel">{post.subchannel}</span>
                    </Link>
                    }

            </div>






        { update ? <button className="btn btn-primary editPostButton"  onClick={handleUpdate}>Update</button>:
        <p></p>
    }
        </div>
        </div>
    )
}
