import { useEffect, useState } from "react";

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
                <button>Home</button>
                <button>Users</button>
                <button>Posts</button>
            </div>
            <div className="content">
                <h1>{message}</h1>
            </div>
        </div>
    )
}

export default NavBar;