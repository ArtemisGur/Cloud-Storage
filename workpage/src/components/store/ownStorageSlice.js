import { createSlice } from '@reduxjs/toolkit'

const ownStorage = createSlice({
    name: 'ownStorages',
    initialState: {
        data: null
    },

    reducers: {
        setDataOwn: (state, action) => {
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

export const { setDataOwn, getData } = ownStorage.actions
export default ownStorage.reducer