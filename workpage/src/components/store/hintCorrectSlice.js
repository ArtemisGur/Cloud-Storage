import { createSlice } from '@reduxjs/toolkit'

const hintCorrectSlice = createSlice({
    name: 'hintCorrect',
    initialState: {
        data: null
    },

    reducers: {
        setDataHintCorrect: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        }
    }
})

export const { setDataHintCorrect, getData } = hintCorrectSlice.actions
export default hintCorrectSlice.reducer