import { configureStore } from "@reduxjs/toolkit";
import internalFilesSlice from './internalFilesSlice'
import storagesSlice from "./storagesSlice";
import searchStorages from "./searchSlice"
import ownStorageSlice from "./ownStorageSlice";
import subscribedStorageSlice from "./subscribedStorageSlice";
import storageTypePasswordSlice from "./storageTypePasswordSlice";

const store = configureStore({
    reducer: {
        internalFile: internalFilesSlice,
        storages: storagesSlice,
        searchedStorages: searchStorages,
        ownStorages: ownStorageSlice,
        subscribedStorage: subscribedStorageSlice,
        storageTypePassword: storageTypePasswordSlice
    }
})

export default store