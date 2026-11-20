import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { superAdminApi } from "../../services/superadmindashboardAPI/superAdminApi";
import contactsApp from "./contactsApp";
import viewOptionReducer from "../self_service_BI/ViewOptionSlice";
import salesForecastReducer from "../self_service_BI/SaleForecastSlice";
import locationApp from "./locationApp";
import UserRolePermissionsReducer from '../actions/fetchUserRolePermissions';     // added by ponkumar on 11-07-2024
import DateFormatterReducer from '../actions/fetchDateFormater';     // added by ponkumar on 02-08-2024
import CustomFormReducer from '../actions/fetchCustomForms';     // added by ponkumar on 09-08-2024


// import chatreducer from "../chat/ChatSlice"
// import audioCallReducer from "../chat/audioCall"
// import videoCallReducer from "../chat/videoCall"
// import alluserlists from "../../pages/chat/ChatUserListSlice"
// import selectUser  from 'app/pages/chat/dashboard/SelectChatUserSlice';

import { createLookupApi } from "../../pages/settings/lookup/CreateLookupAPI";
import { addonApi } from "../../pages/settings/addons/AddonAPI";
import { chatBaseApi } from "../../services/ChatBaseApi";

const exportReducers = (history) => {
  return combineReducers({
    router: connectRouter(history),
    [superAdminApi.reducerPath]: superAdminApi.reducer,
    [createLookupApi.reducerPath]: createLookupApi.reducer,
    [addonApi.reducerPath]: addonApi.reducer,
    [chatBaseApi.reducerPath]: chatBaseApi.reducer,
    contactsApp: contactsApp,
    selfServiceViewOptions: viewOptionReducer,
    salesForecast: salesForecastReducer,
    geoLocationReducer: locationApp,
    getUserRolePermissions: UserRolePermissionsReducer,     // added by ponkumar on 11-07-2024
    getDateFormatter: DateFormatterReducer,     // added by ponkumar on 02-08-2024
    getCustomForm: CustomFormReducer,     // added by ponkumar on 09-08-2024
    // locationKey:reducer
    // alluserlists:alluserlists,
    // selectuser:selectUser,
    // selectuser:chatreducer,
    // audioCall: audioCallReducer,
    // videoCall: videoCallReducer,
  });
};

export default exportReducers;
