import React, { useEffect } from "react";
import axios from "axios";
import helper from "./helper.js";

function Logout(props) {
  useEffect(() => {
    try {
      axios.put("/users/signout").then(() => {
        helper.deleteAllCookies();
        const timer = setTimeout(() => {
          props.history.push("/");
        }, 3000);
        return () => clearTimeout(timer);
      });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <React.Fragment>
      <p>You have logged out</p>
      <p>You will be redirected shortly</p>
    </React.Fragment>
  );
}

export default Logout;
