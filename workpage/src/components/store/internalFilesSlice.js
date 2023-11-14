import { createSlice } from '@reduxjs/toolkit'

const internalFilesSlice = createSlice({
    name: 'file',
    initialState: {
        data: null
    },

    reducers: {
        setDataFiles: (state, action) => {
            console.log(action.payload)
            state.data = action.payload
        },
        getData: (state) => {
            return state.data.data
        },
        deleteData: (state, action) => {
            state.data = state.data.filter((item) => item.key !== action.payload)
        },
        addFile: (state, action) => {
            state.data.push(action.payload)
        } 
    }
})

export const { setDataFiles, getData, deleteData, addFile } = internalFilesSlice.actions
export default internalFilesSlice.reducer