import { createSlice } from "@reduxjs/toolkit"

// select conversation user
const isLoading ="success"

export const loadingSlicer = createSlice({
    name: "loading",
    isLoading,
    reducers: {
        setLoadingFullPageFunc: (state, action) => {
            state = action.payload
        },
    }
})

export const { setLoadingFullPageFunc,} = loadingSlicer.actions;
export const isLoadings = (state)=> state.isLoading
export default loadingSlicer.reducer
