import { createSlice } from '@reduxjs/toolkit'

const roleSlice = createSlice({
    name: 'role',
    initialState: {
        data: 'default'
    },

    reducers: {
        setUserRole: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setUserRole } = roleSlice.actions
export default roleSlice.reducer