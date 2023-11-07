import { configureStore } from "@reduxjs/toolkit";
import internalFilesSlice from './internalFilesSlice'
import storagesSlice from "./storagesSlice";
import searchStorages from "./searchSlice"
import ownStorageSlice from "./ownStorageSlice";

const store = configureStore({
    reducer: {
        internalFile: internalFilesSlice,
        storages: storagesSlice,
        searchedStorages: searchStorages,
        ownStorages: ownStorageSlice
    }
})

export default store