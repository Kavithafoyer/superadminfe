import Div from "@jumbo/shared/Div";
import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ToastContainer, toast } from "react-toastify";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  FontStyle,
  InvoiceA4,
} from "../../widgets/CRMStyles";

const RenewalInvoice = ({
  scrollHeight,
  setrenewalinvoice,
  setListRenewal,
  invoicedatas,
}) => {
  const [selectedFiles, setSelectedFiles] = useState("");
  const reportTemplateRef = useRef(null);

  const [Modaldata, setModaldata] = useState([]);

  const handleClickBack = () => {
    setModaldata([]);
    setrenewalinvoice(false);
    setListRenewal(true);
  };

  useEffect(() => {
    if (invoicedatas != undefined && invoicedatas.length != 0) {
      console.log("invoicedatas", invoicedatas);
      setModaldata(invoicedatas);
    }
  }, [invoicedatas]);

  const token = localStorage.getItem("accesstoken");

  let userDetails = localStorage.getItem("UserDetails");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  //  Mail Sending Functionality
  const mailBodyContent = `<h3 class="Typographyh1">Invoice</h3>

<div class="container">
    <div class="row">
        <div class="col-md-6">
            <div class="ml-5 mb-3">
                <div>
                    <img src="images/foyer copy.png" class="full-logo" alt="crm"/>
                </div>

                <div class="font-weight-bold">
                    <div class="mt-1">FOYER TECHNOLOGY PRIVATE LIMITED</div>
                    <div class="mt-1">10B, 1st Cross Street, Ramappanarnagar,</div>
                    <div class="mt-1">Perungudi, Chennai 600100</div>
                    <div class="mt-1">Phone: 91 9965808278</div>
                    <div class="mt-1">Email: Sales@foyertech.com</div>
                    <div class="mt-3">GST NO 3AABHAHH9191ZB</div>
                </div>

                <div class="font-weight-bold">
                    <h5 class="mt-3" >Item Description</h5>
                    <div class="mt-3">CRM Professional</div>
                    <div class="mt-1 text-primary">Plan: 3 User 3 Month</div>
                    <div class="mt-1">04/06/2023 to 06/09/2023</div>
                </div>

                <div class="font-weight-bold">
                    <h5 class="mt-3" >Invoice To</h5>
                    <h5 >Apex Private Limited</h5>
                    <div class="mt-1">10B, 1st Cross Street, Ramappanarnagar,</div>
                    <div class="mt-1">Perungudi, Chennai 600100</div>
                    <div class="mt-3">GST NO 3AABHAHH9191ZB</div>
                </div>
                <div class="font-weight-bold">
                <h3>
                To view Invoice Details, please click the following URL: 
                <a href="http://139.59.44.185:8000/${selectedFiles}">
                <button type='button' style='color: #000000; border: 1px #00bfff; border-radius: 4px; padding: 8px 16px; margin-right: 5px; cursor: pointer; text-decoration: none;'>Invoice Details
                </button>
                </a>
                </h3>

               </div>
            </div>
        </div>

          
          <div class="col-md-6 mt-5">
            <div class="font-weight-bold mt-5">
             <div class="mt-5" >
              <div class="mt-5" >
                <div class="mt-5 row">
                    <div class="col-lg-4">
                        <h5 class="text-primary mt-5">Tax Invoice</h5>
                        <h4 class="text-primary">#${
                          Modaldata?.Invoice_Id?.Invoice_Id
                        }</h4>
                        <div class="mt-3">Invoice Date</div>
                        <div class="mt-3">${
                          Modaldata?.Invoice_Id?.Invoice_Date?.split("T")[0]
                        }</</div>
                    </div>
                    <div class="col-lg-4 mt-5">
                        <div class="mt-3">Due Date</div>
                        <div class="mt-3">${Modaldata?.RequestDate}</div>
                    </div>
                </div>

                <div class="mt-5" >
                <h5 class="mt-5" >
                    <div>Amount: <span class="text-primary">${
                      Modaldata?.Invoice_Id?.InvoiceAmount
                    }</span></div>
                </h5>
                </div>

                <div class="mt-5" >
                <h5 class="mt-3" >
                    <div>Tax Amount: <span class="text-primary">${
                      Modaldata?.Invoice_Id?.TaxAmount
                    }</span></div>
                </h5>
                </div>

                <div class="mt-5" >
                <h5 class="mt-3" >
                    <div>Net Amount: <span class="text-primary">${
                      Modaldata?.Invoice_Id?.NetAmount
                    }</span></div>
                </h5>
                </div>

                <div class="mt-5" >
                <h5 class="mt-4" >
                    <div>Invoice Amount: <span class="text-primary">Rs.${
                      Modaldata?.Invoice_Id?.InvoiceAmount
                    }</span></div>
                </h5>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-3">Date</div>
        <div class="col-md-3">Payment Mode</div>
        <div class="col-md-3">Transaction Id</div>
        <div class="col-md-3">Total</div>
    </div>
</div>

<div class="row mt-4">
    <div class="col-md-12 text-right font-weight-bold">Balance</div>
</div>`;

  const onsubmit = () => {
    //   if(to === undefined || to === null || to === ""){
    //     toast.error("Invalid Data")
    //   }else{
    //     console.log("data");
    //     let mailsendto=[]
    //     usersdatas.map((item,index)=>{
    //       if(item.User_Name === to){
    //         mailsendto.push(item.User_emailId)
    //         console.log(item.User_emailId)
    //       }
    //     })

    var payload = {
      subject: "Invoice For Renewal Due",
      Recipients: [Modaldata?.Customer_Id?.Customer_Email],
      // "Recipients":["pravinfoyer@gmail.com"],
      body: mailBodyContent,
      id: localStorage.getItem("UserId"),
    };
    console.log("payload", payload);
    axios
      .post(
        `${BASE_URL}/superadmin/InvoiceMailsendingSpecifiedEvent/`,
        payload,
        {
          headers: {
            db: localStorage.getItem("DBName"),
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Mail Sent successfully", {
          position: "top-right",
          autoClose: 100,
        });
      });

    //   }
  };

  const handleClickPrint = async () => {
    // alert("hi")
    const contentElement = reportTemplateRef.current;

    const canvas = await html2canvas(contentElement);
    const imageData = canvas.toDataURL("image/jpeg", 3.0);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imageData, "JPEG", 10, 10, 190, 277); // Adjust position and dimensions as needed
    const customFilename = `${Modaldata?.Invoice_Id?.Invoice_Id}.pdf`;
    // pdf.save(customFilename);
    const blobUrl = URL.createObjectURL(pdf.output("blob"));

    // Open the PDF in a new tab
    window.open(blobUrl, "_blank");

    // Convert the PDF to base64
    const base64Data = pdf.output("datauristring").split(",")[1];

    const fileType = "application/pdf";

    var payload = {
      File: base64Data,
      filename: customFilename,
      FileName: customFilename,
      Uploadby: localStorage.getItem("Username"),
      filetype: fileType,
      Urls: "http://139.59.44.185:8000",
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
      Organization_Id: parseInt(localStorage.getItem("UserId")),
    };

    console.log("payload", payload);
    axios
      .post(`${BASE_URL}/superadmin/FilesandUrlsCRUD/`, payload, header)
      .then((res) => {
        console.log("ponkk", res.data);
        const files = res.data;
        console.log("PPPPPPPPPPP......", [...selectedFiles, files]);
        setSelectedFiles(res.data.File);
        onsubmit();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Typography className="Typographyh1" sx={[ComponentHeading]}>
        Invoice
      </Typography>

      <Div ref={reportTemplateRef} sx={InvoiceA4}>
        <Grid container columns={12}>
          <Grid item xl={5} xs={12}>
            <Div sx={{ ml: 5, mb: 3 }}>
              <Div>
                <img
                  className="full-logo"
                  src={`images/foyer copy.png`}
                  width={207}
                  height={97}
                  alt="crm"
                />
              </Div>

              <Div sx={{ fontWeight: 700, fontSize: "14px" }}>
                <Div sx={{ mt: 1 }}>FOYER TECHNOLOGY PRIVATE LIMITED</Div>

                <Div sx={[FontStyle, { mt: 1 }]}>
                  10B,1st Cross Street, Ramappanarnagar,
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {" "}
                  Perungudi, Chennai 600100{" "}
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}> Phone:91 9965808278 </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {" "}
                  Email:Sales@foyertech.com{" "}
                </Div>
                <Div sx={[FontStyle, { mt: 3 }]}> GST NO 3AABHAHH9191ZB </Div>
              </Div>
              <Div sx={{ fontWeight: 700 }}>
                <Div sx={{ mt: 3, fontSize: "14px" }}>Item Description</Div>
                <Div sx={{ mt: 3 }}>CRM Professional</Div>
                <Div sx={{ mt: 1, color: "blue" }}>Plan:3 User 3 Month</Div>
                <Div sx={{ mt: 1 }}>04/06/2023 to 06/09/2023</Div>
              </Div>
              <Div sx={{ fontWeight: 700 }}>
                <Div sx={{ mt: 3, fontSize: "14px" }}>Invoice To</Div>
                <Div sx={{ fontSize: "14px" }}> Apex Private Limited</Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  10B,1st Cross Street, Ramappanarnagar,
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {" "}
                  Perungudi, Chennai 600100{" "}
                </Div>

                <Div sx={[FontStyle, { mt: 3 }]}> GST NO 3AABHAHH9191ZB </Div>
              </Div>
            </Div>
          </Grid>

          <Grid item xl={6} xs={12}>
            <Div sx={{ fontWeight: 700 }}>
              <Div sx={{ mt: 15 }} className="row">
                <Div className="col-lg-4">
                  <Div sx={{ fontSize: "14px", color: "Blue" }}>
                    Tax Invoice{" "}
                  </Div>
                  <Div sx={[FontStyle, { mt: 3 }]}>Invoice Date</Div>
                  <Div sx={[FontStyle, { mt: 3 }]}>
                    {Modaldata?.Invoice_Id?.Invoice_Date?.split("T")[0]}
                  </Div>
                </Div>

                <Div className="col-lg-4">
                  <Div sx={{ fontSize: "14px", color: "Blue" }}>
                    {" "}
                    #{Modaldata?.Invoice_Id?.Invoice_Id}{" "}
                  </Div>
                  <Div sx={[FontStyle, { mt: 3 }]}>Due Date</Div>
                  <Div sx={[FontStyle, { mt: 3 }]}>
                    {Modaldata?.RequestDate}
                  </Div>
                </Div>
              </Div>
              <Div sx={{ mt: 8, fontSize: "14px" }}>
                <Div>
                  {" "}
                  Amount :
                  <span style={{ color: "blue", fontSize: "12px" }}>
                    Rs.{Modaldata?.Invoice_Id?.InvoiceAmount}
                  </span>
                </Div>
              </Div>
              <Div sx={{ mt: 6, fontSize: "14px" }}>
                <Div>
                  Tax Amount:
                  <span style={{ color: "blue", fontSize: "12px" }}>
                    {Modaldata?.Invoice_Id?.TaxAmount}
                  </span>
                </Div>
              </Div>
              <Div sx={{ mt: 6, fontSize: "14px" }}>
                <Div>
                  Net Amount:
                  <span style={{ color: "blue", fontSize: "12px" }}>
                    {Modaldata?.Invoice_Id?.NetAmount}
                  </span>
                </Div>
              </Div>

              <Div sx={{ mt: 8, fontSize: "14px" }}>
                <Div>
                  Invoice Amount:
                  <span style={{ color: "blue", fontSize: "12px" }}>
                    Rs.{Modaldata?.Invoice_Id?.InvoiceAmount}
                  </span>
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Grid
          container
          cloumns={12}
          sx={{ fontWeight: 700, ml: 5, fontSize: "14px" }}
        >
          <Grid sx={[FontStyle]} item xs={12} xl={3}>
            Date
          </Grid>
          <Grid sx={[FontStyle]} item xs={12} xl={3}>
            Payment Mode
          </Grid>
          <Grid sx={[FontStyle]} item xs={12} xl={3}>
            Transaction Id
          </Grid>
          <Grid sx={[FontStyle]} item xs={12} xl={3}>
            Total
          </Grid>
        </Grid>
      </Div>

      <Div
        className="row"
        sx={{
          mt: 7,
          display: "flex",
          justifyContent: "flex-end",
          fontWeight: 700,
          ml: 3,
          fontSize: "14px",
        }}
      >
        <Div>Balance</Div>
      </Div>

      <Div
        className="row Typographyh1"
        sx={{
          mt: 7,
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
        }}
      >
        <Button
          sx={[
            DialogBoxCancelButton,
            ButtonStyle,
            FontStyle,
            { width: { xs: "100% !important", md: "100px !important" }, m: 1 },
          ]}
          onClick={handleClickBack}
        >
          Cancel
        </Button>
        <Button
          sx={[
            DialogBoxSaveButton,
            ButtonStyle,
            FontStyle,
            { width: { xs: "100% !important", md: "100px !important" }, m: 1 },
          ]}
          onClick={handleClickPrint}
        >
          Send Mail
        </Button>
      </Div>
    </>
  );
};

export default RenewalInvoice;
