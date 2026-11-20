import React, { Suspense } from "react";
import Page from "@jumbo/shared/Page";
import login from "app/pages/auth-pages/login";
import ForgotPassword from "app/pages/auth-pages/forgot-password/ForgotPassword";
import EmailLists from "app/pages/home/email-lists/EmailLists";
import ChatLists from "app/pages/home/chat-lists/ChatLists";
// import dashboardRoutes from "./dashboardRoutes";
// import appsRoutes from "./appsRoutes";
import authRoutes from "./authRoutes";
import CalenderList from "app/pages/home/calender-lists/CalenderList";
import ContactsListLeftCard from "app/pages/contacts/ContactsListLeftCard";
import OverviewContact from "app/pages/contacts/overviewcontact/OverviewContact";
import CallCenterLeftCardLists from "app/pages/call-center/call-center-left-side-card/CallCenterLeftCardLists";
// import ProjectManagementLists from "app/pages/Project Management/project-mgmt-list/ProjectManagementLists";
// import ManagementLists from "app/pages/Project Management/mile-stone-list/MilestoneLists";
// import DeliverablesLists from "app/pages/Project Management/deliverable-list/DeliverablesLists";
// import ResourceLists from "app/pages/Project Management/Resource-list/ResourceLists";
// import Resourcesummary from "app/pages/Project Management/Project-Reports/Resourcesummary";

// import ListTaskManagement from "app/pages/useradmin-pages/taskmanagement/ListTaskManagement";
// import UpdateTask from "app/pages/useradmin-pages/taskmanagement/UpdateTask";
// import AssignTaskLists from "app/pages/useradmin-pages/taskmanagement/AssignTaskLists";
// import TaskCalendarView from "app/pages/useradmin-pages/taskmanagement/TaskCalendarView";
// import ListLicence from "app/pages/useradmin-pages/licence/AdditionalLicence/ListLicence";
// import CreateLicence from "app/pages/useradmin-pages/licence/AdditionalLicence/CreateLicence";
// import ListStorage from "app/pages/useradmin-pages/licence/Storage/ListStorage";
// import CreateStorage from "app/pages/useradmin-pages/licence/Storage/CreateStorage";
// import ListAddonPurchase from "app/pages/useradmin-pages/licence/AddonPurchase/ListAddonPurchase";
// import CreateAddonPurchase from "app/pages/useradmin-pages/licence/AddonPurchase/CreateAddonPurchase";
// import CancelPlans from "app/pages/useradmin-pages/licence/CancelPlan/CancelPlans";
// import ListRenewal from "app/pages/useradmin-pages/licence/Renewal/ListRenewal";
// import ListLookup from "app/pages/useradmin-pages/lookup/ListLookup";
// import CreateLookup from "app/pages/useradmin-pages/lookup/CreateLookup";
import ListTickets from "app/pages/useradmin-pages/ticket/ListTickets";
import CreateTickets from "app/pages/useradmin-pages/ticket/CreateTickets";
import ViewTicketResponse from "app/pages/useradmin-pages/ticket/ViewTicketResponse";
// import GeneralSettings from "app/pages/useradmin-pages/settings/GeneralSettings";
// import EditCompanyDetails from "app/pages/useradmin-pages/settings/EditCompanyDetails";
// import RolesAndUsers from "app/pages/useradmin-pages/settings/RolesAndUsers/RolesAndUsers";
// import RegistrationForm from "app/pages/useradmin-pages/settings/RolesAndUsers/RegistrationForm";
// import TransactionApproval from "app/pages/useradmin-pages/settings/TransactionApproval";
// import TransactionSeries from "app/pages/useradmin-pages/settings/Preferences/TransactionSeries";
// import SystemPreference from "app/pages/useradmin-pages/settings/Preferences/SystemPreference";
// import OrganizationStructure from "app/pages/useradmin-pages/settings/Organization/OrganizationStructure";
// import AdminDashboard from "app/pages/useradmin-pages/home/Admin-Dashboard";
// import AdminEmailLists from "app/pages/useradmin-pages/mail/EmailLists";
// import SalesLeftCard from "app/pages/sales/SalesLeftCard";
import AnalyticsLeftSide from "app/pages/analytics/AnalyticsLeftSide";

// import CampaignDashboard from "app/pages/campaign/CampaignDashboard";
// import SalesDashboardRightCard from "app/pages/sales/Dashboard/SalesDashboardRightCard";
// import EmailMainPage from "app/pages/campaign/campaign-right-side-card/email/EmailMainPage";
// import StatisticsRightCardList from "app/pages/campaign/campaign-right-side-card/StatisticsRightCard";
// import ProductMaster from "app/pages/sales/ProductMaster";
// import OpeningStock from "app/pages/sales/OpeningStock";
// import ProductCataloque from "app/pages/sales/ProductCataloque";
// import Discount from "app/pages/sales/Discount";
// import ManagePrice from "app/pages/sales/ManagePrice";
// import MyOffer from "app/pages/sales/Offer/MyOffer";
// import SalesOrderRightCard from "app/pages/sales/Order/SalesOrderRightCard";
// import ScheduleRightCard from "app/pages/sales/Schedule/ScheduleRightCard";
// import MyShipmentRight from "app/pages/sales/shipment/MyShipmentRight";
import SLA from "app/pages/customersupport/SLA";
import SummaryRightSideCardList from "app/pages/customersupport/customersupport-right-card/SummaryRightSideCardList";
import TicketManagementTicket from "app/pages/customersupport/TicketManagementTicket";
import TicketStatus from "app/pages/customersupport/TicketStatus";
import ListTemplates from "app/pages/Templates/ListTemplate";
import SetupList from "app/pages/setup/SetupList";
// import OverviewDealContact from "app/pages/deals/overviewcontact/OverviewContact";
// import DealFactorsetup from "app/pages/useradmin-pages/settings/Deal/DealFactorsetup";
// import DealPredictsetup from "app/pages/useradmin-pages/settings/Deal/DealPredictsetup";
// import DealWeightsetup from "app/pages/useradmin-pages/settings/Deal/DealWeightsetup";
// import DealProbability from "app/pages/useradmin-pages/settings/Deal/DealProbability";
// import LeadPrediction from "app/pages/useradmin-pages/settings/LeadScoring/LeadPrediction";
// import LeadScoringForm from "app/pages/useradmin-pages/settings/LeadScoring/LeadScoringForm";
// import OverviewLead from "app/pages/leads/overviewlead/OverviewLead";
import DeveloperTicket from "app/pages/useradmin-pages/ticket/Developeticket";
import CreatedTicketList from "app/pages/useradmin-pages/ticket/CreatedTicketList";
// import LeadscoringSetup from "app/pages/setup/LeadscoringSetup";
// import SalesMyPaymentRightCard from "app/pages/sales/Payment/SalesMyPaymentRightCard";
// import EnquirydRightCard from "app/pages/sales/Enquiry/EnquiryRightCard";
// import SalesPendingInvoiceRightCard from "app/pages/sales/Invoice/SalesPendingInvoiceRightCard";
// import SalesInvoiceRightCard from "app/pages/sales/Invoice/SalesInvoiceRightCard";
import TicketsManagementGroup from "app/pages/useradmin-pages/ticket/TicketManagement";
// import ProductCategories from "app/pages/sales/ProductCategories";
// import LeadStatus from "app/pages/useradmin-pages/settings/LeadScoring/LeadStatus";
// import ListSupplier from "app/pages/sales/supplier/ListSupplier";
// import LiveChatsRightCard from "app/pages/customersupport/customersupport-right-card/LiveChatsRightCard";
// import ListTaskManagement1 from "app/pages/taskmanagement/ListTaskManagement";
// import UpdateTask1 from "app/pages/taskmanagement/UpdateTask";
// import AssignTaskLists1 from "app/pages/taskmanagement/AssignTaskLists";
// import TaskCalendarView1 from "app/pages/taskmanagement/TaskCalendarView";
// import TerritoryManagement from "app/pages/sales/TerritoryManagement/TerritoryManagement";
// import TerritoryHierarchy from "app/pages/sales/TerritoryManagement/TerritoryHierarchy";
// import SalesPerformance from "app/pages/sales/TerritoryManagement/SalesPerformance";
import ProtectedRoute from "app/ProtectedRoute";
// import SalesPersonTargetList from "app/pages/sales/TerritoryManagement/SalesPersonTargetList/SalesPersonTargetList";
// import SalesTargetList from "app/pages/sales/TerritoryManagement/SalesTargetList/SalesTargetList";
// import NotificationSales from "app/pages/sales/Notification";
// import DashboardSales from "app/pages/sales/sales/Dashboard";
// import AccountSales from "app/pages/accounts/view-account/AccountSales";
// import ConversationSales from "app/pages/sales/sales/Conversations";
// import Treeviewmap from "app/pages/sales/ProductCategouie/ProductCategourie";
// import LeadQuestions from "app/pages/LeadQuestions/LeadQuestions";
// import AccountSales from "app/pages/sales/sales/Accounts";
// import LeadQuestionsPage from "app/pages/leads/LeadQuestionsPage";
// import Project from "app/pages/taskmanagement/Project";
// import AssignTask from "app/pages/taskmanagement/AssignTask";
// import TaskHierarchy from "app/pages/taskmanagement/TaskHierarchy";
// import AccountOverview from "app/pages/sales/sales/Dashboard/AccountOverview";
// import TaskReport from "app/pages/taskmanagement/TaskReport";
import FormBuilder from "app/pages/Addmoremodule/Formbuilder";
// import UpdateTaskList from "app/pages/taskmanagement/UpdateTaskList";
import SalesByCustomer from "app/pages/analytics/SalesByCustomer";
import ActivityOverview from "app/pages/analytics/ActivityOverview";
import SalesGoals from "app/pages/analytics/SalesGoals";
import StageConversionByOwner from "app/pages/analytics/StageConversionByOwner";
import StageDurationAnalysis from "app/pages/analytics/StageDurationAnalysis";
import TimetoFirstActionbyOwner from "app/pages/analytics/TimetoFirstActionbyOwner";
// import MarketingEffectiveness from "app/pages/analytics/MarketingEffectiveness";
import CallDuration from "app/pages/analytics/CallDuration";
import CallLengthVsTimeOfDay from "app/pages/analytics/CallLengthVsTimeOfDay";
import CRMDashBoard from "app/pages/analytics/CRMDashBoard";
import SalesKPIDashboard from "app/pages/analytics/SalesKPIDashboard";
import ChurnAnalysisDashboard from "app/pages/analytics/ChurnAnalysisDashboard";
import KeyPerformanceIndicator from "app/pages/analytics/KeyPerformanceIndicator";
import SalesDashboard from "app/pages/analytics/SalesDashboard";
import SalesOpportunitiesOverview from "app/pages/analytics/SalesOpportunitiesOverview";
import OpportunitiesIndividualReport from "app/pages/analytics/OpportunitiesIndividualReport";
import ActivityIndividualReport from "app/pages/analytics/ActivityIndividualReport";
import CustomerRententionDashboard from "app/pages/analytics/CustomerRententionDashboard";
// import LeadPerformance from "app/pages/analytics/LeadPerformance";
import CallActivities from "app/pages/analytics/CallActivities";
import MonthlySalesDashboard from "app/pages/analytics/MonthlySalesDashboard";
import SalesProductPerformance from "app/pages/analytics/SalesProductPerformance";
import ExecutiveSalesPerformance from "app/pages/analytics/ExecutiveSalesPerformance";
import TotalSalesAndGrowth from "../pages/analytics/TotalSalesAndGrowth";
import SalesVolumeByChannel from "app/pages/analytics/SalesVolumeByChannel";
import MonthlySalesActivityReport from "app/pages/analytics/MonthlySalesActivityReport";
import MonthlySalesCallReport from "app/pages/analytics/MonthlySalesCallReport";
import MonthlyRetailSales from "app/pages/analytics/MonthlyRetailSales";
import SimpleMonthlySalesReport from "app/pages/analytics/SimpleMonthlySalesReport";
// import LeadGeneration from "app/pages/leads/LeadGeneration";
// import LeadScore from "app/pages/useradmin-pages/settings/LeadScoring/LeadScore";
// import LeadScoringtypes from "app/pages/useradmin-pages/settings/LeadScoring/LeadScoringtypes";
import { Tenantname } from "app/services/auth-services";
import { Navigate } from "react-router-dom";
// import DashboardDeals from "app/pages/deals/DashboardDeals";
import ResetPassword from "app/pages/auth-pages/forgot-password/ResetPassword";
import MyTickets from "app/pages/useradmin-pages/ticket/MyTickets";
import ReceivedTickets from "app/pages/useradmin-pages/ticket/ReceivedTickets";
// import SocialMediaCampaign from "app/pages/campaign/campaign-right-side-card/email/SocialMediaCampaign";
// import SalesPersonTarget from "app/pages/useradmin-pages/settings/SalesPersonTarget";
import SalesRepPerformanceReport from "app/pages/Reports/SalesPerformance/SalesRepPerformanceReport";
import ProAndSerPerformanceReport from "app/pages/Reports/SalesPerformance/ProAndSerPerformanceReport";
// import LeadSources from "app/pages/analytics/LeadSources";
import CFList from "app/pages/Addmoremodule/CFList";
// import AddAgent from "app/pages/useradmin-pages/Agent/Addagent";
// import AssignTaskLists2 from "app/pages/ProjectManagement/AssignTaskLists";
// import UpdateTask2 from "app/pages/ProjectManagement/UpdateTask";
// import TaskCalendarView2 from "app/pages/ProjectManagement/TaskCalendarView";
// import ListTaskManagement2 from "app/pages/ProjectManagement/ListTaskManagement";
import Home from "app/pages/home/Home";
import ChatandSupport from "app/shared/widgets/AuthUserDropdown/Chat&Support";
import SalesForecastReports from "app/pages/Reports/SalesPerformance/SalesForecastReports";
import SalesActivityReports from "app/pages/Reports/SalesPerformance/SalesActivityReports";
// import LeadConversionreport from "app/pages/Reports/SalesPerformance/LeadReports/LeadConversionreport";
// import Opportunitypipelinereport from "app/pages/Reports/SalesPerformance/LeadReports/Opportunitypipelinereport";
// import SalesForecast from "app/pages/Reports/SalesPerformance/LeadReports/SalesForecast";
// import DealSize from "app/pages/Reports/SalesPerformance/LeadReports/DealSize";
// import SalesFunnelReport from "app/pages/Reports/SalesPerformance/LeadReports/SalesFunnelReport";
// import LeadSourceReports from "app/pages/Reports/SalesPerformance/LeadReports/LeadSourceReports";
import SalesPipeLineReport from "app/pages/Reports/SalesPerformance/SalesPipeLineReport";
// import SalesPipelineReport from "app/pages/Reports/SalesPerformance/LeadReports/SalesPipelineReport";
// import OpportunityAgingReport from "app/pages/Reports/SalesPerformance/LeadReports/OpportunityAgingReport";
// import ConversionRateReport from "app/pages/Reports/SalesPerformance/LeadReports/ConversionRateReport";
// import CustomerInteractionHistoryReport from "app/pages/Reports/SalesPerformance/CustomerReports/CustomerInteractionHistoryreport";
// import EmailCampaignPerformanceReport from "app/pages/Reports/SalesPerformance/CustomerReports/EmailCampaignPerformanceReport";
// import SocialMediaEngagementReport from "app/pages/Reports/SalesPerformance/CustomerReports/SocialMediaEngagementReport";
// import CustomerSatisfactionReport from "app/pages/Reports/SalesPerformance/CustomerReports/CustomerSatisfactionReport";
// import WebsiteTrafficReport from "app/pages/Reports/SalesPerformance/CustomerReports/WebsiteTrafficReport";
// import LeadGenerationReport from "app/pages/Reports/SalesPerformance/MarketingReports/LeadGenerationReport";
// import ConversionMarketingRateReport from "app/pages/Reports/SalesPerformance/MarketingReports/ConversionRateReports";
// import CustomerChurnReport from "app/pages/Reports/CustomerRetention/CustomerChurnReport";
// import CustomerLoyaltyReport from "app/pages/Reports/CustomerRetention/CustomerLoyaltyReport";
// import CustomerRetentionSatisfactionReport from "app/pages/Reports/CustomerRetention/CustomerSatisfactionReport";
// import CustomerEngagementReport from "app/pages/Reports/CustomerRetention/CustomerEngagementReport";
// import CustomerLifetimeValueReport from "app/pages/Reports/CustomerRetention/CustomerLifetimeValueReport";
import InvoiceListTemplates from "app/pages/InvoiceTemplates/ListInvoiceTemplate";
// import { ExpenseList } from "app/pages/sales/Expense/ExpenseList";
// import CustomerEngagementList from "app/pages/CustomerEnagement/CustomerEngagementList";
// import UnAsignedLeads from "app/pages/leads/UnAsignedLeads";
// import FeedbackQstpage from "app/pages/sales/sales/FeedbackQstpage";
// import Feedback from "app/pages/sales/sales/feedback";
// import WeeklyReport from "app/pages/Reports/NewReports/WeeklyReport";
// import MonthlySalesReport from "app/pages/Reports/NewReports/MonthlySalesReport";
// import CusChurnReports from "app/pages/Reports/NewReports/CusChurnReports";
// import CusAdditionReports from "app/pages/Reports/NewReports/CusAdditionReports";
// import CusRetentionReports from "app/pages/Reports/NewReports/CusRetentionReports";
// import SalesrepPErformanceReport from "app/pages/Reports/NewReports/SalesrepPErformanceReport";
// import LeadandOpp from "app/pages/Reports/NewReports/LeadandOpp";
// import SalesperReports from "app/pages/Reports/NewReports/SalesperReports";
import SalesFunReport from "app/pages/Reports/SalesFunnelReports/SalesFunnelReport";
import PipelineDevReports from "app/pages/Reports/SalesFunnelReports/PipelineDevReports";
import StagedisCRMreports from "app/pages/Reports/SalesFunnelReports/StagedisCRMreports";
// import ShipmentCalender from "app/pages/sales/ShipmentCalender";
import DailySalesReport from "app/pages/Reports/NewReports/DailySalesReport";
import MainPage from "app/pages/MLAnalytics/pages/MainPage";
// import Feedbacktemplate from "app/pages/sales/sales/feedbackTemplate.js/Feedbacktemplate";
// import SatisfactionSurvey from "app/pages/sales/sales/feedbackReports/SatisfactionSurvey";
// import SummaryReport from "app/pages/sales/sales/feedbackReports/summaryReport";
import MainChat from "app/pages/chat/MainChat";
// import Hierarchy from "app/pages/sales/Territory-Mgmt/hirarchy/Hirarchy";
// import TerritoryView from "app/pages/sales/Territory-Mgmt/sales-target/TerritoryView";
// import SalesTarget from "app/pages/sales/Territory-Mgmt/sales-target/SalesTarget";
// import SalesPersonTargets from "app/pages/sales/Territory-Mgmt/sales-person-target/SalesPersonTarget";
import SalesAchievements from "app/pages/Reports/SalesPerformance/SalesAchievements";
import TaskManagementList from "app/pages/Task Management/task-mgmt-list/TaskManagamentList";
// import ProductInward from "app/pages/sales/ProductInward";
import TaskStatusKanben from "app/pages/Task Management/task-status-kanben/TaskStatusKanben";
import TaskCalender from "app/pages/Task Management/task-calender/TaskCalender";
import TaskGanttChart from "app/pages/Task Management/task-gantt-chart/TaskGanttChart";

// import ListWorkflowRule from "app/pages/Workflow/ListWorkflowRule";
import SubscriptionList from "app/pages/sales/subscription/SubscriptionList";
import NotificationSales from "app/pages/notification/Notification";

import CancellationofPlanlist from "app/pages/Customer/cancellationofplan/CancellationofPlanlist";
import RenewalDueList from "app/pages/Customer/renewaldue/RenewalDueList";
import PlanList from "app/pages/sales/plan/PlanList";
import InvoiceList from "app/pages/sales/Invoice/InvoiceList";
import InstanceRequest from "app/pages/sales/instancerequest/InstanceRequest";
import PaymentList from "app/pages/sales/payments/PaymentList";
import GeneralSettings from "app/pages/settings/GeneralSettings";
import AddMenuList from "app/pages/settings/add-menu/addMenuList";
import EditCompanyDetails from "app/pages/settings/EditCompanyDetails";
import RolesAndUsers from "app/pages/settings/RolesAndUsers/RolesAndUsers";
// import LeadScore from "app/pages/settings/LeadScoring/LeadScore";
// import LeadScoringtypes from "app/pages/settings/LeadScoring/LeadScoringtypes";
// import LeadPrediction from "app/pages/settings/LeadScoring/LeadPrediction";
// import LeadStatus from "app/pages/settings/LeadScoring/LeadStatus";
// import DealProbability from "app/pages/settings/Deal/DealProbability";
// import DealWeightsetup from "app/pages/settings/Deal/DealWeightsetup";
// import DealFactorsetup from "app/pages/settings/Deal/DealFactorsetup";
// import DealPredictsetup from "app/pages/settings/Deal/DealPredictsetup";
import RegistrationForm from "app/pages/settings/RolesAndUsers/RegistrationForm";
import TransactionApproval from "app/pages/settings/TransactionApproval";
import TransactionSeries from "app/pages/settings/Preferences/TransactionSeries";
import SystemPreference from "app/pages/settings/Preferences/SystemPreference";
import OrganizationStructure from "app/pages/settings/Organization/OrganizationStructure";
import ListTax from "app/pages/settings/TaxSetup/ListTax";
import FactoryLists from "app/pages/settings/FactorySetup/FactoryLists";
import AddAgent from "app/pages/settings/Agent/Addagent";
import StorageList from "app/pages/settings/storage/StorageList";
import UserMasterList from "app/pages/settings/user_master/UserMasterList";
import AddonList from "app/pages/settings/addons/AddonList";
import ListLookup from "app/pages/settings/lookup/ListLookup";
import AccountSales from "app/pages/Customer/customer/Accounts";
import NotificationHome from "app/pages/NotificationMenu/NotificationHome";
// import CustormFormList from "app/pages/Addmoremodule/CustormFormList";
import AccountOverview from "app/pages/Customer/customer/Dashboard/AccountOverview";
// import Hierarchy from "app/pages/Territory-Mgmt/hirarchy/Hirarchy";
// import TerritoryView from "app/pages/Territory-Mgmt/sales-target/TerritoryView";
// import SalesTarget from "app/pages/Territory-Mgmt/sales-target/SalesTarget";
// import SalesPersonTargets from "app/pages/Territory-Mgmt/sales-person-target/SalesPersonTarget";
//
import AdditionalStorageList from "app/pages/Customer/Additional_Storage_Req/AdditionalStorageList";
import ChangePlanList from "app/pages/Customer/Additional_Licence_Req/ChangePlanList";
import AddonSubscription from "app/pages/Customer/Additional_Addon_Req/AddonSubscription";
import InstanceCreationList from "app/pages/sales/Instancecreation/InstanceCreationList";
import LandingPage from "app/pages/landing-page/LandingPage";
import { CRMCustomLoader } from "app/pages/widgets/StylesComponents";
import ListProduct from "app/pages/sales/Products/ListProduct";
import IntroPage from "app/pages/home/IntroPage";
import SuperAdminDashboard from "app/pages/dashboards/superadmin/SuperAdminDashboard";
import AnalyticsDashboard from "app/pages/dashboards/analytics-dashboard/AnalyticsDashboard";

/**
 routes which you want to make accessible to both authenticated and anonymous users
 **/

const routesForPublic = [
  // ...dashboardRoutes,
  // ...appsRoutes,
  ...authRoutes,
  // {
  //     path: "/",
  //     element: <ProtectedRoute component={Login} />,
  //     target: "_blank"
  // },

  {
    path: `home`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={Home} />,
      </Suspense>
    ),
  },

  {
    path: `superadmin-dashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SuperAdminDashboard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics-dashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AnalyticsDashboard} />,
      </Suspense>
    ),
  },

  {
    path: `Home-Notifications`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={NotificationHome} />,
      </Suspense>
    ),
  },

  {
    path: `template`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ListTemplates} />,
      </Suspense>
    ),
  },
  {
    path: `InvoiceTemplate`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={InvoiceListTemplates} />,
      </Suspense>
    ),
  },

  {
    path: `app/mails`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={EmailLists} />,
      </Suspense>
    ),
  },

  {
    path: `app/chats`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ChatLists} />,
      </Suspense>
    ),
  },

  {
    path: `app/calender`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CalenderList} />,
      </Suspense>
    ),
  },

  {
    path: [`app/contacts`],
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ContactsListLeftCard} />,
      </Suspense>
    ),
  },

  {
    path: `customer-list`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AccountSales} />,
      </Suspense>
    ),
  },

  {
    path: `customer-intance-creation`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={InstanceCreationList} />,
      </Suspense>
    ),
  },

  {
    path: `app/accounts/overview/:id`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AccountOverview} />,
      </Suspense>
    ),
  },

  {
    path: `app/call-centre`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CallCenterLeftCardLists} />,
      </Suspense>
    ),
  },

  // {
  //   path: `sales/dashboard`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesDashboardRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesLeftCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-product-master`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ProductMaster} />,
  // </Suspense>)},
  // {
  //   path: `sales-opening-stock`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={OpeningStock} />,
  // </Suspense>)},

  // {
  //   path: `sales-product-categories`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ProductCategories} />,
  // </Suspense>)},
  // {
  //   path: `sale-supplier-list`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListSupplier} />,
  // </Suspense>)},
  // {
  //   path: `sales-discount`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Discount} />,
  // </Suspense>)},
  // {
  //   path: `sales-createStore`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={StoreMaster} />,
  // </Suspense>)},
  // {
  //   path: `sales-product-inward`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ProductInwardLists} />,
  // </Suspense>)},
  // {
  //   path: `sales-Manage-price`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ManagePrice} />,
  // </Suspense>)},

  // {
  //   path: `sales-offer`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={MyOffer} />,
  // </Suspense>)},
  // // {
  // //   path: "/sales-territory-list",
  // //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TerritoryList} />,
  // // </Suspense>)},

  // {
  //   path: `sales-target`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesTarget} />,
  // </Suspense>)},
  // {
  //   path: `sales-person-target`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesPersonTargets} />,
  // </Suspense>)},
  // {
  //   path: `sales-expense`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ExpenseList} />,
  // </Suspense>)},
  // {
  //   path: `sales-order-management`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesOrderRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-performance`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesPerformance} />,
  // </Suspense>)},
  // {
  //   path: `sales-schedule`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ScheduleRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-shipment`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={MyShipmentRight} />,
  // </Suspense>)},
  // {
  //   path: `sales/ShipmentDelivery`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ShipmentDeliveryList} />,
  // </Suspense>)},
  // {
  //   path: `sales-invoice`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesInvoiceRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-pending-invoice`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesPendingInvoiceRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-payments`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesMyPaymentRightCard} />,
  // </Suspense>)},
  // {
  //   path: `sales-customer-enquiry`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={EnquirydRightCard} />,
  // </Suspense>)},

  // karthick

  // {
  //   path: `sale-sales-feedbacktemplate`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Feedbacktemplate} />,
  // </Suspense>)},
  // {
  //   path: `settings/TaxSetup`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListTax} />,
  // </Suspense>)},
  // {
  //   path: `settings/FactorySetup`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={FactoryLists} />,
  // </Suspense>)},
  // {
  //   path: `SatisfactionSurveyReports`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SatisfactionSurvey} />,
  // </Suspense>)},
  // {
  //   path: `feedbacksummaryReport`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SummaryReport} />,
  // </Suspense>)},

  // analysis new routes start
  {
    path: `analytics`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AnalyticsLeftSide} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/salesbycustomer`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesByCustomer} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/activityoverview`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ActivityOverview} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesGoals`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesGoals} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/stageconversionbyowner`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={StageConversionByOwner} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/stagedurationanalysis`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={StageDurationAnalysis} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/TimetoFirstActionbyOwner`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TimetoFirstActionbyOwner} />,
      </Suspense>
    ),
  },

  {
    path: `analytics/CallDuration`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CallDuration} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/CallLengthVsTimeOfDay`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CallLengthVsTimeOfDay} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/CRMDashBoard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CRMDashBoard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesKPIDashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesKPIDashboard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/ChurnAnalysisDashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ChurnAnalysisDashboard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesDashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesDashboard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/KeyPerformanceIndicator`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={KeyPerformanceIndicator} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesOpportunitiesOverview`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesOpportunitiesOverview} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/OpportunitiesIndividualReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={OpportunitiesIndividualReport} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/ActivityIndividualReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ActivityIndividualReport} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/CustomerRententionDashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CustomerRententionDashboard} />,
      </Suspense>
    ),
  },

  {
    path: `analytics/CallActivities`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CallActivities} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/MonthlySalesDashboard`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={MonthlySalesDashboard} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesProductPerformance`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesProductPerformance} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/ExecutiveSalesPerformance`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ExecutiveSalesPerformance} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/TotalSalesAndGrowth`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TotalSalesAndGrowth} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SalesVolumeByChannel`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesVolumeByChannel} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/MonthlySalesActivityReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={MonthlySalesActivityReport} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/MonthlySalesCallReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={MonthlySalesCallReport} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/SimpleMonthlySalesReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SimpleMonthlySalesReport} />,
      </Suspense>
    ),
  },
  {
    path: `analytics/MonthlyRetailSales`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={MonthlyRetailSales} />,
      </Suspense>
    ),
  },

  // analysis new routes end

  {
    path: `analytics`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AnalyticsLeftSide} />,
      </Suspense>
    ),
  },

  {
    path: `customer-support-ticket-summary`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SummaryRightSideCardList} />,
      </Suspense>
    ),
  },
  {
    path: `customer-support/create-ticket`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TicketManagementTicket} />,
      </Suspense>
    ),
  },
  {
    path: `customer-support/ticket-livecharts`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={MainChat} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/ticket-status`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TicketStatus} />,
      </Suspense>
    ),
  },
  {
    path: `customer-support-sla`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SLA} />,
      </Suspense>
    ),
  },
  // routes for user task management
  // {
  //   path: `task/list-task1`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListTaskManagement1} />,
  // </Suspense>)},

  {
    path: `task-management`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TaskManagementList} />,
      </Suspense>
    ),
  },
  {
    path: `task-status`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TaskStatusKanben} />,
      </Suspense>
    ),
  },
  {
    path: `task-gantt-chart`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TaskGanttChart} />,
      </Suspense>
    ),
  },
  {
    path: `task-calendar`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TaskCalender} />,
      </Suspense>
    ),
  },

  // {
  //   path: `user/task-calendar`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TaskCalendarView2} />,
  // </Suspense>)},
  // {
  //   path: `user/update-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={UpdateTask2} />,
  // </Suspense>)},
  // {
  //   path: `user/assign-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AssignTaskLists2} />,
  // </Suspense>)},

  // {
  //   path: `task/calendar-view1`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TaskCalendarView1} />,
  // </Suspense>)},
  // {
  //   path: `task/project`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ProjectManagementLists} />,
  // </Suspense>)},
  // {
  //   path: `task/Milestone`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ManagementLists} />,
  // </Suspense>)},
  // {
  //   path: `task/Deliverables`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={DeliverablesLists} />,
  // </Suspense>)},
  // {
  //   path: `task/Resource`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ResourceLists} />,
  // </Suspense>)},
  // {
  //   path: `task/Resourcesummary`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Resourcesummary} />,
  // </Suspense>)},
  // {
  //   path: `task/assign-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AssignTask} />,
  // </Suspense>)},
  // {
  //   path: `usertask/update-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={UpdateTaskList} />,
  // </Suspense>)},
  // {
  //   path: `usertask/gantt-chart`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ProjectGanttChart} />,
  // </Suspense>)},

  // {
  //   path: `task/report`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TaskReport} />,
  // </Suspense>)},
  // {
  //   path: `sales-sales-Dashboard`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={DashboardSales} />,
  // </Suspense>)},
  // {
  //   path: `sale-sales-Accounts`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AccountSales} />,
  // </Suspense>)},
  // {
  //   path: `sales-sales-Conversations`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ConversationSales} />,
  // </Suspense>)},

  // routes for user admin

  // {
  //   path: `user-admin-dashboard`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AdminDashboard} />,
  // </Suspense>)},

  // routes for task management
  // {
  //   path: `task/list-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListTaskManagement} />,
  // </Suspense>)},
  // {
  //   path: `task/update-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={UpdateTask} />,
  // </Suspense>)},
  // {
  //   path: `task/assign-task`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AssignTaskLists} />,
  // </Suspense>)},
  // {
  //   path: `task/calendar-view`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TaskCalendarView} />,
  // </Suspense>)},

  // {
  //   path: `mail/email-lists`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AdminEmailLists} />,
  // </Suspense>)},

  // {
  //   path: `licence/list-licence`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListLicence} />,
  // </Suspense>)},
  // {
  //   path: `licence/create-licence`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={CreateLicence} />,
  // </Suspense>)},

  // {
  //   path: `storage/list-storage`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListStorage} />,
  // </Suspense>)},
  // {
  //   path: `storage/create-storage`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={CreateStorage} />,
  // </Suspense>)},

  // {
  //   path: `purchase/list-purchase`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListAddonPurchase} />,
  // </Suspense>)},
  // {
  //   path: `purchase/create-purchase`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={CreateAddonPurchase} />,
  // </Suspense>)},
  // {
  //   path: `plan/cancel-plan`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={CancelPlans} />,
  // </Suspense>)},

  // {
  //   path: `renewal/list-renewal`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListRenewal} />,
  // </Suspense>)},

  // {
  //   path: `lookup/list-lookup`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ListLookup} />,
  // </Suspense>)},
  // {
  //   path: `lookup/create-lookup`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={CreateLookup} />,
  // </Suspense>)},
  {
    path: `ticket/Developecreate-ticket`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={DeveloperTicket} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/ticket-Managementgroup`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={TicketsManagementGroup} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/ticket-Createdticketlist`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={CreatedTicketList} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/my-tickets`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={MyTickets} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/received-tickets`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={ReceivedTickets} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/list-ticket`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={ListTickets} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/create-ticket`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={CreateTickets} />,
      </Suspense>
    ),
  },
  {
    path: `ticket/ticket-response`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        {" "}
        <ProtectedRoute component={ViewTicketResponse} />,
      </Suspense>
    ),
  },

  // settings submenu url
  {
    path: `settings/add-menu`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AddMenuList} />,
      </Suspense>
    ),
  },
  {
    path: `settings/general`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={GeneralSettings} />,
      </Suspense>
    ),
  },
  {
    path: `settings/edit-company-details`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={EditCompanyDetails} />,
      </Suspense>
    ),
  },
  {
    path: `settings/roles&users`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={RolesAndUsers} />,
      </Suspense>
    ),
  },
  {
    path: `/settings/TaxSetup`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ListTax} />,
      </Suspense>
    ),
  },
  {
    path: `/settings/FactorySetup`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={FactoryLists} />,
      </Suspense>
    ),
  },
  {
    path: `/AddAgent`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AddAgent} />,
      </Suspense>
    ),
  },

  {
    path: `settings/users/registration-form`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={RegistrationForm} />,
      </Suspense>
    ),
  },

  {
    path: `settings/transaction-approval`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TransactionApproval} />,
      </Suspense>
    ),
  },
  {
    path: `settings/preferences/transaction-series`, //inside of preference menu
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={TransactionSeries} />,
      </Suspense>
    ),
  },
  {
    path: `settings/system-preference`, //inside of preference menu
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SystemPreference} />,
      </Suspense>
    ),
  },

  {
    path: `settings/organization-structure`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={OrganizationStructure} />,
      </Suspense>
    ),
  },
  {
    path: `settings/Setup`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SetupList} />,
      </Suspense>
    ),
  },

  {
    path: `settings/storage-price`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={StorageList} />,
      </Suspense>
    ),
  },
  {
    path: `settings/user-master`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={UserMasterList} />,
      </Suspense>
    ),
  },
  {
    path: `settings/addon-price`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AddonList} />,
      </Suspense>
    ),
  },
  {
    path: `settings/lookup-list`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ListLookup} />,
      </Suspense>
    ),
  },


  // {
  //   path: `task/Hierarchy`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={TaskHierarchy} />,
  // </Suspense>)},
  {
    path: `sales-sales-Notifications`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={NotificationSales} />,
      </Suspense>
    ),
  },

  {
    path: `Add-Formbuilder`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={FormBuilder} />,
      </Suspense>
    ),
  },
  {
    path: `CFList/:id`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CFList} />,
      </Suspense>
    ),
  },
  // {
  //   path: `SalesCallActivity`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesPersonTarget} />,
  // </Suspense>)},
  // {
  //   path: `AddAgent`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={AddAgent} />,
  // </Suspense>)},
  {
    path: `ChatandSupport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ChatandSupport} />,
      </Suspense>
    ),
  },

  //--------------------------------- Report Routes Start --------------------------------------------
  {
    path: `reports/SalesPipeLineReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesPipeLineReport} />,
      </Suspense>
    ),
  },
  {
    path: `reports/SalesAchievements`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesAchievements} />,
      </Suspense>
    ),
  },
  // {
  //   path:  `reports/SalesForecastReport`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={SalesPipeLineReport} />,
  // </Suspense>)},
  {
    path: `reports/SalesRepPerformanceReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesRepPerformanceReport} />,
      </Suspense>
    ),
  },
  {
    path: `reports/ProAndSerPerformanceReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ProAndSerPerformanceReport} />,
      </Suspense>
    ),
  },
  {
    path: `reports/SalesForecastReport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesForecastReports} />,
      </Suspense>
    ),
  },
  {
    path: `reports/SalesActivityReports`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesActivityReports} />,
      </Suspense>
    ),
  },


  // {
  //   path: `FeedBack-QualifyQuestions`,
  //   element: <Page component={FeedbackQstpage} layout={"solo-page"} />,
  // },
  {
    path: "/MLAnalytics",
    element: <Page component={MainPage} layout={"solo-page"} />,
  },
  // {
  //   path: `sale-sales-feedback`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Feedback} />,
  // </Suspense>)},

  //karthik add

  {
    path: `reports/salesFunnelreport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SalesFunReport} />,
      </Suspense>
    ),
  },
  {
    path: `reports/PipelineDevelopmentreport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={PipelineDevReports} />,
      </Suspense>
    ),
  },
  {
    path: `reports/StageDistributionCRMreport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={StagedisCRMreports} />,
      </Suspense>
    ),
  },
  // {
  //   path: `sales-productCategory`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Product_Catagory} />,
  // </Suspense>)},
  // {
  //   path: `sales-productGroup`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Product_Group} />,
  // </Suspense>)},
  // {
  //   path: `sales-productItem`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={Product_Item} />,
  // </Suspense>)},
  // {
  //   path: `sales-shipmentcalender`,
  //   element:  (<Suspense fallback={<CRMCustomLoader />}> <ProtectedRoute component={ShipmentCalender} />,
  // </Suspense>)},
  {
    path: `reports/Dailysalesreport`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={DailySalesReport} />,
      </Suspense>
    ),
  },

  // customer module routes

  // sales module routes
  {
    path: `subscription`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={SubscriptionList} />,
      </Suspense>
    ),
  },

  {
    path: `products`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ListProduct} />,
      </Suspense>
    ),
  },
  {
    path: `plan`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={PlanList} />,
      </Suspense>
    ),
  },
  {
    path: `sale-invoice`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={InvoiceList} />,
      </Suspense>
    ),
  },
  {
    path: `sales-payments`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={PaymentList} />,
      </Suspense>
    ),
  },
  {
    path: `sales-instance-request`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={InstanceRequest} />,
      </Suspense>
    ),
  },
  {
    path: `AdditionalAddonSubscription`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AddonSubscription} />,
      </Suspense>
    ),
  },
  {
    path: `customer-additoinal-storage`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={AdditionalStorageList} />,
      </Suspense>
    ),
  },
  {
    path: `customer-additoinal-licence`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={ChangePlanList} />,
      </Suspense>
    ),
  },
  {
    path: `customer-renewal`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={RenewalDueList} />,
      </Suspense>
    ),
  },
  {
    path: `CancellationofPlanlist`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={CancellationofPlanlist} />,
      </Suspense>
    ),
  },
  {
    path: `landing-page`,
    element: (
      <Suspense fallback={<CRMCustomLoader />}>
        <ProtectedRoute component={LandingPage} />,
      </Suspense>
    ),
  },
];

/**
 routes only accessible to authenticated users
 **/
const routesForAuthenticatedOnly = [];

/**
 routes only accessible when user is anonymous
 **/
const routesForNotAuthenticatedOnly = [
  // {
  //     path: "/login",
  //     element: <ProtectedRoute component={Login} layout={"solo-page"} disableSmLogin={false}/>
  // },
  // {
  //     path: "/",
  //     element: <Page component={LandingPage} layout={"solo-page"} disableSmLogin={true} />
  // },

  // {
  //   path: `/`,
  //   element: <Navigate to={`/${Tenantname}`} replace={true} />,
  // },
  {
    path: `/`,
    element:
      Tenantname && Tenantname !== "admin" ? (
        <Page component={login} layout={"solo-page"} disableSmLogin={true} />
      ) : (
        <Page
          component={IntroPage}
          layout={"solo-page"}
          disableSmLogin={true}
        />
      ),
  },
  // {
  //   path: `/${Tenantname}`,
  //   element: (
  //     <Page component={login} layout={"solo-page"} disableSmLogin={true} />
  //   ),
  // },

  {
    path: "/auth-pages/forgot-password",
    element: (
      <Page
        component={ForgotPassword}
        layout={"solo-page"}
        disableSmLogin={true}
      />
    ),
  },
  {
    path: `auth-pages/ResetPassWord`,
    element: (
      <Page
        component={ResetPassword}
        layout={"solo-page"}
        disableSmLogin={true}
      />
    ),
  },
];

const routes = [
  ...routesForPublic,
  ...routesForAuthenticatedOnly,
  ...routesForNotAuthenticatedOnly,
];

export {
  routes as default,
  routesForPublic,
  routesForNotAuthenticatedOnly,
  routesForAuthenticatedOnly,
};
