import Home from "./pages/home/Home";
import Anonymous from "./pages/anonymous/Anonymous";
import Postpage from "./pages/postpage/Postpage";
import Write from "./pages/write/Write";
import Settings from "./pages/settings/Settings";
import Login from "./pages/login/Login";
import Landing from "./pages/landing/Landing";
import Local from "./pages/local/Local";
import Channelposts from "./pages/channelposts/Channelposts";
import Subchannelposts from "./pages/subchannelposts/Subchannelposts";
import Subscriptions from "./pages/subscriptions/Subscriptions";
import Register from "./pages/register/Register";
import Trending from "./pages/trending/Trending";
import Topbar from "./components/topbar/TopBar";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {Context} from "./context/Context";
import {useContext} from "react";
function App() {
    const {user} = useContext(Context);
    //refresh and interceptor need to be on every page that calls api



  return (
    <Router>
    <Topbar/>
    <Switch>
    <Route exact path="/">
        { user ? <Home/> : <Landing/> }
    </Route>
    <Route path="/register">
        { user ? <Home/> : <Register/> }
    </Route>
    <Route path="/login">
        { !user && <Login/> }
    </Route>
    <Route exact path="/write">
        {<Write/> }
    </Route>
    <Route path="/settings">
        { user ? <Settings/> : <Landing/> }
    </Route>
    <Route path="/post/:postId">
        { <Postpage/> }
    </Route>
    <Route path="/posts/anonymous">
        { <Anonymous/> }
    </Route>
    <Route path="/channel">
        { <Channelposts/>}
    </Route>
    <Route path="/subchannel">
        { <Subchannelposts/> }
    </Route>
    <Route path="/local">
        { <Local/> }
    </Route>
    <Route path="/trending">
        { user ? <Trending/> : <Trending/> }
    </Route>
    <Route path="/subscriptions">
        { user ? <Subscriptions/> : <Landing/> }
    </Route>
    </Switch>
    </Router>

);
}

export default App;
