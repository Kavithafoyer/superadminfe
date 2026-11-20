import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableContainer,
  InputAdornment,
  Switch,
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox as MuiCheckbox,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Country } from "country-state-city";
import { toast } from "react-toastify";
import { input_label, CRMTableHead } from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  errorFilter,
  requiredSpan,
} from "app/pages/widgets/StylesComponents";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGetAddonListQuery } from "app/pages/settings/addons/AddonAPI";
import {
  useGetProductDropdownQuery,
  useGetMenuListQuery,
  useGetMenuListByProductQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useLazyGetRolePermissionByRoleIdQuery,
  useUpdateRolePermissionMutation,
  useLazyGetPlanByIdQuery,
} from "app/services/superadmindashboardAPI/superAdminApi";
import { useGetLookupListQuery } from "app/pages/settings/lookup/CreateLookupAPI";

let Plantype = [{ value: "Paid" }, { value: "Free" }, { value: "Trial Plan" }];

const ACTION_COLUMNS = ["create", "edit", "delete", "overview", "import", "export"];

const CreatePlanForm = ({
  setCreatePlan,
  scrollHeight,
  setListPlan,
  getPlanRecords,
  editdatas,
  setEditPlan,
}) => {
  let Countries = Country.getAllCountries();

  const [plantype, setplantype] = useState("");
  const [product, setproduct] = useState("");
  const [planname, setplanname] = useState("");
  const [country, setcountry] = useState("");
  const [code, setcode] = useState("");
  const [noofcontact, setnoofcontact] = useState("");
  const [noofmonth, setnoofmonth] = useState("");
  const [price, setprice] = useState("");
  const [storage, setstorage] = useState("");
  const [noofuser, setnoofuser] = useState("");
  const [fees, setfees] = useState("");
  const [plandetails, setplandetails] = useState("");
  const [trailperiod, settrailperiod] = useState(0);
  const [addonGroups, setAddonGroups] = useState([{ id: Date.now(), featurePrices: {} }]);
  const [isMonthly, setIsMonthly] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [yearlyPrice, setYearlyPrice] = useState("");
  const [isTwoMonthsFree, setIsTwoMonthsFree] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [tempSelectedMenus, setTempSelectedMenus] = useState([]);
  const [tempExpandedModules, setTempExpandedModules] = useState({});
  const [planId, setPlanId] = useState("");
  const [addons, setAddons] = useState([]);
  const [addonInput, setAddonInput] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: addonListData } = useGetAddonListQuery();
  const { data: productListData } = useGetProductDropdownQuery();

  const selectedProductVal = product ? product.toLowerCase() : "";
  const { data: menuFeaturesData, isLoading: isLoadingMenus } = useGetMenuListByProductQuery(
    selectedProductVal,
    { skip: !selectedProductVal }
  );

  const { data: lookupListData } = useGetLookupListQuery();
  const [createPlanMutation] = useCreatePlanMutation();
  const [updatePlanMutation] = useUpdatePlanMutation();
  const [getRolePermissionByRoleId] = useLazyGetRolePermissionByRoleIdQuery();
  const [updateRolePermission] = useUpdateRolePermissionMutation();
  const [getPlanById] = useLazyGetPlanByIdQuery();

  const filteredMenus = useMemo(() => {
    if (!menuFeaturesData) return [];
    if (Array.isArray(menuFeaturesData)) return menuFeaturesData;
    if (Array.isArray(menuFeaturesData.results)) return menuFeaturesData.results;
    if (Array.isArray(menuFeaturesData.data)) return menuFeaturesData.data;
    return [];
  }, [menuFeaturesData]);

  const getParentId = (item) => {
    if (!item || !item.parent) return null;
    if (typeof item.parent === "object") return item.parent.id;
    return item.parent;
  };

  const ACTION_SUFFIXES = ACTION_COLUMNS.map((a) => `.${a}`);
  const isActionMenu = (menu) =>
    ACTION_SUFFIXES.some((suffix) => menu.code?.endsWith(suffix));

  const displayMenus = useMemo(
    () => filteredMenus.filter((m) => !isActionMenu(m)),
    [filteredMenus]
  );

  const actionMenus = useMemo(
    () => filteredMenus.filter((m) => isActionMenu(m)),
    [filteredMenus]
  );

  const topLevelModules = useMemo(
    () => displayMenus.filter((m) => !getParentId(m)),
    [displayMenus]
  );

  const getChildren = (parentId) =>
    displayMenus.filter((m) => getParentId(m) === parentId);

  const getActionFullCodes = (menuId) =>
    actionMenus.filter((a) => getParentId(a) === menuId);

  const uniqueProducts = useMemo(() => {
    const apiProducts = productListData || [];
    const seen = new Set();
    return apiProducts.filter((p) => {
      if (!p || !p.name) return false;
      const lower = p.name.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [productListData]);

  const [featureRows, setFeatureRows] = useState([
    { id: Date.now(), featureId: "", price: "" },
  ]);

  useEffect(() => {
    if (editdatas) {
      setproduct(editdatas?.Product || "");
      setplanname(editdatas?.Plan_Name || "");
      setplantype(editdatas?.Plantype || "");
      setprice(editdatas?.UnitPrice || "");
      setnoofuser(editdatas?.No_Of_Users || "");
      setstorage(editdatas?.AllocatedStorage || "");
      setplandetails(editdatas?.PlanDetails || "");
      setMonthlyPrice(editdatas?.Planmonth_price || "");
      setYearlyPrice(editdatas?.Planyear_price || "");
      setIsMonthly(editdatas?.Plan_per_month || false);
      setIsYearly(editdatas?.Plan_per_year || false);
      setIsTwoMonthsFree(editdatas?.Is_Two_Months_Free || false);
      setcountry(editdatas?.Country || "");
      setcode(editdatas?.Currency_Type || "");
      settrailperiod(editdatas?.Trialperiod || 0);
      // Combine permissions from role_details, Modules, and menu
      const rolePermissions = editdatas?.role_details?.permissions || [];
      const editMenuData = editdatas?.menu || editdatas?.Modules || [];
      const menuPermissions = editMenuData
        .map((mod) => {
          const modId = typeof mod === "object" ? mod?.id : mod;
          return filteredMenus?.find((m) => m.id === modId)?.code;
        })
        .filter(Boolean);
      const combinedPermissions = Array.from(new Set([...rolePermissions, ...menuPermissions]));
      setSelectedMenus(combinedPermissions);

      if (editdatas?.AllocatedAddons && addonListData) {
        const selectedAddons = addonListData.filter((a) =>
          editdatas.AllocatedAddons.includes(a.id)
        );
        setAddons(selectedAddons);
      }
      if (editdatas?.Plan_price) {
        const rows = editdatas.Plan_price.map((p) => ({
          id: Math.random(),
          featureId: p.feature_name || "",
          price: p.price,
        }));
        setFeatureRows(
          rows.length > 0 ? rows : [{ id: Date.now(), featureId: "", price: "" }]
        );
      }
    }
  }, [editdatas, addonListData, lookupListData, filteredMenus]);

  const handleClickBack = () => {
    setplantype(""); setproduct(""); setplanname(""); setPlanId("");
    setcountry(""); setcode(""); setnoofcontact(""); setnoofmonth("");
    setprice(""); setstorage(""); setnoofuser(""); setplandetails("");
    setAddonGroups([{ id: Date.now(), featurePrices: {} }]);
    setFeatureRows([{ id: Date.now(), featureId: "", price: "" }]);
    setMonthlyPrice(""); setYearlyPrice(""); setIsTwoMonthsFree(false);
    setSelectedMenus([]); setExpandedModules({}); setAddons([]);
    if (editdatas) { setEditPlan(false); } else { setCreatePlan(false); }
    setListPlan(true);
  };

  const handleSavePlan = () => {
    let error = errorFilter({ planname, storage, noofuser, product, plantype });
    if (plantype !== "Free" && (!price || price <= 0)) {
      error.price = "Price is required for paid plans";
    }
    if (addons.length === 0) { error.addons = "At least one addon is required"; }
    if (!monthlyPrice && !yearlyPrice) { error.billing = "Enter at least one price (Monthly or Yearly)"; }
    setErrors(error);
    if (Object.keys(error)?.length > 0) {
      toast.warning(`some fields are empty ${Object.keys(error)?.map((item) => item)}`, { position: "top-right", autoClose: 500 });
    } else {
      const menuIdsSet = new Set();
      selectedMenus.forEach((code) => {
        let current = filteredMenus?.find((m) => m.code === code);
        while (current) {
          if (current.id) {
            menuIdsSet.add(current.id);
          }
          const parentId = getParentId(current);
          current = parentId ? filteredMenus?.find((m) => m.id === parentId) : null;
        }
      });

      let payload = {
        Organization_Id: Number(localStorage.getItem("OrganizationId")),
        Product: product, Plan_Name: planname,
        Plan_price: featureRows.map((row) => ({ feature_name: row.featureId, price: Number(row.price || 0) })).filter((fp) => fp.feature_name),
        Plan_per_month: Number(monthlyPrice) > 0, Plan_per_year: Number(yearlyPrice) > 0,
        Planmonth_price: Number(monthlyPrice || 0), Planyear_price: Number(yearlyPrice || 0),
        Description: plandetails, Noofcontacts: 0, Noofmonths: 0,
        Country: country || null, Currency_Type: code || null,
        UnitPrice: Number(price || monthlyPrice || yearlyPrice || 0),
        Setupfees: 0, Trialperiod: Number(trailperiod || 0),
        Plantype: plantype || null, No_Of_Users: Number(noofuser || 0),
        AllocatedStorage: Number(storage || 0), Addstorage: 0,
        billing_cycle: null, PlanDetails: plandetails,
        Is_Active_Flg: true, Is_Deleted: false, Is_Archived: false,
        Created_By: Number(localStorage.getItem("UserId")),
        Updated_By: Number(localStorage.getItem("UserId")),
        AllocatedAddons: addons.map((a) => a.id),
        menu: Array.from(menuIdsSet),
      };
      if (editdatas) {
        payload.id = editdatas.id;
        updatePlanMutation(payload).unwrap()
          .then(async (res) => {
            const roleId = editdatas?.role_details?.id;
            if (roleId) {
              try {
                const permObj = await getRolePermissionByRoleId(roleId).unwrap();
                if (permObj && permObj.id) {
                  await updateRolePermission({ id: permObj.id, permission_codes: selectedMenus }).unwrap();
                }
              } catch (err) { console.error("Failed to update role permissions on plan update", err); }
            }
            toast.success("Plan updated successfully"); handleClickBack(); getPlanRecords();
          }).catch((error) => { toast.error(error?.data?.message || "Something Went Wrong"); });
      } else {
        createPlanMutation(payload).unwrap()
          .then(async (res) => {
            try {
              const fullPlan = await getPlanById(res.id).unwrap();
              const roleId = fullPlan?.role_details?.id;
              if (roleId) {
                const permObj = await getRolePermissionByRoleId(roleId).unwrap();
                if (permObj && permObj.id) {
                  await updateRolePermission({ id: permObj.id, permission_codes: selectedMenus }).unwrap();
                }
              }
            } catch (err) { console.error("Failed to set role permissions on plan creation", err); }
            toast.success("Plan created successfully"); handleClickBack(); getPlanRecords();
          }).catch((error) => { toast.error(error?.data?.message || "Something Went Wrong"); });
      }
    }
  };

  const handleAddFeatureRow = () => {
    setFeatureRows([...featureRows, { id: Date.now(), featureId: "", price: "" }]);
  };
  const handleRemoveFeatureRow = (id) => {
    if (featureRows.length > 1) {
      setFeatureRows(featureRows.filter((r) => r.id !== id));
    } else {
      setFeatureRows([{ id: Date.now(), featureId: "", price: "" }]);
    }
  };
  const handleFeatureRowChange = (id, field, value) => {
    setFeatureRows(featureRows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // ── Permission Table Handlers (operate on TEMP state inside dialog) ─────────
  const handleActionToggle = (actionCode) => {
    setTempSelectedMenus((prev) =>
      prev.includes(actionCode) ? prev.filter((c) => c !== actionCode) : [...prev, actionCode]
    );
  };

  const handleRowToggleAll = (menuId) => {
    const actionFull = getActionFullCodes(menuId);
    const allCodes = actionFull.map((a) => a.code);
    const allChecked = allCodes.every((c) => tempSelectedMenus.includes(c));
    if (allChecked) {
      setTempSelectedMenus((prev) => prev.filter((c) => !allCodes.includes(c)));
    } else {
      setTempSelectedMenus((prev) => [...new Set([...prev, ...allCodes])]);
    }
  };

  const toggleExpand = (menuId) => {
    setTempExpandedModules((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const renderMenuRow = (menu, depth = 0) => {
    const children = getChildren(menu.id);
    const hasChildren = children.length > 0;
    const isExpanded = tempExpandedModules[menu.id] !== false;
    const actionFull = getActionFullCodes(menu.id);
    const allCodes = actionFull.map((a) => a.code);
    const allChecked = allCodes.length > 0 && allCodes.every((c) => tempSelectedMenus.includes(c));
    const someChecked = allCodes.some((c) => tempSelectedMenus.includes(c));

    return (
      <React.Fragment key={menu.id}>
        <TableRow
          sx={{
            backgroundColor: depth === 0 ? "#eef1fb" : depth === 1 ? "#f6f8fd" : "white",
            "&:hover": { backgroundColor: depth === 0 ? "#dce4f5" : "#eef1fb" },
          }}
        >
          <TableCell sx={{ py: 0.6, borderBottom: "1px solid #e8e8e8" }}>
            <Box sx={{ display: "flex", alignItems: "center", pl: depth * 2.5 }}>
              {hasChildren ? (
                <IconButton size="small" onClick={() => toggleExpand(menu.id)} sx={{ p: 0, mr: 0.25 }}>
                  {isExpanded
                    ? <ExpandMoreIcon sx={{ fontSize: 18, color: "#555" }} />
                    : <ChevronRightIcon sx={{ fontSize: 18, color: "#555" }} />}
                </IconButton>
              ) : (
                <Box sx={{ width: 22, mr: 0.25 }} />
              )}
              {allCodes.length > 0 && (
                <MuiCheckbox
                  size="small"
                  checked={allChecked}
                  indeterminate={someChecked && !allChecked}
                  onChange={() => handleRowToggleAll(menu.id)}
                  sx={{ p: 0.25, mr: 0.5 }}
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: depth === 0 ? 700 : 500,
                  fontSize: depth === 0 ? "0.85rem" : "0.8rem",
                  color: depth === 0 ? "#1a3c5e" : "#333",
                }}
              >
                {menu.name}
              </Typography>
            </Box>
          </TableCell>
          {ACTION_COLUMNS.map((action) => {
            const actionMenu = actionFull.find((a) => a.code.endsWith(`.${action}`));
            const checked = actionMenu ? tempSelectedMenus.includes(actionMenu.code) : false;
            return (
              <TableCell key={action} align="center" sx={{ py: 0.6, borderBottom: "1px solid #e8e8e8" }}>
                {actionMenu ? (
                  <MuiCheckbox
                    size="small"
                    checked={checked}
                    onChange={() => handleActionToggle(actionMenu.code)}
                    sx={{ p: 0.25 }}
                  />
                ) : (
                  <Typography sx={{ color: "#ddd", fontSize: "0.75rem" }}>-</Typography>
                )}
              </TableCell>
            );
          })}
        </TableRow>
        {hasChildren && isExpanded && children.map((child) => renderMenuRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <>
      <Grid container columns={12} spacing={1} sx={{ padding: 1 }}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Product Name {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className="w-100">
                <Autocomplete
                  className="search-select3 col-12 w-100"
                  options={uniqueProducts}
                  getOptionLabel={(option) => option?.name || ""}
                  value={uniqueProducts.find((item) => item?.name?.toLowerCase() === product?.toLowerCase()) || null}
                  onChange={(event, newvalue) => {
                    setproduct(newvalue?.name?.toLowerCase() || "");
                    setSelectedMenus([]); setExpandedModules({});
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Product" title="Product" />
                  )}
                />
              </FormControl>
              <div className="red">{errors?.product}</div>
            </Grid>

            {/* Menu Features */}
            <Grid item xs={12} md={4}>
              <Typography sx={[input_label, { mt: 1 }]}>Menu Features</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Div sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {product && (
                  <Div
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mt: 1,
                      maxHeight: "100px",
                      overflowY: "auto",
                      border: "1px solid #eee",
                      padding: 0.5,
                      borderRadius: 1,
                      "&::-webkit-scrollbar": { width: "4px" },
                      "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "4px" },
                    }}
                  >
                    {(() => {
                      // Derive unique parent menus (non-action) that have >= 1 action selected
                      const parentMenuIds = new Set(
                        selectedMenus.map((code) => {
                          const actionMenu = filteredMenus?.find((m) => m.code === code);
                          if (!actionMenu) return null;
                          return getParentId(actionMenu);
                        }).filter(Boolean)
                      );
                      const parentMenus = [...parentMenuIds].map((id) =>
                        filteredMenus?.find((m) => m.id === id)
                      ).filter(Boolean);

                      return parentMenus.length > 0 ? (
                        parentMenus.map((menu) => (
                          <Chip
                            key={menu.id}
                            label={menu.name}
                            size="small"
                            onDelete={() => {
                              // Remove all action codes whose parent is this menu
                              setSelectedMenus(selectedMenus.filter((code) => {
                                const actionMenu = filteredMenus?.find((m) => m.code === code);
                                const pId = getParentId(actionMenu);
                                return pId !== menu.id;
                              }));
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" color="textSecondary">No permissions selected</Typography>
                      );
                    })()}
                  </Div>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setTempSelectedMenus([...selectedMenus]);
                    setTempExpandedModules({});
                    setIsMenuDialogOpen(true);
                  }}
                  disabled={!product || !planname}
                  sx={{ width: "fit-content", textTransform: "none" }}
                >
                  Manage Features
                </Button>
                {(!product || !planname) && (
                  <Typography variant="caption" color="error">
                    Please enter Product and Plan name first
                  </Typography>
                )}
              </Div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Plan Type {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className="w-100">
                <Autocomplete
                  className="search-select3 col-12 w-100"
                  options={Plantype}
                  getOptionLabel={(option) => { if (typeof option === "string") return option; return option?.value || ""; }}
                  value={Plantype.find((p) => p.value === plantype) || null}
                  onChange={(event, newValue) => {
                    setplantype(newValue?.value || "");
                    if (newValue?.value === "Free") setprice(0);
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Select Plan Type" />}
                />
              </FormControl>
              <div className="red">{errors?.plantype}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Price {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                value={price} className="w-100 col-12 input-box2" placeholder="Price"
                type="number" disabled={plantype === "Free"} onChange={(e) => setprice(e.target.value)}
              />
              <div className="red">{errors?.price}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Minimum users {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                value={noofuser} className="w-100 col-12 input-box2" id="outlined-basic"
                placeholder="Minimum users" type="number" inputProps={{ min: 0 }} variant="outlined"
                onChange={(e) => { if (e.target.value >= 0) setnoofuser(e.target.value); }}
              />
              <div className="red">{errors?.noofuser}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label, { mt: 1 }]}>Monthly {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                placeholder="Monthly Price" size="small" type="number" className="input-box2"
                sx={{ width: "100%" }} value={monthlyPrice} onChange={(e) => setMonthlyPrice(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">/ monthly</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label, { mt: 1 }]}>Yearly {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                placeholder="Yearly Price" size="small" type="number" className="input-box2"
                sx={{ width: "100%" }} value={yearlyPrice} onChange={(e) => setYearlyPrice(e.target.value)}
                InputProps={{ endAdornment: <InputAdornment position="end">/ yearly</InputAdornment> }}
              />
              <div className="red">{errors?.billing}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label, { mt: 1 }]}>Addons {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className="col-12">
                <Autocomplete
                  multiple limitTags={2} className="search-select3" id="addons-global"
                  options={addonListData || []} disableCloseOnSelect
                  getOptionLabel={(option) => option?.Addon_Name || option?.Name || ""}
                  value={addons} onChange={(event, newValue) => setAddons(newValue)}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}><MuiCheckbox style={{ marginRight: 8 }} checked={selected} />{option.Addon_Name || option.Name}</li>
                  )}
                  renderInput={(params) => <TextField {...params} placeholder="Select Addons" />}
                />
              </FormControl>
              <div className="red">{errors?.addons}</div>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Plan Name {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                value={planname} className="w-100 col-12 input-box2" id="outlined-basic"
                placeholder="Plan Name" variant="outlined" onChange={(e) => setplanname(e.target.value)}
              />
              <div className="red">{errors?.planname}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>Storage {requiredSpan}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                value={storage} className="w-100 col-12 input-box2" id="outlined-basic"
                type="number" inputProps={{ min: 0 }} placeholder="Storage" variant="outlined"
                onChange={(e) => { if (e.target.value >= 0) setstorage(e.target.value); }}
              />
              <div className="red">{errors?.storage}</div>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label, { mt: 1 }]}>Description</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                value={plandetails} id="outlined-basic" variant="outlined"
                multiline rows={4} sx={{ width: "100%" }} onChange={(e) => setplandetails(e.target.value)}
              />
              <Typography sx={{ mt: 1, fontWeight: "bold", fontSize: "14px" }}>
                Total Price:{" "}
                {(
                  Number(monthlyPrice || yearlyPrice || 0) +
                  addons.reduce((sum, a) => sum + Number(a.Price || 0), 0) +
                  featureRows.reduce((sum, r) => sum + Number(r.price || 0), 0)
                ).toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography sx={[input_label]}>2 Months Free</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Switch size="small" checked={isTwoMonthsFree} onChange={(e) => setIsTwoMonthsFree(e.target.checked)} />
            </Grid>
          </Grid>
        </Grid>

        {/* Addons List */}
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 0, ml: 1 }}>Addons List</Typography>
        </Grid>
        <Grid item xs={12}>
          {addonGroups.map((group) => (
            <Div key={group.id}>
              <Grid container spacing={2} columns={12}>
                <Grid item xs={12}>
                  <TableContainer sx={{ maxHeight: "140px" }}>
                    <Table stickyHeader sx={{ minWidth: 400, mt: 0, border: "1px solid #eee", "& .MuiTableCell-head": { backgroundColor: "#f3f3f3" } }}>
                      <TableHead>
                        <TableRow>
                          <CRMTableCell sx={{ fontWeight: "bold" }}>Addon Name</CRMTableCell>
                          <CRMTableCell sx={{ fontWeight: "bold" }}>Price</CRMTableCell>
                          <CRMTableCell sx={{ fontWeight: "bold", width: "50px" }}>Action</CRMTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addons.map((addon) => (
                          <CRMTableRow key={addon.id}>
                            <CRMTableCell>{addon.Addon_Name || addon.Name}</CRMTableCell>
                            <CRMTableCell>{addon.Price}</CRMTableCell>
                            <CRMTableCell align="center">
                              <IconButton onClick={() => setAddons(addons.filter((a) => a.id !== addon.id))} sx={{ color: "red" }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </CRMTableCell>
                          </CRMTableRow>
                        ))}
                        {addons.length === 0 && (
                          <CRMTableRow>
                            <CRMTableCell colSpan={3} align="center" sx={{ color: "gray" }}>No addons selected</CRMTableCell>
                          </CRMTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Div>
          ))}
        </Grid>

        {/* Feature Price List */}
        <Grid item xs={12}>
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", mb: 1, ml: 1 }}>Feature Price List</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer sx={{ mt: 1, maxHeight: "140px" }}>
            <Table stickyHeader sx={{ minWidth: 400, "& .MuiTableCell-root": { padding: "10px 16px" }, "& .MuiTableCell-head": { backgroundColor: "#f3f3f3" } }}>
              <TableHead sx={[CRMTableHead]}>
                <TableRow>
                  <CRMTableCell sx={{ fontWeight: "bold" }}>Feature Name</CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: "bold" }}>Price</CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: "bold", width: "50px" }}>Action</CRMTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featureRows.map((row, index) => (
                  <CRMTableRow key={row.id}>
                    <CRMTableCell>
                      <Autocomplete
                        size="small" className="search-select3"
                        options={
                          lookupListData?.find((l) => l.Lookupname === "Features")
                            ? Object.keys(lookupListData.find((l) => l.Lookupname === "Features").Values || {}).map((key) => ({ id: key, name: key }))
                            : []
                        }
                        getOptionLabel={(option) => option?.name || ""}
                        value={
                          (lookupListData?.find((l) => l.Lookupname === "Features")
                            ? Object.keys(lookupListData.find((l) => l.Lookupname === "Features").Values || {}).map((key) => ({ id: key, name: key }))
                            : []
                          ).find((f) => f.id === row.featureId) || null
                        }
                        onChange={(event, newValue) => handleFeatureRowChange(row.id, "featureId", newValue?.id || "")}
                        renderInput={(params) => <TextField {...params} placeholder="Select Feature" variant="outlined" />}
                      />
                    </CRMTableCell>
                    <CRMTableCell>
                      <TextField
                        size="small" type="number" className="input-box2" placeholder="Price"
                        value={row.price} onChange={(e) => handleFeatureRowChange(row.id, "price", e.target.value)}
                        sx={{ "& .MuiInputBase-input": { padding: "5px 10px" } }}
                      />
                    </CRMTableCell>
                    <CRMTableCell align="center">
                      {index !== 0 && (
                        <IconButton onClick={() => handleRemoveFeatureRow(row.id)} sx={{ color: "red" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </CRMTableCell>
                  </CRMTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography
            onClick={handleAddFeatureRow}
            sx={{ cursor: "pointer", fontWeight: "bold", fontSize: "14px", ml: 2, display: "inline-block", "&:hover": { textDecoration: "underline" } }}
          >
            + add more feature
          </Typography>
        </Grid>

        {plantype === "Trial Plan" && (
          <Grid item xs={12} md={2}>
            <Typography sx={[input_label]}>Trial Period {requiredSpan}</Typography>
          </Grid>
        )}
        {plantype === "Trial Plan" && (
          <Grid item xs={12} md={4}>
            <TextField
              value={trailperiod} className="w-100 col-12 input-box2" id="outlined-basic"
              placeholder="Trial Period" variant="outlined" onChange={(e) => settrailperiod(e.target.value)}
            />
            <div className="red">{errors?.trailperiod}</div>
          </Grid>
        )}
      </Grid>

      <Div sx={{ my: 1, justifyContent: "center", alignItems: "center", display: "flex", gap: 3 }}>
        <CustomButton label={editdatas ? "Update" : "Save"} Icon="saveIcon" onClick={handleSavePlan} />
        <Cancelbutton label="Cancel" onClick={handleClickBack} />
      </Div>

      {/* Menu Features Dialog */}
      <Dialog
        open={isMenuDialogOpen}
        onClose={() => setIsMenuDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#1a3c5e",
            color: "white",
            py: 1.5,
          }}
        >
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
            Module &amp; Form Permissions — {planname || product}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              // Toggle all displayed action menus
              const allActionCodes = actionMenus.map((a) => a.code);
              const allChecked = allActionCodes.every((c) => tempSelectedMenus.includes(c));
              if (allChecked) {
                setTempSelectedMenus([]);
              } else {
                setTempSelectedMenus([...allActionCodes]);
              }
            }}
            sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", textTransform: "none", fontSize: "0.78rem" }}
          >
            {actionMenus.every((a) => tempSelectedMenus.includes(a.code)) && actionMenus.length > 0
              ? "Deselect All"
              : "Select All"}
          </Button>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {isLoadingMenus ? (
            <Typography sx={{ p: 3, color: "gray", fontStyle: "italic" }}>Loading menus...</Typography>
          ) : topLevelModules.length === 0 ? (
            <Typography sx={{ p: 3, color: "gray", fontStyle: "italic" }}>
              No menus configured for this product yet. Go to Add Menu to set up menus.
            </Typography>
          ) : (
            <TableContainer sx={{ maxHeight: "60vh" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700, color: "#1a3c5e", backgroundColor: "#f0f4ff",
                        minWidth: 240, fontSize: "0.82rem", borderBottom: "2px solid #c5cfe8",
                      }}
                    >
                      Module / Form
                    </TableCell>
                    {ACTION_COLUMNS.map((action) => (
                      <TableCell
                        key={action}
                        align="center"
                        sx={{
                          fontWeight: 700, color: "#1a3c5e", backgroundColor: "#f0f4ff",
                          fontSize: "0.82rem", textTransform: "capitalize", minWidth: 80,
                          borderBottom: "2px solid #c5cfe8",
                        }}
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topLevelModules.map((module) => renderMenuRow(module, 0))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
          <Typography variant="caption" sx={{ mr: "auto", color: "gray" }}>
            {tempSelectedMenus.length} permission{tempSelectedMenus.length !== 1 ? "s" : ""} selected
          </Typography>
          <Button onClick={() => setIsMenuDialogOpen(false)} color="secondary" variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSelectedMenus([...tempSelectedMenus]);
              setIsMenuDialogOpen(false);
            }}
            color="primary"
            variant="contained"
            size="small"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePlanForm;
