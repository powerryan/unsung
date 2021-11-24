import "./sidebar.css";
import {useContext, useRef} from "react"
import { Link } from "react-router-dom";
import {Context} from "../../context/Context";
import axios from "axios"
import {axioP, axiosJWT, refreshMe} from "../../middleware/Tokens"
export default function Sidebar() {
    //const [channel, setChannels] = useState("");
    const {user, dispatch} = useContext(Context);
    const channelRef = useRef()
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({type:"UPDATE_START"})
        var channelList = user.channels
        if (!channelList){
            channelList = [];
        }
        if (channelRef.current.value && !channelList.includes(channelRef.current.value)) {
            channelList.push(channelRef.current.value);
            var updatedUser = {}
                updatedUser = {
                    userId: user._id,
                    channels: channelList,
                }
            try {
                const res = await axiosJWT.put("/users/" + user._id, updatedUser);

                dispatch({type:"UPDATE_SUCCESS", payload: res.data})
                channelRef.current.value = "";
            } catch(err) {
                dispatch({type:"UPDATE_FAILURE"})
            }
        }
    }

    return (
        <div className="sidebar">
        <form onSubmit={handleSubmit} className="writeForm">
        <div className="row sbrow">
        <input ref={channelRef} type="text" className="form-control channeladd loginInput" placeholder="Channel"/>
        <button className="loginButton chanbtn btn btn-sm btn-outline-dark" placeholder="Password" type="submit">Add</button>
        </div>
        </form>

            <div className="sidebarItem">
                <ul className="sidebarList">
                {user.subscriptions[0] &&
                <span><Link to="/subscriptions" className="channelref channelselect">
                <li className="sidebarListItem"><i className="radio far fa-newspaper"></i>Subscriptions</li>
                </Link>
                <hr style={{margin:"5px"}}></hr></span>

                }
                {user.channels[0] && user.channels.map(c=>(

                        <Link to={`/channel/${c}`} className="channelref channelselect" key={c}>
                        <li key={c} className="sidebarListItem"><i className="fas radio fa-broadcast-tower"></i>{c}</li>
                        </Link>

                    ))}

                </ul>
            </div>

        </div>
    )

}
