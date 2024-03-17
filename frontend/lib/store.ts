import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { categoryApi } from "./features/categorySlice";
import { branchApi } from "./features/branchSlice";
import { productApi } from "./features/product.sclice";
import { inventoryApi } from "./features/inventorySlice";
import { memberApi } from "./features/memberSlice";
import { distributeApi } from "./features/distributeSlice";
import { saleApi } from "./features/saleSlice";
import { statApi } from "./features/statSlice";
import { authApi } from "./features/authSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [branchApi.reducerPath]: branchApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [inventoryApi.reducerPath]: inventoryApi.reducer,
      [memberApi.reducerPath]: memberApi.reducer,
      [distributeApi.reducerPath]: distributeApi.reducer,
      [saleApi.reducerPath]: saleApi.reducer,
      [statApi.reducerPath]: statApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        branchApi.middleware,
        categoryApi.middleware,
        productApi.middleware,
        inventoryApi.middleware,
        memberApi.middleware,
        distributeApi.middleware,
        saleApi.middleware,
        statApi.middleware,
        authApi.middleware,
        
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
