import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";

const ViewPlan=({setViewPlan,setListPlan})=>{

    const handleClickBack=()=>{

        setViewPlan(false);
        setListPlan(true);

    }

    return(<>
    <Grid container columns={12}>
            <Grid item xs={12} xl={10}>
            <Typography variant="h1" sx={{ fontWeight: 700, pt: 2 ,pl:2}}>
                Plan Overview
            </Typography>
            </Grid>
            <Grid item xs={12} xl={2} sx={{ fontWeight: 700, pt: 2 ,pl:2}}>
                <IconButton
                            size="small"
                            className="edit-icon"
                            // onClick={EditForm}
                            >
                            <BiEdit />
                </IconButton>
            </Grid>
    </Grid>
    
    </>)
}

export default ViewPlan;