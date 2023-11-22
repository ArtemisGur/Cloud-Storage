import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: 'default'
    },

    reducers: {
        setUser: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer