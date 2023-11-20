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
        }
    }
})

export const { setData, getData } = searchStorages.actions
export default searchStorages.reducer