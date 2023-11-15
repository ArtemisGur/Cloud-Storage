import { createSlice } from '@reduxjs/toolkit'

const hintEmptySlice = createSlice({
    name: 'hintEmpty',
    initialState: {
        data: null
    },

    reducers: {
        setDataHintEmpty: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        }
    }
})

export const { setDataHintEmpty, getData } = hintEmptySlice.actions
export default hintEmptySlice.reducer