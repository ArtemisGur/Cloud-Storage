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
        deleteDataOwn: (state, action) => {
            state.data = state.data.filter((item) => item.key !== action.payload)
        }
    }
})

export const { setDataOwn, getData, deleteDataOwn } = ownStorage.actions
export default ownStorage.reducer