import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Card,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast } from "react-toastify";
import "../Setting.css";
import { RiArrowDownSFill } from "react-icons/ri";
import { MdPlayArrow } from "react-icons/md";
import { Colors, componentTitle } from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";

const seriesType = ["Automatic", "Manual"];

const TransactionSeries = () => {
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const header = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const [showCreatePage, setShowCreatePage] = useState(true);
  const [showUpdatePage, setShowUpdatePage] = useState(false);
  const [id, setId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSeriesData, setTransactionSeriesData] = useState([]);

  const [contact, setContact] = useState([
    {
      Form_Name: "Contact",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Contact Notes",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Contact Appointment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Contact Activity",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Conatct Mail",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [Account, setAccount] = useState([
    {
      Form_Name: "Account",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Account Notes",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Account Appointment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Account Activity",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Account Mail",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [deal, setDeal] = useState([
    {
      Form_Name: "Deal",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Deal Notes",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Deal Appointment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Deal Activity",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Deal Mail",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [Lead, setLead] = useState([
    {
      Form_Name: "Lead",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Notes",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Appointment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Activity",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Mail",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead from Contacts",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },

    {
      Form_Name: "Lead from Enquiry",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead from Campaign",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Demo",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Lead Qualify Questions",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [sales, setSales] = useState([
    {
      Form_Name: "Product Category",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "ProductItem Group",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "SalesProduct Master",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Product Catague",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Discount Setup",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Product Inward",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },

    {
      Form_Name: "Product ManagePrice",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Product Enquiry",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Product Offer",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "User Sales",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Schedule",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Shipment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Invoice",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Payment",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "User Sales",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [territery, setTerritery] = useState([
    {
      Form_Name: "Territery",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Target",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Sales Person Target",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [worflow, setWorkflow] = useState([
    {
      Form_Name: "WorkFlow",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [notification, setNotification] = useState([
    {
      Form_Name: "Notification",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [task, setTask] = useState([
    {
      Form_Name: "Notification",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [template, setTemplate] = useState([
    {
      Form_Name: "Template",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [auto, setAuto] = useState([
    {
      Form_Name: "Auto Reponse",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const [request, setRequest] = useState([
    {
      Form_Name: "Additional Licence",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "AAdditional Storage",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Addon Purchase",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Cancel Plan",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
    {
      Form_Name: "Plan",
      Type: "",
      Prefix: "",
      Start_Number: "",
      Suffix: "",
    },
  ]);

  const companyId = parseInt(localStorage.getItem("OrganizationId"));

  // get a form list
  const handleGetFormLists = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/useradmin/Formmasterlist/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })

      console.log("responseresponse", response?.data)

      if (response?.data) {
        const filterdata = response?.data?.filter(opt =>
          Array.isArray(opt?.FormId) &&
          opt?.FormId?.length > 0 &&
          opt?.FormId?.some(o => o?.PermissionName?.length > 0)
        );

        const listdata = filterdata?.map(opt => ({
          "Module_Name": opt?.ModuleName,
          "Form_Names": opt?.FormId?.filter(o => o?.PermissionName?.length > 0)
        }));

        const filterlistdata = listdata?.map((opt) => ({
          "Module_Name": opt?.Module_Name,
          "Form_Names": opt?.Form_Names?.map((i) => ({
            "Form_Name": i?.FormName,
            "Type": "",
            "Prefix": "",
            "Start_Number": "",
            "Suffix": ""
          }))
        }))

        setTransactionSeriesData(filterlistdata);
        console.log("responseresponse...", filterlistdata);
      } else {
        setTransactionSeriesData([])
      }
    } catch (error) {
      console.log(error);
    }
  }


  // get a transaction series data
  const getUser = async () => {
    setIsLoading(true);
    try {
      // const response = await axios.get(`${BASE_URL}/useradmin/TransactionbyOrg/?Org_Id=${companyId}`, header)

      // const res = response?.data;
      const res = {};

      var Id = res?.Created_By;
      if (Id === 0) {
        setShowCreatePage(true);
        setShowUpdatePage(false);
      } else {
        setShowCreatePage(false);
        setShowUpdatePage(true);

        setId(res?.Transactionalseries_Id);

        setTransactionSeriesData([
          res?.Contact,
          // res?.Contact_Meeting,
          // res?.Contact_Activities,
          // res?.Contact_Notes,
          // res?.UserMail_Master,

          // res?.Account,
          // res?.Account_Notes,
          // res?.Account_Meeting,
          // res?.Account_MailMaster,
          // res?.Account_Activities,

          // res?.Deal,
          // res?.Deal_Notes,
          // res?.Deal_Meeting,
          // res?.Deal_MailMaster,
          // res?.Deal_Activities,

          // res?.Leads,
          // res?.UserLead_Meeting,
          // res?.UserLeadNotes,
          // res?.UserLeadMail_Master,
          // res?.UserQualified_Activities,
          // res?.UserLeadfrom_contacts,
          // res?.UserLeadfrom_enquiry,
          // res?.UserLeadfrom_Campaign,
          // res?.Lead_Demo,
          // res?.LeadQualify_Questions,

          // res?.Product_Category,
          // res?.ProductItem_Group,
          // res?.SalesProduct_Master,
          // res?.Product_Catague,
          // res?.Discount_Setup,
          // res?.Product_Inward,
          // res?.Product_ManagePrice,
          // res?.Product_Enquiry,
          // res?.Product_Offer,
          // res?.User_Sales,
          // res?.Sales_Schedule,
          // res?.Sales_Shipment,
          // res?.Sales_Invoice,
          // res?.Sales_Payment,

          // res?.Territory_Management,
          // res?.Sales_Target,
          // res?.Sales_PersonTarget,

          // res?.WorkFlow_Rule,

          // res?.Notification_Id,

          // res?.NewTask_Managemnt,
        ])


        setContact([
          res?.Contact,
          res?.Contact_Meeting,
          res?.Contact_Activities,
          res?.Contact_Notes,
          res?.UserMail_Master,
        ]);

        setAccount([
          res?.Account,
          res?.Account_Notes,
          res?.Account_Meeting,
          res?.Account_MailMaster,
          res?.Account_Activities,
        ]);

        setDeal([
          res?.Deal,
          res?.Deal_Notes,
          res?.Deal_Meeting,
          res?.Deal_MailMaster,
          res?.Deal_Activities,
        ]);

        setLead([
          res?.Leads,
          res?.UserLead_Meeting,
          res?.UserLeadNotes,
          res?.UserLeadMail_Master,
          res?.UserQualified_Activities,
          res?.UserLeadfrom_contacts,
          res?.UserLeadfrom_enquiry,
          res?.UserLeadfrom_Campaign,
          res?.Lead_Demo,
          res?.LeadQualify_Questions,
        ]);

        setSales([
          res?.Product_Category,
          res?.ProductItem_Group,
          res?.SalesProduct_Master,
          res?.Product_Catague,
          res?.Discount_Setup,
          res?.Product_Inward,
          res?.Product_ManagePrice,
          res?.Product_Enquiry,
          res?.Product_Offer,
          res?.User_Sales,
          res?.Sales_Schedule,
          res?.Sales_Shipment,
          res?.Sales_Invoice,
          res?.Sales_Payment,
        ]);

        setTerritery([
          res?.Territory_Management,
          res?.Sales_Target,
          res?.Sales_PersonTarget,
        ]);
        setWorkflow([res?.WorkFlow_Rule]);
        setNotification([res?.Notification_Id]);
        setTask([res?.NewTask_Managemnt]);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  // Call getUser when the component mounts
  useEffect(() => {
    getUser();
    handleGetFormLists();
  }, []);

  const handleSubmitTransactionSeries = (e) => {
    e.preventDefault();
    if (!id) {
      var payload = {
        Purchase_Request: contact[0],
        Purchase_Order: contact[1],
        RFQ: contact[2],
        Supplier_Quotation: contact[3],
        Purchase_Catalouge: contact[4],
        Supplier: contact[5],
        PO_Amendment: contact[6],
        PO_Cancelation: contact[7],
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };
      axios
        .post(`${BASE_URL}/useradmin/TransactionalseriesCRUD/`, payload, header)
        .then((res) => {
          if (res?.data?.id && res?.status === 201) {
            toast.success("Created Successfully");
            setId(res?.data?.Transactionalseries_Id);
          } else {
            toast.error("Enter valid Transaction Series details");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    } else {
      var payload = {
        Transactionalseries_Id: id,

        Purchase_Request: contact[0],
        Purchase_Order: contact[1],
        RFQ: contact[2],
        Supplier_Quotation: contact[3],
        Purchase_Catalouge: contact[4],
        Supplier: contact[5],
        PO_Amendment: contact[6],
        PO_Cancelation: contact[7],
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };
      axios.put(`${BASE_URL}/useradmin/TransactionalseriesCRUD/`, payload, header)
        .then((res) => {
          if (res?.data?.id) {
            toast.success("Updated Successfully");
          } else {
            toast.error("Enter valid Transaction Series details");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    }
  };

  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expanded4, setExpanded4] = useState(false);
  const [expanded5, setExpanded5] = useState(false);
  const [expanded6, setExpanded6] = useState(false);
  const [expanded7, setExpanded7] = useState(false);
  const [expanded8, setExpanded8] = useState(false);
  const [expanded9, setExpanded9] = useState(false);
  const [expanded10, setExpanded10] = useState(false);
  const [expanded11, setExpanded11] = useState(false);
  const [expanded12, setExpanded12] = useState(false);

  const [expanded, setExpanded] = useState(null);

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null);
  };

  const handleExpand1 = () => {
    setExpanded1(!expanded1);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand2 = () => {
    setExpanded1(false);
    setExpanded2(!expanded2);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand3 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(!expanded3);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand4 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(!expanded4);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand5 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(!expanded5);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand6 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(!expanded6);
    setExpanded7(false);
    setExpanded8(false);
  };
  const handleExpand7 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(!expanded7);
    setExpanded8(false);
  };

  const handleExpand8 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(!expanded8);
  };

  const handleExpand9 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
    setExpanded9(!expanded9);
  };

  const handleExpand10 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
    setExpanded9(false);
    setExpanded10(!expanded10);
  };

  const handleExpand11 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
    setExpanded9(false);
    setExpanded10(false);
    setExpanded11(!expanded11);
  };

  const handleExpand12 = () => {
    setExpanded1(false);
    setExpanded2(false);
    setExpanded3(false);
    setExpanded4(false);
    setExpanded5(false);
    setExpanded6(false);
    setExpanded7(false);
    setExpanded8(false);
    setExpanded9(false);
    setExpanded10(false);
    setExpanded11(false);
    setExpanded12(!expanded12);
  };

  const handleChangeContact = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...notification,
      ...task.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);

    const updatedPurchase = contact?.map((purchase, i) => {
      if (i !== index) {
        return purchase;
      }

      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...purchase, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        if (newValue === "Automatic") {
          return { ...purchase, [fieldName]: newValue };
        } else {
          return {
            ...purchase,
            [fieldName]: newValue,
            ["Prefix"]: "",
            ["Start_Number"]: "",
            ["Suffix"]: "",
          };
        }
      }

      return { ...purchase, [e.target.name]: e.target.value };
    });

    setContact(updatedPurchase);
    console.log("updatedPurchase", updatedPurchase);
  };

  const handleChangeAccount = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...notification,
      ...task.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedInventory = Account?.map((inventory, i) => {
      if (i !== index) {
        return inventory;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...inventory, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...inventory, [fieldName]: newValue };
      }

      return { ...inventory, [e.target.name]: e.target.value };
    });

    setAccount(updatedInventory);
    console.log("updatedInventory", updatedInventory);
  };

  const handleChangeDeal = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...notification,
      ...task.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);

    const updatedBudget = deal?.map((budget, i) => {
      if (i !== index) {
        return budget;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...budget, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...budget, [fieldName]: newValue };
      }

      return { ...budget, [e.target.name]: e.target.value };
    });

    setDeal(updatedBudget);
    console.log("updatedBudget", updatedBudget);
  };

  const handleChangeSales = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...task,

      ...notification.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedSales = Lead?.map((sale, i) => {
      if (i !== index) {
        return sale;
      }

      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...sale, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...sale, [fieldName]: newValue };
      }

      return { ...sale, [e.target.name]: e.target.value };
    });

    setLead(updatedSales);
    console.log("updatedSales", updatedSales);
  };

  const handleChangeTerritery = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...notification,
      ...task.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedService = territery?.map((service, i) => {
      if (i !== index) {
        return service;
      }

      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...service, [e.target.name]: "" };
      }
      if (fieldName === "Type") {
        return { ...service, [fieldName]: newValue };
      }

      return { ...service, [e.target.name]: e.target.value };
    });

    setTerritery(updatedService);
    console.log("updatedService", updatedService);
  };

  const handleChangeWork = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...task,
      ...notification.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedCRM = worflow?.map((crm, i) => {
      if (i !== index) {
        return crm;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...crm, [e.target.name]: "" };
      }
      if (fieldName === "Type") {
        return { ...crm, [fieldName]: newValue };
      }

      return { ...crm, [e.target.name]: e.target.value };
    });

    setWorkflow(updatedCRM);
    console.log("updatedCRM", updatedCRM);
  };

  const handleChangeNotification = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...task,
      ...notification.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedFinance = notification?.map((finance, i) => {
      if (i !== index) {
        return finance;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...finance, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...finance, [fieldName]: newValue };
      }

      return { ...finance, [e.target.name]: e.target.value };
    });

    setNotification(updatedFinance);
    console.log("updatedFinance", updatedFinance);
  };

  const handleChangeTask = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...task,
      ...notification.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedFinance = task?.map((finance, i) => {
      if (i !== index) {
        return finance;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...finance, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...finance, [fieldName]: newValue };
      }

      return { ...finance, [e.target.name]: e.target.value };
    });

    setTask(updatedFinance);
    console.log("updatedFinance", updatedFinance);
  };

  const handleChangeTemplate = (e, index, fieldName, newValue) => {
    const newArray = [
      ...contact,
      ...Account,
      ...deal,
      ...Lead,
      ...sales,
      ...territery,
      ...worflow,
      ...task,
      ...notification.flat((item) => item.Prefix),
    ];
    console.log("newArray", newArray);
    const updatedFinance = task?.map((finance, i) => {
      if (i !== index) {
        return finance;
      }
      const prefixExists = newArray?.some(
        (item, i) => i !== index && item.Prefix === e.target.value
      );

      if (prefixExists) {
        toast.error(`Prefix "${e.target.value}" is already Used.`);
        return { ...finance, [e.target.name]: "" };
      }

      if (fieldName === "Type") {
        return { ...finance, [fieldName]: newValue };
      }

      return { ...finance, [e.target.name]: e.target.value };
    });

    setTask(updatedFinance);
    console.log("updatedFinance", updatedFinance);
  };



  return (
    <>
      <JumboContentLayoutMain>
        <Typography
          sx={[componentTitle, { color: Colors?.gray, fontWeight: 500 }]}
        >
          Transaction Series
        </Typography>

        {isLoading ? (
          <div className="loader1">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmitTransactionSeries}>
            {/* Contact */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded1}>
                <AccordionSummary
                  expandIcon={
                    expanded1 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand1()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded1 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Contact Management
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#828282",
                        backgroundColor: "#F3F3F3",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Contact */}
                    {contact?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeContact(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeContact(e, index)}
                              inputProps={{
                                maxLength: 2,
                                title: "Please enter a maximum of 2 digits",
                                style: { textTransform: "uppercase" },
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeContact(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeContact(e, index)}
                              inputProps={{
                                maxLength: 5,
                                title: "Please enter a maximum of 5 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Account */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded2}>
                <AccordionSummary
                  expandIcon={
                    expanded2 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand2()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded2 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Account Management
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* inventory */}
                    {Account?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeAccount(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeAccount(e, index)}
                              inputProps={{
                                maxLength: 2,
                                title: "Please enter a maximum of 2 digits",
                                style: { textTransform: "uppercase" },
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeAccount(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeAccount(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* deal */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded3}>
                <AccordionSummary
                  expandIcon={
                    expanded3 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand3()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded3 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Deal Management
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Deal */}
                    {deal?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeDeal(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeDeal(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeDeal(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeDeal(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* lead */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded4}>
                <AccordionSummary
                  expandIcon={
                    expanded4 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand4()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded4 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Lead Management
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Sales */}
                    {Lead?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeSales(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Sales */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded5}>
                <AccordionSummary
                  expandIcon={
                    expanded5 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand5()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded5 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Sales
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Sales */}
                    {sales?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeSales(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeSales(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Territery */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded6}>
                <AccordionSummary
                  expandIcon={
                    expanded6 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand6()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded6 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Territery
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {territery?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeTerritery(
                                  e,
                                  index,
                                  "Type",
                                  newValue
                                )
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeTerritery(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeTerritery(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeTerritery(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Wrok Flow */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded7}>
                <AccordionSummary
                  expandIcon={
                    expanded7 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand7()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded7 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Work Flow
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* CRM */}
                    {worflow?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeWork(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeWork(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeWork(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeWork(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Notification */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded8}>
                <AccordionSummary
                  expandIcon={
                    expanded8 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand8()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded8 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Notification
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Finance */}
                    {notification?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeNotification(
                                  e,
                                  index,
                                  "Type",
                                  newValue
                                )
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) =>
                                handleChangeNotification(e, index)
                              }
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) =>
                                handleChangeNotification(e, index)
                              }
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) =>
                                handleChangeNotification(e, index)
                              }
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Task Management */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded9}>
                <AccordionSummary
                  expandIcon={
                    expanded9 ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />
                  }
                  onClick={() => handleExpand9()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded8 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Task Management
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {task?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeTask(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeTask(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeTask(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeTask(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Templates Management */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded10}>
                <AccordionSummary
                  expandIcon={
                    expanded10 ? (
                      <RiArrowDownSFill size={24} />
                    ) : (
                      <MdPlayArrow />
                    )
                  }
                  onClick={() => handleExpand10()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded10 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Templates
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {template?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeTemplate(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* AutoResponse Management */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded11}>
                <AccordionSummary
                  expandIcon={
                    expanded11 ? (
                      <RiArrowDownSFill size={24} />
                    ) : (
                      <MdPlayArrow />
                    )
                  }
                  onClick={() => setExpanded11()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded11 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Auto Response
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {auto?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeTemplate(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>

            {/* Request Module Management */}
            <Card
              sx={{
                mt: 1,
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 0px #d6dedf",
              }}
            >
              <Accordion expanded={expanded12}>
                <AccordionSummary
                  expandIcon={
                    expanded12 ? (
                      <RiArrowDownSFill size={24} />
                    ) : (
                      <MdPlayArrow />
                    )
                  }
                  onClick={() => setExpanded12()}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  sx={{
                    px: 3,
                    flexDirection: "row",

                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",

                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                    ".MuiAccordionSummary-expandIconWrapper": {
                      borderRadius: 1,
                      border: 1,
                      color: "text.secondary",
                      borderColor: "divider",
                      transform: "none",
                      height: 28,
                      width: 28,
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,

                      "&.Mui-expanded": {
                        transform: "none",
                        color: "primary.main",
                        borderColor: "primary.main",
                      },

                      "& svg": {
                        fontSize: "1rem",
                      },
                    },
                  }}
                >
                  <Div
                    sx={{
                      width: { xs: "auto", lg: "26%" },
                      flexShrink: 0,
                      px: 1,
                      flex: { xs: "1", lg: "0 1 auto" },
                    }}
                  >
                    <Typography
                      variant={"h3"}
                      mt={0.5}
                      sx={{
                        color: expanded12 ? "black" : "#00bfff",
                        fontWeight: 600,
                      }}
                    >
                      Request
                    </Typography>
                  </Div>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    borderTop: 1,
                    borderColor: "divider",
                    p: (theme) => theme.spacing(2, 2, 2, 2),
                  }}
                >
                  <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                    {/* Title */}
                    <Grid
                      container
                      columnSpacing={2}
                      sx={{ mb: 2 }}
                      style={{
                        color: "#00bfff",
                        backgroundColor: "#FFF",
                        padding: "10px 0px",
                        boxShadow: "0px 1px 1px 0px #EBE6EC",
                        position: "sticky",
                        top: -10,
                        zIndex: 100,
                      }}
                    >
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Transaction Name
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Automatic / Manual
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Prefix
                        </Typography>
                      </Grid>
                      <Grid item xl={3}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Start Number
                        </Typography>
                      </Grid>
                      <Grid item xl={2}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                          Suffix
                        </Typography>
                      </Grid>
                    </Grid>

                    {request?.map((item, index) => {
                      return (
                        <Grid container columnSpacing={2}>
                          <Grid item xl={3}>
                            <Typography variant="h4">
                              {item?.Form_Name}
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Autocomplete
                              className="col-12 search-select"
                              name="Type"
                              options={seriesType}
                              getOptionLabel={(option) => option || ""}
                              value={item?.Type || null}
                              onChange={(e, newValue) =>
                                handleChangeTemplate(e, index, "Type", newValue)
                              }
                              isOptionEqualToValue={(option, value) =>
                                option === value || value === ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  name="type"
                                  {...params}
                                  placeholder="Choose (A / M)"
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Prefix"
                              placeholder="Prefix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Prefix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={3}>
                            <TextField
                              className="input-box col-12"
                              name="Start_Number"
                              placeholder="Start Number"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Start_Number}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 3,
                                title: "Please enter a maximum of 3 digits",
                              }}
                            />
                          </Grid>
                          <Grid item xl={2}>
                            <TextField
                              className="input-box col-12"
                              name="Suffix"
                              placeholder="Suffix"
                              disabled={
                                item?.Type === "Automatic" ? false : true
                              }
                              value={item?.Suffix}
                              onChange={(e) => handleChangeTemplate(e, index)}
                              inputProps={{
                                maxLength: 4,
                                title: "Please enter a maximum of 4 digits",
                              }}
                            />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>



            {/* new loop */}
            {/* {transactionSeriesData?.map((opt, ind) => {
              return (
                <Card
                  key={ind}
                  sx={{
                    mt: 1,
                    borderRadius: "5px",
                    boxShadow: "0px 0px 10px 0px #d6dedf",
                  }}
                >
                  <Accordion
                    expanded={expanded === ind}
                    onChange={handleAccordionChange(ind)}
                  >
                    <AccordionSummary
                      expandIcon={expanded === ind ? <RiArrowDownSFill size={24} /> : <MdPlayArrow />}
                      aria-controls={`panel${ind}bh-content`}
                      id={`panel${ind}bh-header`}
                      sx={{
                        px: 3,
                        flexDirection: "row",
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                          "&.Mui-expanded": {
                            margin: "12px 0",
                          },
                        },
                        ".MuiAccordionSummary-expandIconWrapper": {
                          borderRadius: 1,
                          border: 1,
                          color: "text.secondary",
                          borderColor: "divider",
                          transform: "none",
                          height: 28,
                          width: 28,
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1,
                          "&.Mui-expanded": {
                            transform: "none",
                            color: "primary.main",
                            borderColor: "primary.main",
                          },
                          "& svg": {
                            fontSize: "1rem",
                          },
                        },
                      }}
                    >
                      <Div
                        sx={{
                          width: { xs: "auto", lg: "26%" },
                          flexShrink: 0,
                          px: 1,
                          flex: { xs: "1", lg: "0 1 auto" },
                        }}
                      >
                        <Typography
                          variant={"h3"}
                          mt={0.5}
                          sx={{
                            color: expanded12 ? "black" : "#00bfff",
                            fontWeight: 600,
                          }}
                        >
                          {opt?.Module_Name}
                        </Typography>
                      </Div>
                    </AccordionSummary>

                    <AccordionDetails
                      sx={{
                        borderTop: 1,
                        borderColor: "divider",
                        p: (theme) => theme.spacing(2, 2, 2, 2),
                      }}
                    >
                      <Grid container columns={12} rowGap={1} sx={{ p: 2 }}>
                        <Grid
                          container
                          columnSpacing={2}
                          sx={{ mb: 2 }}
                          style={{
                            color: "#00bfff",
                            backgroundColor: "#FFF",
                            padding: "10px 0px",
                            boxShadow: "0px 1px 1px 0px #EBE6EC",
                            position: "sticky",
                            top: -10,
                            zIndex: 100,
                          }}
                        >
                          <Grid item xl={3}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              Transaction Name
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              Automatic / Manual
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              Prefix
                            </Typography>
                          </Grid>
                          <Grid item xl={3}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              Start Number
                            </Typography>
                          </Grid>
                          <Grid item xl={2}>
                            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
                              Suffix
                            </Typography>
                          </Grid>
                        </Grid>

                        {opt?.Form_Names?.map((item, index) => {
                          return (
                            <Grid container columnSpacing={2} key={index}>
                              <Grid item xl={3}>
                                <Typography variant="h4">
                                  {item?.Form_Name}
                                </Typography>
                              </Grid>
                              <Grid item xl={2}>
                                <Autocomplete
                                  className="col-12 search-select"
                                  name="Type"
                                  options={seriesType}
                                  getOptionLabel={(option) => option || ""}
                                  value={item?.Type || null}
                                  onChange={(e, newValue) =>
                                    handleChangeTemplate(e, index, "Type", newValue)
                                  }
                                  isOptionEqualToValue={(option, value) =>
                                    option === value || value === ""
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      name="type"
                                      {...params}
                                      placeholder="Choose (A / M)"
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xl={2}>
                                <TextField
                                  className="input-box col-12"
                                  name="Prefix"
                                  placeholder="Prefix"
                                  disabled={
                                    item?.Type === "Automatic" ? false : true
                                  }
                                  value={item?.Prefix}
                                  onChange={(e) => handleChangeTemplate(e, index)}
                                  inputProps={{
                                    maxLength: 3,
                                    title: "Please enter a maximum of 3 digits",
                                  }}
                                />
                              </Grid>
                              <Grid item xl={3}>
                                <TextField
                                  className="input-box col-12"
                                  name="Start_Number"
                                  placeholder="Start Number"
                                  disabled={
                                    item?.Type === "Automatic" ? false : true
                                  }
                                  value={item?.Start_Number}
                                  onChange={(e) => handleChangeTemplate(e, index)}
                                  inputProps={{
                                    maxLength: 3,
                                    title: "Please enter a maximum of 3 digits",
                                  }}
                                />
                              </Grid>
                              <Grid item xl={2}>
                                <TextField
                                  className="input-box col-12"
                                  name="Suffix"
                                  placeholder="Suffix"
                                  disabled={
                                    item?.Type === "Automatic" ? false : true
                                  }
                                  value={item?.Suffix}
                                  onChange={(e) => handleChangeTemplate(e, index)}
                                  inputProps={{
                                    maxLength: 4,
                                    title: "Please enter a maximum of 4 digits",
                                  }}
                                />
                              </Grid>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              )
            })} */}

            <Div sx={{ mt: 2, mb: 1, textAlign: "right" }}>
              <Grid container align="center" spacing={2}>
                <Grid item align="left" xs={6}>
                  <CustomButton
                    label={id ? "Update" : "Save"}
                    type="submit"
                    Icon="saveIcon"
                  />
                </Grid>
                {/* <Grid item align="left" xs={6}>
                  <Cancelbutton />
                </Grid> */}
              </Grid>
            </Div>
          </form>
        )}
        <br />
      </JumboContentLayoutMain>
    </>
  );
};

export default TransactionSeries;
