import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function NavBar() {

const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("http://localhost:4000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

    return (
        <div className="entire-page">
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/users">Users</Link>
                <Link to="/posts">Posts</Link>
            </div>
            <div className="content">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default NavBar;