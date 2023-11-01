import { configureStore } from "@reduxjs/toolkit";
import internalFilesSlice from './internalFilesSlice'
import storagesSlice from "./storagesSlice";

const store = configureStore({
    reducer: {
        internalFile: internalFilesSlice,
        storages: storagesSlice,
    }
})

export default store