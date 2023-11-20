import { createSlice } from '@reduxjs/toolkit'

const userListSlice = createSlice({
    name: 'userList',
    initialState: {
        data: null
    },

    reducers: {
        setDataUsers: (state, action) => {
            state.data = action.payload
        },
        deleteDataUser: (state, action) => {
            state.data = state.data.filter((item) => item.key !== action.payload)
        },
        changeDataUser: (state, action) => {
            state.data[action.payload.key].role = action.payload.role
        },
        addFile: (state, action) => {
            state.data.push(action.payload)
        },
        changeAllRoles: (state, action) => {
            for (let i = 0; i < state.data.length; i++){
                state.data[i].role = action.payload.role
            }
        }
    }
})

export const { setDataUsers, deleteDataUser, changeDataUser, changeAllRoles, addFile } = userListSlice.actions
export default userListSlice.reducer