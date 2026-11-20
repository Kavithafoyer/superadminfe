import Div from "@jumbo/shared/Div";
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Grow,
  IconButton,
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  DialogActions,
  Divider,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  ComponentHeadingINV,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  FontStyleINV,
  InvoiceA4,
  generateRandomColor,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import React, { memo, useEffect, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import {
  CustomButton,
  formatIndianNumber,
  toLocaleCurrency,
} from "app/pages/widgets/StylesComponents";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import numberToWords from "number-to-words";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { capitalizeFirstLetter } from "devextreme-react/cjs/core/helpers";
import logo from "app/assets/images/Part_1.png";

function SubscriptionInvoice({
  openInvoice,
  datas,
  setOpenInvoice,
  Buttons = true,
  reportTemplateRef: propRef,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [organizationData, setorganisation] = useState({});
  const [pdfname, setpdfname] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const localRef = useRef(null);
  const reportTemplateRef = propRef || localRef;

  console.log("subscriptiondatas", datas);

  useEffect(() => {
    const customerId = datas?.Customer_Id?.id || datas?.Customer_Id;
    if (customerId && customerId !== "undefined") {
      axios
        .get(`${BASE_URL}/superadmin/AccountCRUD/?id=${customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          if (res.data?.results?.length > 0) {
            setCustomerDetails(res.data.results[0]);
          } else if (res.data && !res.data.results) {
            setCustomerDetails(res.data);
          }
        })
        .catch((err) => console.log("Error fetching customer details", err));
    }
  }, [datas]);

  // get datas
  const token = localStorage.getItem("accesstoken");
  const UserId = localStorage.getItem("UserId");
  const item = "crmuseradmin1";

  const header = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const handleDownload = useReactToPrint({
    content: () => reportTemplateRef?.current,
    documentTitle: `Customer Report ${new Date().toJSON().slice(0, 10)}`,
    onPrintError: (error) => console.log("error", error),
    pageStyle: `
            @page {
              size: A4 portrait;
              margin: 0;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `,
    removeAfterPrint: true, // Remove content after printing
  });

  const sendInvoiceMail = async (type) => {
    setLoading(true);
    try {
      const contentElement = reportTemplateRef.current;

      const canvas = await html2canvas(contentElement);
      const imageData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("portrait", "mm", "a4");
      const a4Width = 210;
      const a4Height = 297;
      const margin = 10;

      // Create an Image object to get the natural dimensions
      const img = new Image();
      img.src = imageData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Calculate aspect ratio
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspectRatio = imgWidth / imgHeight;

      // Calculate dimensions to fit within A4 while preserving aspect ratio
      let newWidth = a4Width - margin * 2;
      let newHeight = newWidth / imgAspectRatio;

      if (newHeight > a4Height - margin * 2) {
        newHeight = a4Height - margin * 2;
        newWidth = newHeight * imgAspectRatio;
      }

      // Add the image to the PDF
      pdf.addImage(imageData, "JPEG", margin, margin, newWidth, newHeight);

      const customFilename = `${generateRandomColor()}${generateRandomColor()}${pdfname}.pdf`;

      // Convert the PDF to base64
      const base64Data = pdf.output("datauristring").split(",")[1];

      const payload = {
        File: base64Data,
        FileName: customFilename,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Urls: "null",
        Description: "Test File",
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };

      const response = await axios.post(
        `${BASE_URL}/superadmin/UserFilesandUrlsCRUD/`,
        payload,
        header,
      );

      console.log("Uploaded PDF:", response.data);

      setSelectedFiles(response.data);

      // Send email with the generated PDF attached
      await MailSendFun(response.data);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("An error occurred while sending the email:", error);
        toast.error(`${error}`);
      }
      setLoading(false);
    }
  };

  const mailBodyContent = async (selectedFiles) => {
    console.log("mailBodyContent selectedFiles", selectedFiles);
    return `<div style="width: 100%; font-family: Arial, sans-serif;">
  <div>
    <h4 className="text-muted">Dear Sir,</h4>
    <div class='card-text'>
    <p>I hope this mail finds you well. I am writing to request a invoice for our organization for the following Subscription.</p>
    <br />
    <div class='card-text'>
    <p><strong>Customer Details:</strong></p>
    <ul>
      <li><strong>Customer Name:</strong> ${
        datas?.Customer_Id?.Contact_Name
      }</li>
      <li><strong>Organization Name:</strong>${
        datas?.Customer_Id?.Organization_Name || "-"
      }</li>
      <li><strong>Total Amount:</strong> ₹${datas?.NetAmount}</li>
    </ul>
    
  </div>
 
  <br/>

  <p>Click the button to download the attachment</p>
      <ul>
      <div  style="margin:10px 0;">
       <li><strong>File Name :</strong>${selectedFiles?.FileName}</li>
        <a href="${BASE_URL}${selectedFiles?.File}" download=${
          selectedFiles?.File
        } target="_blank">
          <Button>
            Download
          </Button>
        </a>
      </div>

      <li><strong>Terms & Condition:</strong>${datas?.Payment_Terms || "-"}</li>
     
      </ul>
      <br/>
      <p>We appreciate your consideration of Foyer as your subscription provider. We look forward to the possibility of
       working with you and meeting your [subscription] needs.</p>
       <br/>
     
      <p>Best Regards,</p>
      <p>${localStorage.getItem("Username")},</p>
    </div>
  </div>
  </div>`;
  };

  const MailSendFun = async (PDF_URL_Res) => {
    try {
      console.log("selectedFiles in Mailsendfun", selectedFiles);
      const payload = {
        Created_By: parseInt(localStorage.getItem("UserId")),
        To: datas?.Customer_Id?.Mail,
        mailsubject: `Subscription ${datas?.id}`, // Use template literals for string interpolation
        Body: await mailBodyContent(PDF_URL_Res),
        filename: generateRandomColor() + PDF_URL_Res?.FileName,
      };

      console.log("mailpayload", payload);

      const response = await axios.post(
        `${BASE_URL}/superadmin/QuotationMailSending/`,
        payload,
        header,
      );

      if (response) {
        toast.success("Mail Sent Successfully");
        setLoading(false);
        setOpenInvoice(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        console.error("An error occurred while sending the email:", error);
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
      setLoading(false);
    }
  };

  const organization = async (sub, item, type) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/useradmin/CRMorganizationCRUD/?id=${localStorage.getItem(
          "OrganizationId",
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      if (res.data) {
        setorganisation(res.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    organization();
  }, []);

  return (
    <DialogContent sx={{ background: "#FFFFFF", p: "0px", overflow: "hidden" }}>
      <Card
        sx={{
          borderRadius: "5px",
          p: 1,
          maxHeight: "calc(100vh - 120px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Scaling wrapper: shrinks content visually for preview; print resets it */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box
            ref={reportTemplateRef}
            sx={{
              ...InvoiceA4,
              height: "297mm",
              transform: "scale(0.85)",
              transformOrigin: "top center",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              "@media print": {
                ...(InvoiceA4["@media print"] || {}),
                transform: "none !important",
                margin: "0 !important",
              },
            }}
          >
            {/* 1. Header Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 8,
              }}
            >
              <Box>
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "140px",
                    height: "auto",
                    marginBottom: "8px",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#333" }}
                >
                  {(
                    datas?.Organization_Id?.Organization_Name ||
                    organizationData?.Organization_Name
                  )?.toUpperCase()}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#777", display: "block" }}
                >
                  {organizationData?.Organization_Address?.Building_Name},{" "}
                  {organizationData?.Organization_Address?.Building_Street}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "#333",
                    letterSpacing: "-1px",
                    mb: 0,
                  }}
                >
                  INVOICE
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#777", fontWeight: 600 }}
                >
                  #{datas?.Invoice_Id || "-"}
                </Typography>
              </Box>
            </Box>

            {/* 2. Billing & Invoice Info */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 8 }}
            >
              <Box sx={{ width: "45%" }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "14px",
                    color: "#333",
                    mb: 1.5,
                  }}
                >
                  INVOICE TO:
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: "16px", mb: 0.5 }}>
                  {customerDetails?.Organization_Name ||
                    customerDetails?.Company_Name ||
                    datas?.Customer_Id?.Organization_Name ||
                    datas?.Customer_Id?.Company_Name ||
                    datas?.Customer_Name ||
                    datas?.Customername ||
                    "-"}
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "#555", fontWeight: 600 }}
                >
                  {customerDetails?.Contact_Name ||
                    datas?.Customer_Id?.Contact_Name ||
                    datas?.Contact_Name ||
                    ""}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#777", mt: 0.5 }}>
                  {[
                    customerDetails?.Address?.BuildingDoorNo,
                    customerDetails?.Address?.StreetName ||
                      customerDetails?.Address?.Street ||
                      customerDetails?.Address?.Street_Name ||
                      (typeof customerDetails?.Address === "string"
                        ? customerDetails?.Address
                        : ""),
                    datas?.Customer_Id?.Address?.BuildingDoorNo,
                    datas?.Customer_Id?.Address?.StreetName ||
                      datas?.Customer_Id?.Address?.Street ||
                      datas?.Customer_Id?.Address?.Street_Name ||
                      (typeof datas?.Customer_Id?.Address === "string"
                        ? datas?.Customer_Id?.Address
                        : ""),
                    customerDetails?.Address?.AreaName ||
                      customerDetails?.Address?.Area ||
                      customerDetails?.Address?.Area_Name ||
                      datas?.Customer_Id?.Address?.AreaName ||
                      datas?.Customer_Id?.Address?.Area ||
                      datas?.Customer_Id?.Address?.Area_Name ||
                      "",
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#777" }}>
                  {[
                    customerDetails?.Location ||
                      datas?.Customer_Id?.Location ||
                      datas?.Location ||
                      "",
                    customerDetails?.Address?.Pincode ||
                      customerDetails?.Pincode ||
                      datas?.Customer_Id?.Address?.Pincode ||
                      datas?.Customer_Id?.Pincode ||
                      "600100",
                  ]
                    .filter(Boolean)
                    .join(" - ")}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "#777" }}>
                  {customerDetails?.State ||
                    datas?.Customer_Id?.State ||
                    datas?.State ||
                    ""}
                </Typography>
                {(customerDetails?.GST_No || datas?.Customer_Id?.GST_No) && (
                  <Typography sx={{ fontSize: "13px", color: "#777" }}>
                    GST NO:{" "}
                    {customerDetails?.GST_No || datas?.Customer_Id?.GST_No}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  width: "40%",
                  bgcolor: "#f2f2f2",
                  p: 0,
                  display: "flex",
                  borderLeft: `6px solid ${Colors?.Mblue}`,
                }}
              >
                <Box sx={{ p: 2, flex: 1 }}>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: "12px", color: "#555" }}
                  >
                    Invoice Number
                  </Typography>
                  <Typography sx={{ fontSize: "13px", mb: 1.5 }}>
                    {datas?.Invoice_Id || "-"}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: "12px", color: "#555" }}
                  >
                    Date Information
                  </Typography>
                  <Typography sx={{ fontSize: "13px" }}>
                    {datas?.Invoice_Date?.split("T")[0] || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* 3. Items Table */}
            <TableContainer
              sx={{ mb: 8, borderRadius: "0px", boxShadow: "none" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: Colors?.Mblue }}>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        py: 1.5,
                        border: "none",
                        width: "60px",
                      }}
                    >
                      NO
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        py: 1.5,
                        border: "none",
                      }}
                    >
                      ITEM DESCRIPTION
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        py: 1.5,
                        border: "none",
                      }}
                      align="right"
                    >
                      PRICE
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        py: 1.5,
                        border: "none",
                      }}
                      align="center"
                    >
                      QTY
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        py: 1.5,
                        border: "none",
                      }}
                      align="right"
                    >
                      TOTAL
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ bgcolor: "#F2F2F2" }}>
                    <TableCell
                      sx={{
                        py: 2,
                        verticalAlign: "top",
                        border: "none",
                        color: "#555",
                        fontWeight: 600,
                      }}
                    >
                      01.
                    </TableCell>
                    <TableCell sx={{ py: 2, border: "none" }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        {datas?.InvoiceFor || "Subscription Service"}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#777", fontWeight: 500 }}
                      >
                        {datas?.Subscription_Id?.Plan_Name ||
                          datas?.Subscription_Id?.Plan_Id_name ||
                          datas?.Plan_Name ||
                          datas?.Plan_Id_name ||
                          "Plan Subscription"}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ py: 2, border: "none", fontWeight: 600 }}
                      align="right"
                    >
                      {toLocaleCurrency(datas?.InvoiceAmount || 0)}
                    </TableCell>
                    <TableCell
                      sx={{ py: 2, border: "none", fontWeight: 600 }}
                      align="center"
                    >
                      {datas?.Quantity || 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2,
                        border: "none",
                        fontWeight: 700,
                        color: "#333",
                      }}
                      align="right"
                    >
                      {toLocaleCurrency(datas?.InvoiceAmount || 0)}
                    </TableCell>
                  </TableRow>
                  {/* Spacing Row */}
                  <TableRow sx={{ height: "20px" }} />
                </TableBody>
              </Table>
            </TableContainer>

            {/* 4. Footer Summary */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ width: "55%" }}>
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: "13px", mb: 1 }}>
                    Payment Method
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#555" }}>
                    Bank Account: {"ABC Bank"}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#555" }}>
                    Bank Fullname: {"ABC Bank"}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#555" }}>
                    Bank Code: {"ABC123"}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "13px", mb: 1 }}>
                    Terms & Condition
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#777",
                      fontStyle: "italic",
                    }}
                  >
                    {datas?.Terms_Condition ||
                      "Subject to Chennai Jurisdiction. Please pay within 7 days."}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: "35%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}
                  >
                    Sub Total:
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "13px" }}>
                    {toLocaleCurrency(datas?.InvoiceAmount || 0)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}
                  >
                    Tax (GST):
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "13px" }}>
                    {toLocaleCurrency(datas?.TaxAmount || 0)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    px: 1,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}
                  >
                    Discount:
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "13px" }}>
                    {toLocaleCurrency(0)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: Colors?.Mblue,
                    color: "#fff",
                    p: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: "15px" }}>
                    Grand Total:
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: "18px" }}>
                    {toLocaleCurrency(datas?.NetAmount || 0)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Box sx={{ textAlign: "center", width: "160px" }}>
                <Box sx={{ borderBottom: "1px solid #ccc", mb: 1, pb: 4 }}>
                  {/* Signature Space */}
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: "14px" }}>
                  {localStorage.getItem("Username") || "Authorized Signatory"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#777" }}>
                  Organization Admin
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "16px",
                    color: Colors?.Mblue,
                    mb: 1,
                  }}
                >
                  Thank you for your business!
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-end",
                    color: "#777",
                  }}
                >
                  <Typography sx={{ fontSize: "11px" }}>
                    {organizationData?.Organization_Mail}
                  </Typography>
                  <Typography sx={{ fontSize: "11px" }}>
                    {
                      organizationData?.Organization_Contact_Number
                        ?.Org_Contact_NO_1
                    }
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* end signature section */}
          </Box>
          {/* end invoice-container (Box ref=reportTemplateRef) */}
        </Box>
        {/* end scaling wrapper */}
        <Divider sx={{ mt: 2 }} />
        {Buttons && (
          <DialogActions sx={{ p: 2 }}>
            <CustomButton
              onClick={() => handleDownload()}
              label="Download"
              Icon="downloadIcon"
              endIcon={true}
              bgColor={"#E1E4E5"}
              textColor={"#000"}
              width={"135px"}
            />
          </DialogActions>
        )}
      </Card>
    </DialogContent>
  );
}

export default SubscriptionInvoice;
