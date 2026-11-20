import React from 'react';
import { Typography } from '@mui/material';
import Div from "@jumbo/shared/Div";
import './Setting.css';




const Setting = () => {
  return (
    <>
      <Div>
        {/* <img src='.\images\mainlogo-icon.jpg' width={30} height={30}></img> */}
        <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>Settings</Typography>
      </Div>
    </>
  )
}

export default Setting;
