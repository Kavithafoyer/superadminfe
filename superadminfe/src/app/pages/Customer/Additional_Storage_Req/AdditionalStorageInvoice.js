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
  UploadBtn,
  Colors,
} from "../../widgets/CRMStyles";
import logo from "app/assets/images/Part_1.png";
import { Box } from "@mui/material";

const AdditionalStorageInvoice = ({
  scrollHeight,
  setstorageinvoice,
  setListStorage,
  invoicedatas,
}) => {
  const [selectedFiles, setSelectedFiles] = useState("");
  const reportTemplateRef = useRef(null);

  const [Modaldata, setModaldata] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);

  const handleClickBack = () => {
    setModaldata([]);
    setstorageinvoice(false);
    setListStorage(true);
  };

  useEffect(() => {
    if (invoicedatas != undefined && invoicedatas.length != 0) {
      console.log("invoicedatas", invoicedatas);
      setModaldata(invoicedatas);

      const customerId =
        invoicedatas?.Customer_Id?.id || invoicedatas?.Customer_Id;
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
                        <h3>To view Invoice Details, please click the following URL: <a href="http://139.59.44.185:8000/${selectedFiles}">
                        <button type='button' style='color: #000000; border: 1px #00bfff; border-radius: 4px; padding: 8px 16px; margin-right: 5px; cursor: pointer; text-decoration: none;'>Invoice Details</button></a></h3>

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
                                  Modaldata?.Invoice_Id?.Invoice_Date?.split(
                                    "T",
                                  )[0]
                                }</</div>
                            </div>
                            <div class="col-lg-4 mt-5">
                                <div class="mt-3">Due Date</div>
                                <div class="mt-3">${
                                  Modaldata?.RequestDate
                                }</div>
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
    var payload = {
      subject: "Invoice For Additional Storage",
      Recipients: ["pravinfoyer@gmail.com"],
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
        },
      )
      .then((res) => {
        toast.success("Mail Sent successfully", {
          position: "top-right",
          autoClose: 100,
        });
      });
  };

  const handleClickPrint = async () => {
    const contentElement = reportTemplateRef.current;

    const canvas = await html2canvas(contentElement);
    const imageData = canvas.toDataURL("image/jpeg", 3.0);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(imageData, "JPEG", 10, 10, 190, 277); // Adjust position and dimensions as needed
    const customFilename = `${Modaldata?.Invoice_Id?.Invoice_Id}.pdf`;
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
              style={{ width: "140px", height: "auto", marginBottom: "8px" }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
              {"CRMFARM PVT LTD, CHENNAI"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#777", display: "block" }}
            >
              GREETA TOWERS, Industrial Estate, Perungudi, Chennai, Tamil Nadu
              600096
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
              #{Modaldata?.Invoice_Id?.Invoice_Id || "-"}
            </Typography>
          </Box>
        </Box>

        {/* 2. Billing & Invoice Info */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 8 }}>
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
                Modaldata?.Customer_Id?.Organization_Name ||
                Modaldata?.Customer_Id?.Company_Name ||
                Modaldata?.Customer_Name ||
                Modaldata?.Customername ||
                "-"}
            </Typography>
            <Typography
              sx={{ fontSize: "14px", color: "#555", fontWeight: 600 }}
            >
              {customerDetails?.Contact_Name ||
                Modaldata?.Customer_Id?.Contact_Name ||
                Modaldata?.Contact_Name ||
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
                Modaldata?.Customer_Id?.Address?.BuildingDoorNo,
                Modaldata?.Customer_Id?.Address?.StreetName ||
                  Modaldata?.Customer_Id?.Address?.Street ||
                  Modaldata?.Customer_Id?.Address?.Street_Name ||
                  (typeof Modaldata?.Customer_Id?.Address === "string"
                    ? Modaldata?.Customer_Id?.Address
                    : ""),
                customerDetails?.Address?.AreaName ||
                  customerDetails?.Address?.Area ||
                  customerDetails?.Address?.Area_Name ||
                  Modaldata?.Customer_Id?.Address?.AreaName ||
                  Modaldata?.Customer_Id?.Address?.Area ||
                  Modaldata?.Customer_Id?.Address?.Area_Name ||
                  "",
              ]
                .filter(Boolean)
                .join(", ") || "-"}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#777" }}>
              {[
                customerDetails?.Location ||
                  Modaldata?.Customer_Id?.Location ||
                  Modaldata?.Location ||
                  "",
                customerDetails?.Address?.Pincode ||
                  customerDetails?.Pincode ||
                  Modaldata?.Customer_Id?.Address?.Pincode ||
                  Modaldata?.Customer_Id?.Pincode ||
                  "600100",
              ]
                .filter(Boolean)
                .join(" - ")}
            </Typography>
            <Typography sx={{ fontSize: "13px", color: "#777" }}>
              {customerDetails?.State ||
                Modaldata?.Customer_Id?.State ||
                Modaldata?.State ||
                ""}
            </Typography>
            {(customerDetails?.GST_No || Modaldata?.Customer_Id?.GST_No) && (
              <Typography sx={{ fontSize: "13px", color: "#777" }}>
                GST NO:{" "}
                {customerDetails?.GST_No || Modaldata?.Customer_Id?.GST_No}
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
                {Modaldata?.Invoice_Id?.Invoice_Id || "-"}
              </Typography>
              <Typography
                sx={{ fontWeight: 800, fontSize: "12px", color: "#555" }}
              >
                Date Information
              </Typography>
              <Typography sx={{ fontSize: "13px" }}>
                {Modaldata?.Invoice_Id?.Invoice_Date?.split("T")[0] || "-"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
            Item Description
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            CRM Professional
          </Typography>
          <Typography sx={{ color: "blue", fontSize: "13px" }}>
            Plan: 3 User 3 Month
          </Typography>
          <Typography sx={{ fontSize: "13px" }}>
            04/06/2023 to 06/09/2023
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
          <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}>
            Amount:
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "blue" }}>
            Rs.{Modaldata?.Invoice_Id?.InvoiceAmount}
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
          <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}>
            Tax Amount:
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "blue" }}>
            {Modaldata?.Invoice_Id?.TaxAmount}
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
          <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#555" }}>
            Net Amount:
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "13px", color: "blue" }}>
            {Modaldata?.Invoice_Id?.NetAmount}
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
            mt: 2,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "15px" }}>
            Grand Total:
          </Typography>
          <Typography sx={{ fontWeight: 900, fontSize: "18px" }}>
            Rs.{Modaldata?.Invoice_Id?.InvoiceAmount}
          </Typography>
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
                sales@foyertech.com
              </Typography>
              <Typography sx={{ fontSize: "11px" }}>91 9965808278</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

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

export default AdditionalStorageInvoice;
