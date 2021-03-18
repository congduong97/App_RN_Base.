import React, { useEffect } from "react";
import { Provider } from "react-redux";
import AppProvider from "./AppProvider";
import RootNavigation from "./navigations";
import myStore from "./redux/store";
import LoadingView from "./components/LoadingView";

export default function App() {
  return (
    <Provider store={myStore}>
      <LoadingView />
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </Provider>
  );
}
