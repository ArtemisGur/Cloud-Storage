import { createSlice } from '@reduxjs/toolkit'

const currentStorage = createSlice({
    name: 'currentStorage',
    initialState: {
        data: null
    },

    reducers: {
        setDataCurrentStorage: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        }
    }
})

export const { setDataCurrentStorage, getData } = currentStorage.actions
export default currentStorage.reducer