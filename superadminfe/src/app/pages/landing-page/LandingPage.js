import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { capitalizeWords } from "../widgets/StylesComponents";
import { Colors } from "../widgets/CRMStyles";
import navConfig from "app/layouts/shared/sidebars/Sidebar/adminsidenavmenu";
import "./LandingPage.css";
import { useStateContext } from "app/contexts/ContextProvider";
import { landingDatas } from "./LandingDatas";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const LandingPage = () => {
  const [childItems, setChildItems] = useState([]);
  const [datas, setDatas] = useState({});
  const { landingpath, setLandingpath } = useStateContext();

  const navigate = useNavigate();

  // Function to extract child items based on the current path
  const getChildItems = (path) => {
    const parentItem = navConfig?.find((item) => item?.path === path);

    if (parentItem && parentItem?.children?.length > 0) {
      return parentItem;
    }

    for (const item of navConfig) {
      const subChild = item?.children?.find((ch) => ch?.path === path);
      if (subChild && subChild?.children?.length) {
        return subChild;
      }
    }

    return [];
  };

  useEffect(() => {
    if (landingpath) {
      let newData = landingDatas?.find((item) => item?.id === landingpath);

      console.log("newData", newData);
      setDatas(newData || {});
      const childItems = getChildItems(landingpath);
      setChildItems(childItems);
    } else {
      navigate("/home");
    }
  }, [landingpath]);

  // Function to render child navigation links
  // const renderChildLinks = () => {
  //   return childItems?.map((item, index) => (
  //     <li
  //       onClick={() => {
  //         if (item?.children) {
  //           navigate(`/landing-page`);
  //           setLandingpath(item?.path);
  //         } else {
  //           navigate(`/${item?.path}`);
  //           setLandingpath(item?.path);
  //         }
  //       }}
  //       style={{
  //         fontSize: "16px",
  //         color: Colors?.Mblue,
  //         cursor: "pointer",
  //         margin: "10px 0px",
  //         "&:hover": { color: "#30B0C7" },
  //       }}
  //       key={index}
  //     >
  //       {item?.title}
  //     </li>
  //   ));
  // };

  return (
    <JumboContentLayoutMain>
      <section
        id="about"
        class="about section md:h-full transform md:-translate-y-10"
      >
        <div class="container h-full">
          <div class="row items-center justify-between gy-4 h-full">
            <div
              class="col sm:col-span-12 md:col-span-6 col-lg-6 content"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <p class="who-we-are">Who We Are</p>
              <h3>{datas?.title || "-"}</h3>
              <i class="" style={{ fontSize: "16px" }}>
                {datas?.content?.subContent}
              </i>
              <p className="text-end transform " style={{ fontSize: "15px" }}>
                — {datas?.content?.author}
              </p>
              <div className="ul">
                <p class=" mb-2" style={{ fontSize: "18px" }}>
                  {datas?.content?.para}
                </p>
                <ul>
                  {datas?.content?.points?.map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <i className="transform -translate-y-[10px]">
                        <IoMdCheckmarkCircleOutline
                          style={{ color: "#388da8", fontSize: "1.25rem" }}
                        />
                      </i>{" "}
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              class="col sm:col-span-12 md:col-span-6 col-lg-6 about-images flex items-center justify-center"
              style={{ textAlign: "center" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                src={datas?.image || ""}
                class="img-fluid"
                alt={datas?.image || ""}
                style={{
                  minWidth: "300px",
                  minHeight: "300px",
                  width: "80%",
                  // height: "80%",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </JumboContentLayoutMain>
  );
};

export default LandingPage;
