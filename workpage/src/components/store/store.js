import { configureStore } from "@reduxjs/toolkit";
import internalFilesSlice from './internalFilesSlice'
import storagesSlice from "./storagesSlice";
import searchStorages from "./searchSlice"
import ownStorageSlice from "./ownStorageSlice";
import subscribedStorageSlice from "./subscribedStorageSlice";
import storageTypePasswordSlice from "./storageTypePasswordSlice";
import foldersSlice from "./foldersSlice";
import currentFolderSlice from "./currentFolderSlice";
import hintEmptySlice from "./hintEmptySlice";
import hintIncorrectSlice from "./hintIncorrectSlice";
import hintCorrectSlice from "./hintCorrectSlice";
import roleSlice from "./roleSlice";
import userListSlice from "./userListSlice";
import changePasswordSlice from "./changePasswordSlice";

const store = configureStore({
    reducer: {
        internalFile: internalFilesSlice,
        storages: storagesSlice,
        searchedStorages: searchStorages,
        ownStorages: ownStorageSlice,
        subscribedStorage: subscribedStorageSlice,
        storageTypePassword: storageTypePasswordSlice,
        folder: foldersSlice,
        currentFolder: currentFolderSlice,
        hintEmpty : hintEmptySlice,
        hintIncorrect : hintIncorrectSlice,
        hintCorrect : hintCorrectSlice,
        role : roleSlice,
        userList : userListSlice,
        changePassword : changePasswordSlice
    }
})

export default store