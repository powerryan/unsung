import "./post.css";
import axios from "axios";
import {Context} from "../../context/Context";
import {useContext, useState} from "react";
import {Link} from 'react-router-dom';
import {useLocation} from "react-router";
import {axiosP, axiosJWT, refreshMe} from "../../middleware/Tokens"
export default function Post({post}) {
    //const PF = "http://localhost:5000/images/"
    const {user, dispatch} = useContext(Context);
    const [attempt, setAttempt] = useState(false);
    const location = useLocation()
    const path = location.pathname.split("/");
    var followed = false;
    var subscribed = false;

    if (user && user.channels && user.channels.includes(post.channel)) {
        followed=true;
    }
    if (user &&  user.subscriptions && user.subscriptions.includes(post.userid)) {
        subscribed = true;
    }
    const handleLike = async()=>{
        if (!user){
            setAttempt(true);

            return;
        }
        console.log(user)
        if (!post.liked.includes(user._id)){
            try {
                await axiosP.put(`/posts/${post._id}`, {
                    userid: user._id,
                    like: 1,
                });
            } catch {}
        }
    }
    const handleDislike = async()=>{
        if (!user) {
            setAttempt(true);
            return;
        }
        if (!post.liked.includes(user._id)){
            try {
                await axiosP.put(`/posts/${post._id}`, {
                    userid: user._id,
                    like: -1,
                });
            } catch {}
        }
    }
    const unfollow = async () => {
        dispatch({type:"UPDATE_START"})
        var channelList = user.channels
        if (!channelList){
            return;
        }
        else if (channelList.includes(post.channel)){
            var newList = channelList.filter(e => e !== post.channel);
            var updatedUser = {}
                updatedUser = {
                    userId: user._id,
                    channels: newList,
                }
            try {
                console.log("ugh")
                const res = await axiosJWT.put("/users/" + user._id, updatedUser);
                res.accessToken = user.accessToken;
                res.refreshToken = user.refreshToken;
                dispatch({type:"UPDATE_SUCCESS", payload: res.data})
                if (path.length > 2 && (path[2] === post.channel)) {
                    window.location.replace("/");
                }
            } catch(err) {
                dispatch({type:"UPDATE_FAILURE"})
            }
        }
    }
    const follow = async (e) => {
        if (!user) {
            setAttempt(true);
            return;
        }
        e.preventDefault();
        dispatch({type:"UPDATE_START"})
        var channelList = user.channels
        if (!channelList){
            channelList = [];
        }
        if (!channelList.includes(post.channel)) {
            channelList.push(post.channel);
            var updatedUser = {}
                updatedUser = {
                    userId: user._id,
                    channels: channelList,
                }
            try {
                const res = await axiosJWT.put("/users/" + user._id, updatedUser);

                dispatch({type:"UPDATE_SUCCESS", payload: res.data})
            } catch(err) {
                dispatch({type:"UPDATE_FAILURE"})
            }
        }
    }
    const subscribe = async () => {
        if (!user) {
            setAttempt(true);
            return;
        }
        dispatch({type:"UPDATE_START"})
        var subList = user.subscriptions
        if (!subList){
            subList = [];
        }
        if (!subList.includes(post.userid)) {
            subList.push(post.userid);
            var updatedUser = {}
                updatedUser = {
                    userId: user._id,
                    subscriptions: subList,
                }
            try {
                const res = await axiosJWT.put("/users/" + user._id, updatedUser);

                dispatch({type:"UPDATE_SUCCESS", payload: res.data})
            } catch(err) {
                dispatch({type:"UPDATE_FAILURE"})
            }
        }
    }
    const viewAnonymous = async () => {
        window.location.replace("/posts/anonymous");
    }
    const unsubscribe = async () => {
        dispatch({type:"UPDATE_START"})
        var subList = user.subscriptions
        console.log(subList)
        if (!subList){
            return;
        }
        else if (subList.includes(post.userid)){
            console.log(subList)
            var newList = subList.filter(e => e !== post.userid);
            var updatedUser = {}
                updatedUser = {
                    userId: user._id,
                    subscriptions: newList,
                }
            try {
                const res = await axiosJWT.put("/users/" + user._id, updatedUser);

                dispatch({type:"UPDATE_SUCCESS", payload: res.data})

            } catch(err) {
                dispatch({type:"UPDATE_FAILURE"})
            }
        }
    }
    return (

        <div className="post">
        <div className="row rowborder">

        <div className="col-sm-.5" style={{padding:"0px",marginTop:"5px"}}>
        <i className="arrow arrowtop fas fa-sort-up" onClick={handleLike}></i>
        <i className="arrow arrowbottom fas fa-sort-down" onClick={handleDislike}></i>
        </div>

        <div className="col-sm-11">
            <div className="postInfo">
                <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
                <Link to={`/channel/${post.channel}`} className="link">
                <span className="postChannel">{post.channel+" Channel"}</span>
                </Link>
                <Link to={`/subchannel/${post.subchannel}`} className="link">
                <span className="postChannel">{post.subchannel+" Subchannel"}</span>
                </Link>
                <br>
                </br>
                <Link to={`/post/${post._id}`} className="link titlelink">
                <span className="postTitle">{post.title}</span>
                </Link>
            </div>
            <p className="postDesc">
            {post.body}
            </p>
            {post.photo && (
                <img
                    className="postImg"
                    src={post.photo}
                    alt=""
                />
            )}
            {post.photo && (
                <br></br>
            )}
            {followed ? <span className="postChannel" onClick={unfollow}>Unfollow channel</span>:
            <span className="postChannel" onClick={follow}>Follow channel</span> }
            {post.userid != "anonymous" ? (subscribed ? <span className="postChannel" onClick={unsubscribe}>Unsubscribe</span>:
            <span className="postChannel" onClick={subscribe}>Subscribe to poster</span>):(
                <span className="postChannel" onClick={viewAnonymous}>Anonymous posts</span>
            ) }

            </div>
            </div>
            {attempt && <span style={{textAlign:"center", margin:"20px"}}>You must be logged in to Like, Follow, or Subscribe</span>}
        </div>


    )

}
// post.channel.map(c=>(
//     <Link key="{c.name}" to={`/post/${c}`} className="link">
//     <span key="{c.name}"className="postChannel">{c}</span>
//     </Link>
// ))
