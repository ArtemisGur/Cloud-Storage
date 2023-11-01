import { createSlice } from '@reduxjs/toolkit'

const searchedStoragesSlice = createSlice({
    name: 'searchStorages',
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

export const { setData, getData } = searchedStoragesSlice.actions
export default searchedStoragesSlice.reducer