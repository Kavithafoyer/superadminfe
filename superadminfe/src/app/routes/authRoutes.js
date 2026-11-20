import React from "react";
import Login from "../pages/auth-pages/login";
import Signup2 from "../pages/auth-pages/signup2";
import ForgotPassword from "../pages/auth-pages/forgot-password";
import ResetPassword from "../pages/auth-pages/forgot-password/ResetPassword";
import Page from "@jumbo/shared/Page";
import IntroPage from "app/pages/home/IntroPage";
import RegistrationPage from "../pages/auth-pages/registration/RegistrationPage";

const authRoutes = [

  // {
  //   path: "/",
  //   element: <Page component={IntroPage} layout={"solo-page"} />,
  // },
  // {
  //   path: "/login",
  //   element: <Page component={Login} layout={"solo-page"} />,
  // },

  {
    path: "/auth-pages/signup-2",
    element: <Page component={Signup2} layout={"solo-page"} />,
  },
  {
    path: "/auth-pages/forgot-password",
    element: <Page component={ForgotPassword} layout={"solo-page"} />,
  },
  {
    path: "/auth-pages/reset-password",
    element: <Page component={ResetPassword} layout={"solo-page"} />,
  },
  {
    path: "/registration",
    element: <Page component={RegistrationPage} layout={"solo-page"} />,
  },
];

export default authRoutes;
