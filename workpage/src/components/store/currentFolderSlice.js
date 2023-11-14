import { createSlice } from '@reduxjs/toolkit'

const currentFolderSlice = createSlice({
    name: 'currentFolder',
    initialState: {
        data: null
    },

    reducers: {
        setDataCurrentFolder: (state, action) => {
            state.data = action.payload
        },
        setDataCurrentFolder_2: (state, action) => {
            let data = action.payload.split('/')
            console.log(data)
            state.data = data[data.length - 1]
        }
    }
})

export const { setDataCurrentFolder, setDataCurrentFolder_2 } = currentFolderSlice.actions
export default currentFolderSlice.reducer