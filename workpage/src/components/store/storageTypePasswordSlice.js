import { createSlice } from '@reduxjs/toolkit'

const storageTypePassword = createSlice({
    name: 'searchStorages',
    initialState: {
        data: null
    },

    reducers: {
        setDataStorageType: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setDataStorageType } = storageTypePassword.actions
export default storageTypePassword.reducer