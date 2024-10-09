
import React, { useEffect, useState } from "react";
export default function Home() {

  const [users, setUsers] = useState([]);
  async function getData(params) {
    try {
      let response = await fetch("https://jsonplaceholder.typicode.com/users")
      let data = await response.json();
      setUsers(data);
      console.log(data);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getData();

  }, [])
  return (
    <> 
    <div className="demo">
      <div className="wrapper">

        <h1> A <span> demo</span>  showing off <span> react </span> using{" "} <em>
          <span>Express</span> | <span> Webpack</span> | <span> SWC</span>
        </em>
        </h1><h2>
          Some Async Data <small> No More extra babel plugin!</small>
        </h2>

        <ul> {users.length > 0 && users.map((user, index) => <li key={index} > {user.name} </li>)} </ul>
      </div>
    </div>
    
    </>
    

  )


}
