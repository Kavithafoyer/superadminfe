import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from 'app/services/auth-services';
import axios from 'axios';
import { BsFileRuledFill } from 'react-icons/bs';


export const fetchCustomForms = createAsyncThunk('data/getCustomForm',
    async () => {
        const token = localStorage.getItem('accesstoken')
        if (token) {
            try {
                const response = await axios.get(`${BASE_URL}/user/CustomizeFormlist/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    }
                });
                console.log("Response fromredux:", response?.data);
                const dynamicForm = response?.data?.map((form) => ({
                    id: null,
                    type: "nav-item",
                    title: form?.FormName,
                    icon: (
                        <BsFileRuledFill
                            className="sideBarIcon"
                            style={{
                                fontSize: 14,
                                color: form?.Is_Active ? "#666565" : "#CDCDCD",
                            }}
                        />
                    ),
                    path: form?.Is_Active ? `/CFList/${form?.id}` : null,
                }));

                console.log("menumenumenu....", dynamicForm)
                return dynamicForm;
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        }
    });

const initialState = {
    data: [],
    loading: false,
    error: null,
};

export const CustomFormSlice = createSlice({
    name: 'getCustomForm',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomForms.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear error state when starting to fetch
            })
            .addCase(fetchCustomForms.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null; // Clear error state on successful fetch
            })
            .addCase(fetchCustomForms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export the reducer
export const selectedCustomForm = (state) => state.getCustomForm?.data?.map((opt) => opt) || []
export default CustomFormSlice.reducer;