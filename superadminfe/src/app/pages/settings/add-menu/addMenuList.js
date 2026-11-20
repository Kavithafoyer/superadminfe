import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Checkbox,
  FormControlLabel,
  Switch,
  Autocomplete,
} from "@mui/material";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdExpandMore,
  MdExpandLess,
  MdFolder,
  MdMenuBook,
  MdSmartButton,
} from "react-icons/md";
import { toast } from "react-toastify";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import Span from "@jumbo/shared/Span";
import { input_label, ComponentHeading } from "app/pages/widgets/CRMStyles";
import { CustomButton, Cancelbutton } from "app/pages/widgets/StylesComponents";
import {
  useGetProductDropdownQuery,
  useGetMenuListByProductQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} from "app/services/superadmindashboardAPI/superAdminApi";

const AVAILABLE_ACTIONS = [
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "overview", label: "Overview" },
  { key: "import", label: "Import" },
  { key: "export", label: "Export" },
];

const sanitizeCodeKey = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_+|_+$)/g, "");
};

const getProductValue = (prod) => {
  if (!prod) return "";
  const name = typeof prod === "object" ? prod.name : prod;
  if (!name) return "";
  const lower = name.toLowerCase();
  if (lower === "itcrm") return "it";
  return lower;
};

export default function AddMenuList() {
  const [product, setProduct] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  // Form State
  const [editId, setEditId] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [moduleKey, setModuleKey] = useState("");
  const [menuType, setMenuType] = useState("module"); // module, submodule, form
  const [parentModule, setParentModule] = useState(null);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Action Permissions Checkbox State
  const [selectedActions, setSelectedActions] = useState({
    create: false,
    edit: false,
    delete: false,
    overview: false,
    import: false,
    export: false,
  });

  const isActionMenu = (menu) => {
    if (!menu || !menu.code) return false;
    return AVAILABLE_ACTIONS.some((act) => menu.code.endsWith(`.${act.key}`));
  };

  // RTK Query hooks
  const { data: productListData, isLoading: isLoadingProducts } = useGetProductDropdownQuery();

  const selectedProductVal = getProductValue(product);
  const { data: menuFeaturesData, isLoading: isLoadingMenus } = useGetMenuListByProductQuery(
    selectedProductVal,
    { skip: !selectedProductVal }
  );

  const [createMenu, { isLoading: isCreating }] = useCreateMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteMenuMutation();

  // Deduplicate products for dropdown
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

  // Set initial product when product list loads
  useEffect(() => {
    if (!product && uniqueProducts.length > 0) {
      setProduct(uniqueProducts[0]);
    }
  }, [uniqueProducts, product]);

  // Filter raw menu data for selected product
  const filteredMenus = useMemo(() => {
    if (!menuFeaturesData) return [];
    if (Array.isArray(menuFeaturesData)) return menuFeaturesData;
    if (Array.isArray(menuFeaturesData.data)) return menuFeaturesData.data;
    if (Array.isArray(menuFeaturesData.results)) return menuFeaturesData.results;
    return [];
  }, [menuFeaturesData]);

  const displayMenus = useMemo(() => {
    return filteredMenus.filter((m) => !isActionMenu(m));
  }, [filteredMenus]);

  // Helper to build tree hierarchy
  const buildTree = (flatList = []) => {
    const map = {};
    const roots = [];

    flatList.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    flatList.forEach((item) => {
      const pId = item.parent ? (typeof item.parent === "object" ? item.parent.id : item.parent) : null;
      if (pId && map[pId]) {
        map[pId].children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  };

  const menuTree = useMemo(() => {
    return buildTree(displayMenus);
  }, [displayMenus]);

  // Compute Parent Menu options based on selected menuType
  const parentMenuOptions = useMemo(() => {
    if (!displayMenus) return [];
    return displayMenus.filter((item) => {
      const isNotCurrent = editId ? item.id !== editId : true;
      if (!isNotCurrent) return false;

      if (menuType === "submodule") {
        return item.menu_type === "module";
      } else if (menuType === "form") {
        // Form can be nested under submodule or module, or standalone (no parent)
        return item.menu_type === "submodule" || item.menu_type === "module";
      }
      return false; // module has no parent
    });
  }, [displayMenus, editId, menuType]);

  // Reset form state helper
  const handleResetForm = (parentItem = null) => {
    setEditId(null);
    setModuleName("");
    setModuleKey("");
    setIsActive(true);
    setDisplayOrder(1);

    const initialActionState = {};
    AVAILABLE_ACTIONS.forEach((act) => {
      initialActionState[act.key] = false;
    });
    setSelectedActions(initialActionState);

    if (parentItem) {
      setParentModule(parentItem);
      const nextType = parentItem.menu_type === "module" ? "submodule" : "form";
      setMenuType(nextType);
    } else {
      setParentModule(null);
      setMenuType("module");
    }
  };

  // Edit Node Handler
  const handleEditNode = (node) => {
    setEditId(node.id);
    setModuleName(node.name || "");
    setModuleKey(node.code || "");
    setIsActive(node.is_active !== undefined ? node.is_active : true);
    setMenuType(node.menu_type || "module");
    setDisplayOrder(node.display_order || 1);

    const pId = node.parent ? (typeof node.parent === "object" ? node.parent.id : node.parent) : null;
    const parent = displayMenus.find((m) => m.id === pId) || null;
    setParentModule(parent);

    // Associated actions
    const actions = filteredMenus.filter((m) => {
      const parentId = m.parent ? (typeof m.parent === "object" ? m.parent.id : m.parent) : null;
      return parentId === node.id;
    });

    const actionState = {};
    AVAILABLE_ACTIONS.forEach((act) => {
      actionState[act.key] = actions.some((a) => a.code?.endsWith(`.${act.key}`));
    });
    setSelectedActions(actionState);
  };

  // Toggle node expand/collapse
  const handleToggleNode = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle Menu Type change: Reset parentModule if invalid for new type
  const handleMenuTypeChange = (newType) => {
    setMenuType(newType);
    if (!editId) {
      if (newType === "module") {
        setParentModule(null);
      } else if (parentModule) {
        if (newType === "submodule" && parentModule.menu_type !== "module") {
          setParentModule(null);
        }
      }
    }
  };

  // Auto-generate Module Key when Module Name, Parent Menu, or Menu Type changes
  useEffect(() => {
    if (editId) return;

    if (!moduleName) {
      setModuleKey("");
      return;
    }

    const sanitizedKey = sanitizeCodeKey(moduleName);

    if (menuType === "module" || !parentModule) {
      setModuleKey(sanitizedKey);
    } else if (parentModule && parentModule.code) {
      const generatedKey = `${parentModule.code}.${sanitizedKey}`;
      setModuleKey(generatedKey);
    } else {
      setModuleKey(sanitizedKey);
    }
  }, [moduleName, parentModule, menuType, editId]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      toast.error("Please select a product");
      return;
    }
    if (!moduleName.trim()) {
      toast.error("Please enter a module name");
      return;
    }
    if (!moduleKey.trim()) {
      toast.error("Please enter a unique key / code");
      return;
    }
    if (menuType === "submodule" && !parentModule) {
      toast.error("Please select a parent module for Sub Module");
      return;
    }

    try {
      let savedMenu = null;
      const targetParentId = menuType === "module" ? null : parentModule ? parentModule.id : null;

      if (editId) {
        const payload = {
          id: editId,
          name: moduleName.trim(),
          code: moduleKey.trim(),
          product: selectedProductVal,
          menu_type: menuType,
          display_order: Number(displayOrder) || 1,
          is_active: isActive,
          parent: targetParentId,
        };
        savedMenu = await updateMenu(payload).unwrap();
        toast.success("Menu updated successfully");
      } else {
        const payload = {
          name: moduleName.trim(),
          code: moduleKey.trim(),
          product: selectedProductVal,
          menu_type: menuType,
          display_order: Number(displayOrder) || 1,
          is_active: isActive,
          parent: targetParentId,
        };
        savedMenu = await createMenu(payload).unwrap();
        toast.success("Menu created successfully");
      }

      // Process Action Child Menus for Form type
      if (menuType === "form" && savedMenu && (savedMenu.id || editId)) {
        const parentId = savedMenu.id || editId;
        const parentCode = savedMenu.code || moduleKey;

        const existingActions = filteredMenus.filter((m) => {
          const pId = m.parent ? (typeof m.parent === "object" ? m.parent.id : m.parent) : null;
          return pId === parentId;
        });

        for (const act of AVAILABLE_ACTIONS) {
          const action = act.key;
          const actionCode = `${parentCode}.${action}`;
          const isSelected = selectedActions[action];
          const dbAction = existingActions.find((a) => a.code === actionCode);

          if (isSelected) {
            if (!dbAction) {
              await createMenu({
                name: `${moduleName}.${act.label}`,
                code: actionCode,
                product: selectedProductVal,
                menu_type: "form",
                display_order: 1,
                is_active: true,
                parent: parentId,
              }).unwrap();
            } else if (!dbAction.is_active) {
              await updateMenu({
                id: dbAction.id,
                is_active: true,
              }).unwrap();
            }
          } else {
            if (dbAction) {
              await deleteMenu(dbAction.id).unwrap();
            }
          }
        }
      }

      handleResetForm();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Something went wrong.");
    }
  };

  // Delete Action Handler
  const handleConfirmDelete = async () => {
    if (!nodeToDelete) return;
    try {
      await deleteMenu(nodeToDelete.id).unwrap();
      toast.success("Menu deleted successfully");
      setOpenDeleteDialog(false);
      if (editId === nodeToDelete.id) {
        handleResetForm();
      }
      setNodeToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Failed to delete menu");
      setOpenDeleteDialog(false);
      setNodeToDelete(null);
    }
  };

  // Recursive Tree Renderer
  const renderTreeNodes = (nodes, depth = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = !!expandedNodes[node.id];
      const isSelectedForEdit = editId === node.id;

      let NodeIcon = MdFolder;
      if (node.menu_type === "submodule") {
        NodeIcon = MdMenuBook;
      } else if (node.menu_type === "form") {
        NodeIcon = MdSmartButton;
      }

      return (
        <React.Fragment key={node.id}>
          <ListItem
            button
            onClick={() => handleToggleNode(node.id)}
            style={{
              paddingLeft: `${depth * 24 + 16}px`,
              backgroundColor: isSelectedForEdit ? "#e3f2fd" : "transparent",
              borderLeft: isSelectedForEdit ? "4px solid #1976d2" : "none",
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <MdExpandLess style={{ marginRight: 8, fontSize: 20, color: "#666" }} />
              ) : (
                <MdExpandMore style={{ marginRight: 8, fontSize: 20, color: "#666" }} />
              )
            ) : (
              <Box style={{ width: 28 }} />
            )}
            <ListItemIcon style={{ minWidth: 32, color: "#1976d2" }}>
              <NodeIcon size={18} />
            </ListItemIcon>
            <ListItemText
              primary={node.name}
              secondary={`${node.code} (${node.menu_type})`}
              primaryTypographyProps={{ style: { fontSize: 13, fontWeight: "bold" } }}
              secondaryTypographyProps={{ style: { fontSize: 11 } }}
            />
            {node.menu_type !== "form" && (
              <IconButton
                size="small"
                title="Add Child Node"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetForm(node);
                }}
                style={{ color: "#2e7d32" }}
              >
                <MdAdd size={18} />
              </IconButton>
            )}
            <IconButton
              size="small"
              title="Edit Node"
              onClick={(e) => {
                e.stopPropagation();
                handleEditNode(node);
              }}
              style={{ color: "#1976d2" }}
            >
              <MdEdit size={18} />
            </IconButton>
            <IconButton
              size="small"
              title="Delete Node"
              onClick={(e) => {
                e.stopPropagation();
                setNodeToDelete(node);
                setOpenDeleteDialog(true);
              }}
              style={{ color: "#d32f2f" }}
            >
              <MdDelete size={18} />
            </IconButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderTreeNodes(node.children, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <JumboContentLayoutMain>
      <Div>
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Configure Menu Features (Product Wise)
        </Typography>

        <Div className="card" sx={{ m: 1, ml: 0, mr: 0, p: 4, minHeight: "466px" }}>
          <Grid container spacing={4}>
            {/* Left Pane - Tree View */}
            <Grid item xs={12} md={5}>
              <Typography sx={[ComponentHeading, { mb: 2, textAlign: "left" }]}>
                Menu Structure
              </Typography>

              <Grid item xs={12} className="row" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Typography className="input-label col-md-4" sx={{ textAlign: "left" }}>
                  Select Product <Span className="required">*</Span>
                </Typography>
                <FormControl className="col-md-8">
                  <Autocomplete
                    className="search-select3"
                    options={uniqueProducts}
                    getOptionLabel={(option) => option?.name || ""}
                    value={product}
                    onChange={(event, newValue) => {
                      setProduct(newValue);
                      handleResetForm();
                    }}
                    loading={isLoadingProducts}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Product" variant="outlined" />
                    )}
                  />
                </FormControl>
              </Grid>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Nest modules, submodules, and form pages.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MdAdd />}
                  onClick={() => handleResetForm(null)}
                  size="small"
                  sx={{ textTransform: "none", whiteSpace: "nowrap", px: 2, minWidth: "140px" }}
                >
                  Add Top Module
                </Button>
              </Box>

              <JumboScrollbar style={{ minHeight: 400, maxHeight: 500, border: "1px solid #e0e0e0", borderRadius: 4 }}>
                {isLoadingMenus ? (
                  <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                    <Typography variant="body2" color="textSecondary">
                      Loading menus...
                    </Typography>
                  </Box>
                ) : menuTree.length > 0 ? (
                  <List component="nav" disablePadding>
                    {renderTreeNodes(menuTree)}
                  </List>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" height={300}>
                    <Typography variant="body2" color="textSecondary">
                      No menu items found for this product.
                    </Typography>
                  </Box>
                )}
              </JumboScrollbar>
            </Grid>

            {/* Right Pane - Form Node */}
            <Grid item xs={12} md={7}>
              <Typography sx={[ComponentHeading, { mb: 3, textAlign: "left" }]}>
                {editId ? "Edit Menu Node" : "Add New Menu Node"} {product ? `(${product.name})` : ""}
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Display Name */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Display Name <Span className="required">*</Span>
                    </Typography>
                    <TextField
                      className="col-md-8 input-box2"
                      placeholder="e.g. Student Management"
                      variant="outlined"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </Grid>

                  {/* Menu Type */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Menu Type <Span className="required">*</Span>
                    </Typography>
                    <FormControl className="col-md-8">
                      <Select
                        className="search-select3 col-12 input-select"
                        value={menuType}
                        onChange={(e) => handleMenuTypeChange(e.target.value)}
                        sx={{
                          textAlign: "left",
                          "& .MuiSelect-select": {
                            textAlign: "left !important",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start !important",
                          },
                        }}
                      >
                        <MenuItem value="module">Module (Top level)</MenuItem>
                        <MenuItem value="submodule">Sub Module (Inner)</MenuItem>
                        <MenuItem value="form">Form / Action (Leaf)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Parent Menu */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Parent Menu {menuType === "submodule" && <Span className="required">*</Span>}
                    </Typography>
                    <FormControl className="col-md-8">
                      <Autocomplete
                        className="search-select3"
                        disabled={menuType === "module"}
                        options={parentMenuOptions}
                        getOptionLabel={(option) => {
                          if (!option) return "";
                          const pId = option.parent ? (typeof option.parent === "object" ? option.parent.id : option.parent) : null;
                          const parentItem = displayMenus.find((m) => m.id === pId);
                          if (parentItem) {
                            return `${parentItem.name} > ${option.name}`;
                          }
                          return option.name || "";
                        }}
                        value={parentModule}
                        onChange={(event, newValue) => setParentModule(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              menuType === "module"
                                ? "None (Top Level Module)"
                                : menuType === "form"
                                ? "Select Parent Menu (Optional)"
                                : "Select Parent Menu"
                            }
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Unique Code / Key */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Unique Key <Span className="required">*</Span>
                    </Typography>
                    <TextField
                      className="col-md-8 input-box2"
                      placeholder="e.g. student_management"
                      variant="outlined"
                      value={moduleKey}
                      onChange={(e) => setModuleKey(e.target.value)}
                      required
                      disabled={!!editId}
                      autoComplete="off"
                    />
                  </Grid>

                  {/* Display Order */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Display Order
                    </Typography>
                    <TextField
                      className="col-md-8 input-box2"
                      type="number"
                      placeholder="Display Order"
                      variant="outlined"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value) || 1)}
                      inputProps={{ min: 1 }}
                      autoComplete="off"
                    />
                  </Grid>

                  {/* Action Permissions */}
                  {menuType === "form" && (
                    <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                      <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                        Action Permissions
                      </Typography>
                      <Box className="col-md-8" display="flex" flexWrap="wrap" gap={1}>
                        {AVAILABLE_ACTIONS.map((action) => (
                          <FormControlLabel
                            key={action.key}
                            control={
                              <Checkbox
                                size="small"
                                checked={selectedActions[action.key] || false}
                                onChange={(e) =>
                                  setSelectedActions({
                                    ...selectedActions,
                                    [action.key]: e.target.checked,
                                  })
                                }
                                color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2">
                                {action.label}
                              </Typography>
                            }
                            sx={{ m: 0 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  )}

                  {/* Status */}
                  <Grid item xs={12} className="row" sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
                    <Typography className="input-label col-md-3" sx={{ textAlign: "left" }}>
                      Status
                    </Typography>
                    <Box className="col-md-8" sx={{ display: "flex", alignItems: "center" }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={isActive ? "Active" : "Inactive"}
                      />
                    </Box>
                  </Grid>

                  {/* Form Action Buttons */}
                  <Grid item xs={12} sx={{ mt: 3, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                    <Cancelbutton
                      width="110px"
                      label={editId ? "Cancel Edit" : "Reset"}
                      onClick={() => handleResetForm()}
                    />
                    <CustomButton
                      type="submit"
                      width="135px"
                      label={editId ? "Update Node" : "Create Node"}
                      Icon="saveIcon"
                      loading={isCreating || isUpdating}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Div>
      </Div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the menu node "<strong>{nodeToDelete?.name}</strong>" ({nodeToDelete?.code})?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <CustomButton
            label="Delete"
            bgColor="#e53935"
            onClick={handleConfirmDelete}
            loading={isDeleting}
            Icon="deleteIcon"
          />
          <Cancelbutton
            label="Cancel"
            onClick={() => setOpenDeleteDialog(false)}
          />
        </DialogActions>
      </Dialog>
    </JumboContentLayoutMain>
  );
}