import styled from "@emotion/styled";
import { Tooltip, tooltipClasses } from "@mui/material";

export const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
        backgroundColor:"#F9F9F9",
        color:"black",
        border:"1px solid lightgray",
        fontSize:"10px",
    },
});
