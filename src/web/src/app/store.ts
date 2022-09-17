import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
// import {itemsApi} from "../features/counter/fillStoreFromJson";
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        // [itemsApi.reducerPath]: itemsApi.reducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(itemsApi.middleware)
});
setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;

