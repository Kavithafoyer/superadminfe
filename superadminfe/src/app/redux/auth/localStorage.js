import { useEffect, useState } from "react";

const token = localStorage.getItem("accesstoken");
const UserId = parseInt(localStorage.getItem("UserId"));
const OrganizationId = parseInt(localStorage.getItem("OrganizationId"));
const DBname = "crmuseradmin1";

const FormatAmount = (amount) => {
  return Boolean(amount) ? amount?.toLocaleString() : NaN;
};

const AutoHeight = (hei = 1.5) => {
  // const [height, setHeight] = useState(window.innerHeight / hei);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerHeight / hei > 300) {
  //       setHeight(window.innerHeight / hei);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // return height;

  const [height, setHeight] = useState(window.innerHeight / hei);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight / hei);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [hei]);

  return height;
};

export { token, UserId, OrganizationId, DBname, AutoHeight, FormatAmount };
