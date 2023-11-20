import { createSlice } from '@reduxjs/toolkit'

const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState: {
        data: null
    },

    reducers: {
        setDataPasswordStorage: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setDataPasswordStorage } = changePasswordSlice.actions
export default changePasswordSlice.reducer