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
import React, { useEffect, useRef } from "react";
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
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  FontStyle,
  InvoiceA4,
} from "../../widgets/CRMStyles";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewInvoice = ({
  setListInvoice,
  scrollHeight,
  setCreateInvoice,
  editdatas,
}) => {
  const reportTemplateRef = useRef(null);

  const [Modaldata, setModaldata] = useState([]);

  const handleClickBack = () => {
    setModaldata([]);
    setCreateInvoice(false);
    setListInvoice(true);
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
  };

  useEffect(() => {
    if (editdatas != undefined && editdatas.length != 0) {
      console.log("invoicedatas", editdatas);
      setModaldata(editdatas);
    }
  }, [editdatas]);

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

export default ViewInvoice;
