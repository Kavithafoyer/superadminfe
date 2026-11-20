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
import React, { useEffect } from "react";
import { addDays, format } from "date-fns";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
} from "react-icons/md";
import { RiMailSendFill, RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ToastContainer, toast } from "react-toastify";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ButtonStyle,
  CRMTableHead,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  FontStyle,
  InvoiceA4,
  UploadBtn,
} from "../../widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";

const ChangeplanInvoice = ({
  scrollHeight,
  setchangeinvoice,
  setListChange,
  invoicedatas,
}) => {
  const [selectedFiles, setSelectedFiles] = useState("");
  const reportTemplateRef = useRef(null);
  const [invoiceProduct, setinvoiceProduct] = useState([]);
  const [DueDate, setDueDate] = useState("");

  const [Modaldata, setModaldata] = useState([]);

  const handleClickBack = () => {
    setModaldata([]);
    setchangeinvoice(false);
    setListChange(true);
  };

  useEffect(() => {
    if (invoicedatas != undefined && invoicedatas.length != 0) {
      console.log("invoicedatas", invoicedatas);
      setModaldata(invoicedatas);
      GettingDueDate(invoicedatas);
      console.log("useEffect Modaldata:", Modaldata);
    }
  }, [invoicedatas]);

  const token = localStorage.getItem("accesstoken");

  let userDetails = localStorage.getItem("UserDetails");

  const GettingDueDate = (DewDateDate) => {
    // console.log("GettingDueDate:",NewDate)
    // console.log("Subscription_Id:",Modaldata?.Subscription_Id)
    // console.log("SubscriptionDate:",Modaldata?.Subscription_Id?.SubscriptionDate)
    // Your formatted date
    const formattedDate = DewDateDate?.Subscription_Id?.SubscriptionDate;

    // Convert the formatted date to a Date object
    const date = new Date(formattedDate);

    // Add 10 days to the date using date-fns
    const resultDate = addDays(
      date,
      Number(DewDateDate?.Subscription_Id?.SubscriptionPeriod)
    );

    // Format the resulting date
    const resultFormattedDate = format(resultDate, "yyyy-MM-dd");
    setDueDate(resultFormattedDate);
    console.log("Initial Formatted Date:", formattedDate);
    console.log(
      "Resulting Formatted Date after adding 10 days:",
      resultFormattedDate
    );
  };

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  //  Mail Sending Functionality
  //   const mailBodyContent = `<h3 class="Typographyh1">Invoice</h3>

  // <div class="container">
  //     <div class="row">
  //         <div class="col-md-6">
  //             <div class="ml-5 mb-3">
  //                 <div>
  //                     <img src="images/foyer copy.png" class="full-logo" alt="crm"/>
  //                 </div>

  //                 <div class="font-weight-bold">
  //                     <div class="mt-1">FOYER TECHNOLOGY PRIVATE LIMITED</div>
  //                     <div class="mt-1">10B, 1st Cross Street, Ramappanarnagar,</div>
  //                     <div class="mt-1">Perungudi, Chennai 600100</div>
  //                     <div class="mt-1">Phone: 91 9965808278</div>
  //                     <div class="mt-1">Email: Sales@foyertech.com</div>
  //                     <div class="mt-3">GST NO 3AABHAHH9191ZB</div>
  //                 </div>

  //                 <div class="font-weight-bold">
  //                     <h5 class="mt-3" >Invoice To</h5>
  //                     <h5 >${Modaldata?.Customer_Id?.Organization_Name}</h5>
  //                     <div class="mt-1">${Modaldata?.Customer_Id?.Address?.Street_Name}</div>
  //                     <div class="mt-1">${Modaldata?.Customer_Id?.Address?.Area_Name}, ${Modaldata?.Customer_Id?.Location} 600100</div>
  //                     <div class="mt-1">${Modaldata?.Customer_Id?.State}</div>
  //                     <div class="mt-3">GST NO ${Modaldata?.Customer_Id?.GST_No}</div>
  //                 </div>

  //                 <div class="font-weight-bold">
  //                     <h5 class="mt-3" >Item Description</h5>
  //                     <div class="mt-3">CRM Professional</div>
  //                     <div class="mt-1 text-primary">Plan: ${Modaldata?.Addtionalusers + Modaldata?.Noofusers} User ${Modaldata?.Subscription_Id?.SubscriptionPeriod} Month</div>
  //                     <div class="mt-1">${Modaldata?.Subscription_Id?.SubscriptionDate} to ${DueDate}</div>
  //                 </div>

  //                 <div class="font-weight-bold">
  //                 <h3>
  //                 To view Invoice Details, please click the following URL:
  //                 <a href="http://backend.crmfarm.in:8000/${selectedFiles}">
  //                 <button type='button' style='color: #000000; border: 1px #00bfff; border-radius: 4px; padding: 8px 16px; margin-right: 5px; cursor: pointer; text-decoration: none;'>Invoice Details
  //                 </button>
  //                 </a>
  //                 </h3>

  //                </div>
  //             </div>
  //         </div>

  //           <div class="col-md-6 mt-5">
  //             <div class="font-weight-bold mt-5">
  //              <div class="mt-5" >
  //               <div class="mt-5" >
  //                 <div class="mt-5 row">
  //                     <div class="col-lg-4">
  //                         <h5 class="text-primary mt-5">Tax Invoice</h5>
  //                         <h4 class="text-primary">#${
  //                           Modaldata?.Invoice_Id?.Invoice_Id
  //                         }</h4>
  //                         <div class="mt-3">Invoice Date</div>
  //                         <div class="mt-3">${
  //                           Modaldata?.Invoice_Id?.Invoice_Date?.split("T")[0]
  //                         }</</div>
  //                     </div>
  //                     <div class="col-lg-4 mt-5">
  //                         <div class="mt-3">Due Date</div>
  //                          <div class="mt-3">${DueDate}</div>
  //                     </div>
  //                 </div>

  //                 <div class="mt-5" >
  //                 <h5 class="mt-5" >
  //                     <div>Amount: <span class="text-primary">${
  //                       Modaldata?.Invoice_Id?.InvoiceAmount
  //                     }</span></div>
  //                 </h5>
  //                 </div>

  //                 <div class="mt-5" >
  //                 <h5 class="mt-3" >
  //                     <div>Tax Amount: <span class="text-primary">${
  //                       Modaldata?.Invoice_Id?.TaxAmount
  //                     }</span></div>
  //                 </h5>
  //                 </div>

  //                 <div class="mt-5" >
  //                 <h5 class="mt-3" >
  //                     <div>Net Amount: <span class="text-primary">${
  //                       Modaldata?.Invoice_Id?.NetAmount
  //                     }</span></div>
  //                 </h5>
  //                 </div>

  //                 <div class="mt-5" >
  //                 <h5 class="mt-4" >
  //                     <div>Invoice Amount: <span class="text-primary">Rs.${
  //                       Modaldata?.Invoice_Id?.InvoiceAmount
  //                     }</span></div>
  //                 </h5>
  //                 </div>
  //             </div>
  //             </div>
  //         </div>
  //         </div>
  //     </div>

  //     <div class="row">
  //         <div class="col-md-3">Date</div>
  //         <div class="col-md-3">Payment Mode</div>
  //         <div class="col-md-3">Transaction Id</div>
  //         <div class="col-md-3">Total</div>
  //     </div>
  // </div>

  // <div class="row mt-4">
  //     <div class="col-md-12 text-right font-weight-bold">Balance</div>
  // </div>`;
  const mailBodyContent = `<div style="width: 100%; font-family: Arial, sans-serif;">
<div>
  <h4 className="text-muted">Dear ${
    Modaldata?.Customer_Id?.Organization_Name
  },</h4>
  <div class=''>
    <p>I hope this mail finds you well. We are excited to continue our business relationship with your esteemed company.</p>
    
    <table style="border: 0.5px solid #f5f7fa; border-collapse: collapse; width: 85%;">
    <thead style="background-color: #f5f7fa; color: #00bfff;">
      <tr>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Item Name</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">UOM</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Requested Quantity</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Unit Price</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Sub Total</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Tax</th>
        <th style="border: 1px solid black; padding: 8px; text-align: left;">Final Amount</th>
      </tr>
    </thead>
    <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">Additional User Licence</td>
            <td style="border: 1px solid black; padding: 8px;">Nos</td>
            <td style="border: 1px solid black; padding: 8px;text-align: right;">${
              Modaldata?.Addtionalusers
            }</td>
            <td style="border: 1px solid black; padding: 8px;text-align: right;">${
              Modaldata?.Plan_Id?.UnitPrice
            }.00</td>
            <td style="border: 1px solid black; padding: 8px;text-align: right;">${
              Number(Modaldata?.Addtionalusers) *
              Number(Modaldata?.Plan_Id?.UnitPrice)
            }</td>
            <td style="border: 1px solid black; padding: 8px;text-align: right;">${
              ((Number(Modaldata?.Addtionalusers) *
                Number(Modaldata?.Plan_Id?.UnitPrice)) /
                Number(Modaldata?.Subscription_Id?.TaxAmount)) *
              100
            }</td>
            <td style="border: 1px solid black; padding: 8px;text-align: right;">${
              ((Number(Modaldata?.Addtionalusers) *
                Number(Modaldata?.Plan_Id?.UnitPrice)) /
                Number(Modaldata?.Subscription_Id?.TaxAmount)) *
                100 +
              (Number(Modaldata?.Addtionalusers) /
                Number(Modaldata?.Plan_Id?.UnitPrice)) *
                100
            }</td>
            </tr>
    </tbody>
    </table>
  <br/>
    <p>Please find attached the detailed Invoice document with all the necessary information. Kindly review the order details to ensure its accuracy. If there are any discrepancies or adjustments needed, please notify us at your earliest convenience </p>
    <div>

                <h3>
                To view Invoice Details, please click the following URL: 
                <a href='https://backend.crmfarm.in${selectedFiles}'>
                <button type='button' style='color: #000000; border: 1px #00bfff; border-radius: 4px; padding: 8px 16px; margin-right: 5px; cursor: pointer; text-decoration: none;'>Invoice Details
                </button>
                </a>
                </h3>
    </div>
  <br/>
  <p>
    If you have any questions or require further
    information, please do not hesitate to contact us.
  </p>
  <br/>

  <h5>Best Regards,</h5>
  <p>Admin</p>
  <p>CRMFarm,</p>
  <p>Chennai</p>
  </div>
</div>
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
      subject: "Invoice On Change Plan",
      // "Recipients":[Modaldata?.Customer_Id?.Customer_Email],
      Recipients: ["muthusaran@foyertech.com"],
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
        toast.success("Mail Sent successfully");
        console.log("setSelectedFiles data:", selectedFiles);
      });

    //   }
  };

  const handleClickPrint = async () => {
    // alert("hi")
    const contentElement = reportTemplateRef.current;

    const canvas = await html2canvas(contentElement, { scale: 2 });
    const imageData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF({
      unit: "px",
      format: "a4",
      orientation: "portrait",
    });

    const imgProps = pdf.getImageProperties(imageData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imageData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    const customFilename = `${Modaldata?.Invoice_Id?.Invoice_Id}.pdf`;
    
    const blobUrl = URL.createObjectURL(pdf.output("blob"));
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
      Urls: "http://backend.crmfarm.in",
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
        setSelectedFiles(res?.data?.File);
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
                <Div sx={{ mt: 3, fontSize: "14px" }}>Invoice To</Div>
                <Div sx={{ fontSize: "14px" }}>
                  {Modaldata?.Customer_Id?.Organization_Name}
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {Modaldata?.Customer_Id?.Address?.Street_Name}
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {" "}
                  {Modaldata?.Customer_Id?.Address?.Area_Name},{" "}
                  {Modaldata?.Customer_Id?.Location} 600100{" "}
                </Div>
                <Div sx={[FontStyle, { mt: 1 }]}>
                  {" "}
                  {Modaldata?.Customer_Id?.State}
                </Div>

                <Div sx={[FontStyle, { mt: 3 }]}>
                  {" "}
                  GST NO {Modaldata?.Customer_Id?.GST_No}
                </Div>
              </Div>
              <Div sx={{ fontWeight: 700 }}>
                <Div sx={{ mt: 3, fontSize: "14px" }}>Item Description</Div>
                <Div sx={{ mt: 3 }}>CRM Professional</Div>
                <Div sx={{ mt: 1, color: "blue" }}>
                  Plan:{Modaldata?.Addtionalusers + Modaldata?.Noofusers} User{" "}
                  {Modaldata?.Subscription_Id?.SubscriptionPeriod} days
                </Div>
                <Div sx={{ mt: 1 }}>
                  {Modaldata?.Subscription_Id?.SubscriptionDate} to {DueDate}
                </Div>
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

        {/* <Grid
          container
          cloumns={12}
          sx={{ fontWeight: 700, ml: 5, fontSize: "14px" }}
        >
          <Grid  sx={[FontStyle]} item xs={12} xl={3}>
            Date
          </Grid>

          <Grid sx={[FontStyle]}  item xs={12} xl={3}>
            Payment Mode
          </Grid>

          <Grid sx={[FontStyle]}  item xs={12} xl={3}>
            Transaction Id
          </Grid>

          <Grid sx={[FontStyle]}  item xs={12} xl={3}>
            Total
          </Grid>

        </Grid> */}

        <JumboScrollbar
          autoHeight={true}
          autoHideTimeout={4000}
          autoHeightMax={"200px"}
          autoHide={true}
          hideTracksWhenNotNeeded
          id="no-more-tables"
        >
          {/*------------------------------------ Table code start from here---------------------------------------- */}
          <Table className="table" sx={{ mt: 2 }}>
            <TableHead sx={[CRMTableHead, FontStyle]}>
              <CRMTableRow>
                <CRMTableCell
                  className="table-headtext"
                  sx={{ fontWeight: 600 }}
                >
                  Date
                </CRMTableCell>
                <CRMTableCell
                  className="table-headtext"
                  sx={{ fontWeight: 600 }}
                >
                  Payment Mode
                </CRMTableCell>
                <CRMTableCell
                  className="table-headtext"
                  sx={{ fontWeight: 600 }}
                >
                  Transaction Id
                </CRMTableCell>
                <CRMTableCell
                  className="table-headtext"
                  sx={{ fontWeight: 600 }}
                >
                  Total
                </CRMTableCell>
              </CRMTableRow>
            </TableHead>
            <TableBody>
              {invoiceProduct?.length > 0 &&
                invoiceProduct?.map((data, index) => (
                  <CRMTableRow>
                    <CRMTableCell className="table-body" data-title="Date">
                      {data?.Licensereqid}
                    </CRMTableCell>

                    <CRMTableCell
                      className="table-body"
                      data-title="Payment Mode"
                    >
                      {data?.RequestDate}
                    </CRMTableCell>

                    <CRMTableCell
                      className="table-body"
                      data-title="Transaction Id"
                    >
                      {data.Customername}
                    </CRMTableCell>
                    <CRMTableCell className="table-body" data-title="Total">
                      {data.Planname}
                    </CRMTableCell>
                  </CRMTableRow>
                ))}
            </TableBody>
          </Table>
        </JumboScrollbar>
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

      {/*--------------------------------send mail and cancel Button------------------------------------------*/}
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

export default ChangeplanInvoice;
