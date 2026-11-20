// actions.js
export const SET_GOOGLE_MAPS_API_KEY = 'SET_GOOGLE_MAPS_API_KEY';

export const setGoogleMapsApiKey = (apiKey) => ({
    
  type: SET_GOOGLE_MAPS_API_KEY,
  payload: apiKey,
});
