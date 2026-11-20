import { styled, alpha } from "@mui/material/styles";

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: "#EAF2FE",
  "&:hover": {
    backgroundColor: alpha("#EAF2FE", 0.85),
  },
  width: "100%",
}));
