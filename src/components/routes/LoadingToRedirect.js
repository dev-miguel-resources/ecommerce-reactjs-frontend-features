import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  let history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && history.push("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count, history]);

  return <LoadingOutlined />;
};

export default LoadingToRedirect;
