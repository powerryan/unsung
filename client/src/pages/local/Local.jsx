import { useEffect, useState, useContext, useRef } from "react";
import Posts from "../../components/posts/Posts";
import "./local.css";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
import {Context} from "../../context/Context";

export default function Channel() {
    const [posts, setPosts] = useState("");
    const [aposts, setAPosts] = useState([]);
    const [sentence, setSentence] = useState("");
    const {user} = useContext(Context)
    const zipRef = useRef()

    useEffect(() => {

        const fetchPosts = async ()=> {
            const res = await axiosP.get("/posts", { params: { zipcode: user.zipcode } });
            setPosts(res.data);
        }
        if (user){
        fetchPosts()
        return () => {
      setPosts({}); // This worked for me
    };
        }
    },[1])

    if (!posts.length && user && user.zipcode) {
        setTimeout(() => {  setSentence("Sorry, no posts found in your area"); }, 2000);
    }


    const handleSubmit = async(e) => {
        e.preventDefault();
        if (zipRef.current.value){
        const res = await axiosP.get("/posts", { params: { zipcode: zipRef.current.value } });
        setAPosts(res.data)
        }
        zipRef.current.value = "";
    }

    return (
        <>
        { user ?
        (
         parseInt(user.zipcode)?
        (
            posts ? (
                <div>
                <h1 className="heading1">Local</h1>
                <div className="channelposts">
                <Posts posts={posts}/>
                </div>
                </div>
            ) : (
                <div>
                <h1 className="heading1">Local</h1>
                <div className="channelposts">
                <span style={{fontSize:"2rem", color:"#555", marginTop:"15vh"}}>{sentence}</span>
            </div>
            </div>
        )) :
        <>
        <h1 className="heading1">Local</h1>
        <div className="channelposts">
        <span style={{fontSize:"2rem", color:"#555", marginTop:"15vh"}}>Please add your zipcode in the account settings page to view local posts</span>
        </div>
        </>
            ):
        (
            <>
            <form onSubmit={handleSubmit} className="writeForm">
            <div className="row sbrow">
            <input ref={zipRef} type="text" className="form-control channeladd loginInput" placeholder="Zipcode"/>
            <button className="loginButton chanbtn btn btn-sm btn-outline-dark" placeholder="Password" type="submit">View</button>
            </div>
            </form>
            <div>
            <h1 className="heading1">Local</h1>
            <div className="channelposts">
            <Posts posts={aposts}/>
            </div>
            </div>
        </>)

    }


        </>
    )

}
// useEffect(() => {
//
//     const fetchPosts = async ()=> {
//         const res = await axiosP.get("/posts", { params: { zipcode: user.zipcode } });
//         setPosts(res.data);
//     }
//     if (user){
//     fetchPosts();
//     }
// },[user.zipcode])
