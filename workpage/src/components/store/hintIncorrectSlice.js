import { createSlice } from '@reduxjs/toolkit'

const hintIncorrectSlice = createSlice({
    name: 'hintIncorrect',
    initialState: {
        data: null
    },

    reducers: {
        setDataHintIncorrect: (state, action) => {
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        }
    }
})

export const { setDataHintIncorrect, getData } = hintIncorrectSlice.actions
export default hintIncorrectSlice.reducer