import "./write.css";
import axios from "axios"
import {Context} from "../../context/Context";
import {useContext, useState } from "react";
import {store} from "../../firebase";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {axiosP, axiosJWT, refreshMe} from "../../middleware/Tokens"
export default function Write() {
    const [title, setTitle] = useState("")
    const [body, setDesc] = useState("")
    const [channel, setChannel] = useState("misc")
    const [subchannel, setSubchannel] = useState("misc")
    const [file, setFile] = useState(null)
    const {user} = useContext(Context)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            title,
            body,
            channel,
            subchannel,
            zipcode:user?user.zipcode:"anonymous",
            userid:user?user._id:"anonymous"
        };
        if (file){
            // const data = new FormData();
            // const filename=Date.now() + user.username + file.name;
            // data.append("name",filename);
            // data.append("file",file);
            // newPost.photo = filename;
            // try {
            //     await axios.post("/upload", data);
            //
            // } catch(err){
            //
            // }
            const filename = Date.now()+newPost.userid+file.name;
            //const imgRef = ref(store, file.name);
            const uploadRef = ref(store, `images/${filename}`);
            const uploadTask = uploadBytesResumable(uploadRef, file);
            uploadTask.on(
                "state_changed",
                snapshot => {},
                error => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async function(downloadURL)  {
                        newPost.photo = downloadURL;
                        const postbody = {
                            post: newPost

                        }
                        if (user){
                            const res = await axiosJWT.post("/posts",postbody);
                            window.location.replace("/post/" + res.data._id);
                        }
                        else {
                            const res = await axiosP.post("/posts/"+"anonymous",postbody);
                            window.location.replace("/post/" + res.data._id);
                        }

                    });
                });
        } else {
            try {
                const postbody = {
                    post: newPost,

                }
                if (user){
                    const res = await axiosJWT.post("/posts",postbody);
                    window.location.replace("/post/" + res.data._id);

                } else {
                    const res = await axiosP.post("/posts/"+"anonymous",postbody);
                    window.location.replace("/post/" + res.data._id);
                }


            } catch(err){
                console.log(err)
                console.log("ERROR IN POST ROUTE")
            }
        }

    }
    return (
        <>

        <div className="write">
            <form onSubmit={handleSubmit} className="writeForm">
                {file && (
                <img className="writeImg" src={URL.createObjectURL(file)} alt=""/>
            )}
                <div className="writeFormGroup">
                    <label htmlFor="fileInput">
                    <i className="writeIcon fas fa-camera"></i>
                    </label>
                    <input type="file" id="fileInput" style={{display:"none"}} onChange={(e)=>setFile(e.target.files[0])}/>
                </div>
                <div className="writeFormGroup">
                    <input type="text" placeholder="Channel" className="channelInput" onChange={(e)=>setChannel(e.target.value)} />
                    <input type="text" placeholder="Subchannel" className="channelInput" onChange={(e)=>setSubchannel(e.target.value)} />
                </div>
                <div className="writeFormGroup">
                    <input type="text" placeholder="Title" className="writeInput" onChange={(e)=>setTitle(e.target.value)} autoFocus={true}/>
                </div>
                <div className="writeFormGroup">
                    <textarea placeholder="Body" type="text" className="writeInput writeText" onChange={(e)=>setDesc(e.target.value)}></textarea>
                </div>
                <div>
                <button type="submit" className="btn-lg btn btn-outline-dark writeSubmit">Submit</button>
                </div>
            </form>
        </div>
        </>
    )
}
