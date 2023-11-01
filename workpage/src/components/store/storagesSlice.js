import { createSlice } from '@reduxjs/toolkit'

const searchStorages = createSlice({
    name: 'storages',
    initialState: {
        data: null
    },

    reducers: {
        setData: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        },
        // deleteData: (state, action) => {
        //     state.data = state.data.filter((item) => item.key !== action.payload)
        // },
        // addFile: (state, action) => {
        //     state.data.push(action.payload)
        // } 
    }
})

export const { setData, getData } = searchStorages.actions
export default searchStorages.reducer