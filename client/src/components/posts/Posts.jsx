import "./posts.css";
import Post from "../post/Post";

export default function Posts({posts}) {
    return (
        <div className="posts">
        <br></br>


        {posts.map(p=>(
            <div  key={p._id} className="sepPost">
            <Post key={p._id} post={p}/>
            </div>
        ))}

        </div>
    )

}
