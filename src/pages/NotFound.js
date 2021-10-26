import React from "react";
import Error from "../components/Error";
import img from "../images/404.png";

const NotFound = () => {
  const title = "Page not found";
  return <Error img={img} title={title} />;
};

export default NotFound;
