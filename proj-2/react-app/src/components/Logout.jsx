import React, { useEffect } from "react";
import helper from "./helper.js";

function Logout(props) {
  useEffect(() => {
    helper.deleteAllCookies();
    const timer = setTimeout(() => {
      props.history.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <React.Fragment>
      <p>You have logged out</p>
      <p>You will be redirected shortly</p>
    </React.Fragment>
  );
}

export default Logout;
