// addons state
const addonsFilterState = {
  Addon_Name: "",
  NoofUsers: "",
  Price: "",
  Fromdate: "",
  Todate: "",
};

// storage state
const storageFilterState = {
  Name: "",
  StorageSize: "",
  Price: "",
  Fromdate: "",
  Todate: "",
};

// user master state
const UserMasterFilterState = {
  Name: "",
  noofusers: "",
  Price: "",
  Amount_Per_User: "",
  Total_Amount: "",
  Fromdate: "",
  Todate: "",
};

// plan state
const planFilterState = {
  Name: "",
  Country: "",
  Code: "",
  Fromdate: "",
  Todate: "",
  Product: "",
};

// subscription state
const subscriptionFilterState = {
  Name: "",
  Customer_Name: "",
  Plan_Name: "",
  Fromdate: "",
  Todate: "",
};

// invoice state
const invoiceFilterState = {
  InvoiceAmount: "",
  TaxAmount: "",
  NetAmount: "",
  Fromdate: "",
  Todate: "",
};

// payment state
const paymentFilterState = {
  Customer_Name: "",
  PaymentMode: "",
  PaidAmount: "",
  Fromdate: "",
  Todate: "",
};

// instance request state
const RequestFilterState = {
  Name: "",
  Customer_Name: "",
  InstanceName: "",
  Fromdate: "",
  Todate: "",
};

// License request state
const licenseFilterState = {
  CustomerName: "",
  Planname: "",
  Fromdate: "",
  Todate: "",
};

// addon subscription request state
const AddonsubscriptionFilterState = {
  planname: "",
  Subscriptiondate: "",
  Fromdate: "",
  Todate: "",
};

// addon subscription request state
const aditionaStorageFilterState = {
  AllocatedStorage: "",
  PlanName: "",
  Fromdate: "",
  Todate: "",
};

// addon subscription request state
const renewalFilterState = {
  CustomerName: "",
  RenewalAmount: "",
  Fromdate: "",
  Todate: "",
};

// cancel Plan request state
const cancelPlanFilterState = {
  PlanName: "",
  CustomerName: "",
  DomainName: "",
  Fromdate: "",
  Todate: "",
};

// instant Creation state
const InstantCreationFilterState = {
  Request_No: "",
  Domain_Name: "",
  Customer_Name: "",
  Database_Name: "",
  Fromdate: "",
  Todate: "",
};

// Define the reducer function
const reducerFilter = (state, action) => {
  if (action?.type) {
    return { ...state, [action.type]: action.payload };
  } else {
    return action;
  }
};

export {
  reducerFilter,
  addonsFilterState,
  storageFilterState,
  UserMasterFilterState,
  planFilterState,
  subscriptionFilterState,
  invoiceFilterState,
  paymentFilterState,
  RequestFilterState,
  licenseFilterState,
  AddonsubscriptionFilterState,
  aditionaStorageFilterState,
  renewalFilterState,
  cancelPlanFilterState,
  InstantCreationFilterState,
};
