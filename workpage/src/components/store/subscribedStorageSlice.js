import { createSlice } from '@reduxjs/toolkit'

const subscribedStorage = createSlice({
    name: 'subscribedStorages',
    initialState: {
        data: null
    },

    reducers: {
        setDataSubscribed: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        },
    }
})

export const { setDataSubscribed, getData } = subscribedStorage.actions
export default subscribedStorage.reducer