import "./register.css";
import {useState } from "react";
import axios from "axios";
import {axiosP} from "../../middleware/Tokens"
export default function Register() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [error, setError] = useState(false)

    const handleSubmit = async (e)=> {
        e.preventDefault()
        setError(false);
        try {
        const res = await axiosP.post("/auth/register", {
            username,
            email,
            password,
            firstname,
            lastname,
        });
        res.data && window.location.replace("/login");
        } catch {
            setError(true);
        }
    };
    return (


        <div className="register">
        <div className="registerContents">
        <span className="registerTitle">Register</span>
            <form className="registerForm" onSubmit={handleSubmit}>
                <label className="sr-only">First Name</label>
                <input type="text" className="form-control registerInput"
                placeholder="First Name" onChange={e=>setFirstname(e.target.value)}/>
                <label className="sr-only">Last Name</label>
                <input type="text" className="form-control registerInput"
                placeholder="Last Name" onChange={e=>setLastname(e.target.value)}/>
                <label className="sr-only">Email</label>
                <input type="text" className="form-control registerInput"
                placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
                <label className="sr-only">Username</label>
                <input type="text" className="form-control registerInput"
                placeholder="Username" onChange={e=>setUsername(e.target.value)}/>
                <label className="sr-only">Password</label>
                <input className="form-control registerInput" type="password"
                placeholder="Password" onChange={e=>setPassword(e.target.value)}/>
                <button className="registerButton btn btn-primary" type="submit">Register</button>
                {error && <span>Something went wrong!</span>}
            </form>
            </div>



        </div>

    )
}
