import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  FormControl,
  Autocomplete,
  Grid,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import { CustomButton } from "../widgets/StylesComponents";
import { useNavigate } from "react-router-dom";
// import IntroPageImage from "./../../assets/images/IntroPage1.jpg";

// export function base64UrlEncode(str) {
//     return btoa(str)
//         .replace(/\+/g, '-')  // + => -
//         .replace(/\//g, '_')  // / => _
//         .replace(/=+$/, '');  // remove padding
// }

export function base64UrlEncode(str) {
  const encoded = btoa(encodeURIComponent(str)); // handles Unicode too
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4 !== 0) {
    str += "="; // Add padding if necessary
  }
  return decodeURIComponent(atob(str));
}

// export function base64UrlDecode(str) {
//     str = str.replace(/-/g, '+').replace(/_/g, '/');
//     while (str.length % 4) str += '=';
//     return atob(str);
// }

const IntroPage = () => {
  const navigate = useNavigate();

  const productLists = ["CRMFarm", "Felix", "Bolt"];
  const [productName, setProductName] = useState("");

  const encodedProductName = base64UrlEncode(productName);

  const handleRedirectHome = () => {
    // navigate(`/?Tenentname=${productName}`)
    if (productName) {
      if (productName == "CRMFarm") {
        // const newUrl = `https://crmfarmsa.crmfarm.in/`;
        const newUrl = `http://crmfarmsa.localhost:3000/`;
        window.location.assign(newUrl);
      } else if (productName == "Felix") {
        const newUrl = `https://hrmsa.crmfarm.in/`;
        // const newUrl = `http://${productName}.localhost:3000/`;
        window.location.assign(newUrl);
      } else if (productName == "Bolt") {
        const newUrl = `https://mmsa.crmfarm.in/`;
        // const newUrl = `http://${productName}.localhost:3000/`;
        window.location.assign(newUrl);
      } else {
        // Update the URL with the selected product name as a query parameter
        const newUrl = `http://${productName}.localhost:3000/`; // Adjust with dynamic product name if needed
        // const newUrl = `http://localhost:3000/?Tenentname=${encodedProductName}`;
        window.location.assign(newUrl);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        // backgroundColor: "#f5f5f5",
        // backgroundImage: `url(${IntroPageImage})`,
        // backgroundSize: "contain",
        // backgroundPosition: "right",
        // backgroundRepeat: "no-repeat",
        // fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Centered search button */}
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%", lg: "30%" },
        }}
      >
        <Grid
          container
          xs={12}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12}>
            <Autocomplete
              className="w-100 search-select3 col-4"
              id="outlined-basic"
              name="productName"
              options={productLists}
              getOptionLabel={(option) => option}
              value={productLists?.find((item) => item === productName)}
              onChange={(e, newvalue) => {
                setProductName(newvalue);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Product" />
              )}
            />

            {/* <Button variant="contained" color="success" size="large">
                            Get Started
                        </Button> */}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ mt: 5, display: "flex", justifyContent: "center" }}
          >
            <CustomButton
              label="Get Started"
              onClick={handleRedirectHome}
              width={"150px"}
              disabled={!productName}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default IntroPage;
