import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Spinner({ path = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => --prev);
    }, 1000);

    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <span className="loading loading-ring loading-lg"></span>
      <h1 className="text-3xl">Redirecting you to login in {count} sec</h1>
    </div>
  );
}

export default Spinner;
