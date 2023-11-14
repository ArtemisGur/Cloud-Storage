import { createSlice } from '@reduxjs/toolkit'

const folderSlice = createSlice({
    name: 'folder',
    initialState: {
        data: null
    },

    reducers: {
        setDataFolderFirst: (state, action) => {
            state.data = action.payload
        },
        setDataFolder: (state, action) => {
            state.data = state.data + '/' + action.payload
        },
        navFolder: (state, action) => {
            state.data = state.data.slice(0, state.data.length - action.payload.length - 1)
        },
        getDataFolder: (state) => {
            return state.data
        }
    }
})

export const { setDataFolder, getDataFolder, setDataFolderFirst, navFolder } = folderSlice.actions
export default folderSlice.reducer