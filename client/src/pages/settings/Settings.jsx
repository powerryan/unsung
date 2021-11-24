import "./settings.css";
import {useContext, useState} from "react"
import {Context} from "../../context/Context"
import axios from "axios"
import {axiosJWT, refreshMe} from "../../middleware/Tokens"
export default function Settings() {
    const {user, dispatch} = useContext(Context);

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type:"UPDATE_START"})
        var updatedUser = {}
        if (password) {
            if (password === cpassword) {
                updatedUser = {
                    userId: user._id,
                    username:username?username:user.username,
                    email:email?email:user.email,
                    password:password?password:user.password,
                    firstname:firstname?firstname:user.firstname,
                    lastname:lastname?lastname:user.lastname,
                    zipcode:zipcode?zipcode:user.zipcode
                }
            } else {
                setFailure(true)
                dispatch({type:"UPDATE_FAILURE"})
                return
            }

        } else {
            updatedUser = {
                userId: user._id,
                username:username?username:user.username,
                email:email?email:user.email,
                firstname:firstname?firstname:user.firstname,
                lastname:lastname?lastname:user.lastname,
                zipcode:zipcode?zipcode:user.zipcode
        }
    }



        try {
            const res = await axiosJWT.put("/users/" + user._id, updatedUser);
            setFailure(false)
            setSuccess(true);
            dispatch({type:"UPDATE_SUCCESS", payload: res.data})
        } catch(err) {
            setSuccess(false)
            setFailure(true);
            dispatch({type:"UPDATE_FAILURE"})
        }
    }
    return (
        <>

        <div className="settings">
            <div className="settingsWrapper row">

                <form className="settingsForm" onSubmit={handleSubmit}>
                    <h1 className="settingsHeading">Account Information</h1>
                    <div className="row">
                    <div className="col">
                    <input type="text" className="form-control" placeholder="First Name" onChange={(e) => setFirstname(e.target.value)}/>
                    </div>
                    <div className="col">
                    <input className="form-control" type="text" placeholder="Last Name" onChange={(e) => setLastname(e.target.value)}/>
                    </div>
                    <div className="col">
                    <input className="form-control" type="text" placeholder="Zip Code" onChange={(e) => setZipcode(e.target.value)}/>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col">
                    <input type="text" className="form-control" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="col">
                    <input className="form-control" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col">
                    <input className="form-control" type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="col">
                    <input className="form-control" type="password" placeholder="Confirm Password" onChange={(e) => setCPassword(e.target.value)}/>
                    </div>
                    </div>
                    <button className="settingsSubmit btn btn-outline-dark" type="submit">Update</button>
                </form>

            </div>
            <div className="notification row">
            {success && !failure && <span style={{textAlign:"center", margin:"20px"}}>Profile updated</span>}
            {failure && <span style={{textAlign:"center", margin:"20px"}}>Error updating profile. Try again.</span>}
            </div>
        </div>
        </>
    )
}
//const [file, setFile] = useState(null);

// if (file) {
//     const data = new FormData();
//     const filename = Date.now() + file.name;
//     data.append("name", filename);
//     data.append("file", file);
//     updatedUser.profilePhoto = filename;
//     try {
//         await axios.post("/upload", data);
//     } catch(err){}
// }

// <label>Profile Picture</label>
// <div className="settingsPP">
// { file ? <img src={URL.createObjectURL(file)} alt=""/> :
// <img src={PF + user.profilePhoto} alt=""/>
// }
//
//     <label htmlFor="fileInput">
//         <i className="settingsPPIcon far fa-user-circle"></i>
//     </label>
//     <input type="file" id="fileInput" style={{display:"none"}}
//     onChange={(e) => setFile(e.target.files[0])}/>
// </div>
